import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // Import Leaflet Heatmap plugin
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster'; // Import the marker cluster plugin
import throttle from "lodash.throttle";

const GISViewerHeat = ({ tileLayer, fetchedData, layers, connectionStatus }) => {
  const [center] = useState({ lat: -34.0099, lng: 18.5808 });
  const _ZOOM_LEVEL = 14;
  const ZOOM_THRESHOLD = 16;
  const mapRef = useRef(null);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(_ZOOM_LEVEL);

  // Use ref to always have the latest fetchedData
  const fetchedDataRef = useRef(fetchedData);
  useEffect(() => {
    fetchedDataRef.current = fetchedData;
  }, [fetchedData]);

  // Persist the marker cluster group and last markers/ bounds in refs
  const markerClusterGroupRef = useRef(L.markerClusterGroup());
  const lastVisibleMarkersRef = useRef([]);
  const lastBoundsRef = useRef(null);

  // Memoized dot icon
  const dotIcon = useMemo(
    () =>
      new L.divIcon({
        className: "custom-dot-icon",
        html: '<div style="width: 12px; height: 12px; background-color: red; border-radius: 50%; border: 2px solid white;"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    []
  );

  // Function to parse geometry
  const parseGeom = useCallback((geom) => {
    if (!geom || typeof geom !== "string") return null;
    const match = geom.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match) {
      const lat = parseFloat(match[2]);
      const lng = parseFloat(match[1]);
      return [lat, lng];
    }
    console.error("Failed to parse geometry:", geom);
    return null;
  }, []);

  const updateVisibleMarkers = useCallback((map) => {
    const currentFetchedData = fetchedDataRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    if (lastBoundsRef.current && lastBoundsRef.current.equals(bounds)) return;
    lastBoundsRef.current = bounds;

    // 🔴 If both Poles & Connections are false, clear everything
    if (!layers.Poles && !layers.Connections) {
      setVisibleMarkers([]); // Clear visible markers
      markerClusterGroupRef.current.clearLayers(); // Remove cluster markers from map
      if (map.hasLayer(markerClusterGroupRef.current)) {
        map.removeLayer(markerClusterGroupRef.current);
      }
      return;
    }

    const filteredMarkers = [
      ...(layers.Poles ? currentFetchedData.poles : []).map((pole) => {
        const coords = parseGeom(pole.geom);
        if (!coords) return null;
        return { ...pole, coords };
      }),
      ...(layers.Connections ? currentFetchedData.connections : []).map((connection) => {
        const coords = parseGeom(connection.geom);
        if (!coords) return null;
        return { ...connection, coords };
      }),
    ].filter((item) => item?.coords && bounds.contains(item.coords));

    if (filteredMarkers.length !== lastVisibleMarkersRef.current.length) {
      lastVisibleMarkersRef.current = filteredMarkers;
      setVisibleMarkers(filteredMarkers);
    }

    // 🔵 Update Cluster Markers if Zoomed Out
    if (map.getZoom() < ZOOM_THRESHOLD) {
      markerClusterGroupRef.current.clearLayers();
      filteredMarkers.forEach(({ pk, name, type, pole_use, coords }) => {
        const marker = L.marker(coords, { icon: dotIcon }).bindPopup(
          `<b>Name:</b> ${name} <br /><b>Type:</b> ${type} <br /><b>Use:</b> ${pole_use}`
        );
        markerClusterGroupRef.current.addLayer(marker);
      });

      if (!map.hasLayer(markerClusterGroupRef.current)) {
        map.addLayer(markerClusterGroupRef.current);
      }
    } else {
      if (map.hasLayer(markerClusterGroupRef.current)) {
        map.removeLayer(markerClusterGroupRef.current);
      }
    }
  }, [layers.Poles, layers.Connections, parseGeom]);

  // Throttled version of updateVisibleMarkers (200ms delay)
  const throttledUpdateVisibleMarkers = useMemo(
    () => throttle(updateVisibleMarkers, 200),
    [updateVisibleMarkers]
  );

  // Map event handler: listen for zoom and move events
  const MapEventHandler = () => {
    const map = useMap();
    useEffect(() => {
      setCurrentZoom(map.getZoom());
      throttledUpdateVisibleMarkers(map);

      const onZoomEnd = () => {
        const zoom = map.getZoom();
        setCurrentZoom(zoom);
        throttledUpdateVisibleMarkers(map);
      };
      const onMoveEnd = () => {
        throttledUpdateVisibleMarkers(map);
      };

      map.on("zoomend", onZoomEnd);
      map.on("moveend", onMoveEnd);

      return () => {
        map.off("zoomend", onZoomEnd);
        map.off("moveend", onMoveEnd);
      };
    }, [map, throttledUpdateVisibleMarkers]);
    return null;
  };

  // Auto-zoom to fit markers when data arrives
  useEffect(() => {
    if (mapRef.current && (fetchedData.poles.length || fetchedData.connections.length)) {
      const map = mapRef.current;
      const bounds = L.latLngBounds([
        ...fetchedData.poles.map((p) => parseGeom(p.geom)),
        ...fetchedData.connections.map((c) => parseGeom(c.geom)),
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [fetchedData, parseGeom]);

  // Compute heatmap data arrays using useMemo for each category (based on strength_active)
  const connectionHeatData = useMemo(() => {
    if (!layers.Connections) return [];
    return (fetchedData.connections || [])
      .map((connection) => {
        const coords = parseGeom(connection.geom);
        if (!coords) return null;
        const strength = connection.strength_active != null ? connection.strength_active : 1;
        return [coords[0], coords[1], strength];
      })
      .filter(Boolean);
  }, [fetchedData.connections, layers.Connections, parseGeom]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

  // 🔄 **Normalize Values to Invert Strength**
  const adjustedHeatData = connectionHeatData.map(([lat, lng, strength]) => {
    const invertedStrength = 1 - strength; // Now 0.0 becomes 1.0 (strongest red)
    return [lat, lng, invertedStrength];
  });

  const redLayer = L.heatLayer(adjustedHeatData, {
    radius: 30,
    blur: 25,
    maxZoom: 16,
    max: 1, // Ensure normalization works
    gradient: {
      1.0: "#ff0000", // 🔴 **Now strongest at 0.0**
      0.65: "#ff6666",
      0.35: "#ff9999", // 🟥 Now fades at 0.35
      0.0: "#ffffff", // 🔄 **Now weakest at 1.0 (white/invisible)**
    },
    opacity: 0.9, // **Force visibility**
  });
    // 🟠 Orange Layer (Medium connections)
    const orangeLayer = L.heatLayer(
      connectionHeatData.filter(([lat, lng, strength]) => strength > 0.35 && strength <= 0.65),
      {
        radius: 30,
        blur: 25,
        maxZoom: 16,
        max: 0.65,
        gradient: {
          0.36: "#ff8000", // Mid orange
          0.65: "#ffb366", // Light orange
        },
      }
    );

    // 🟢 Green Layer (Strong connections)
    const greenLayer = L.heatLayer(
      connectionHeatData.filter(([lat, lng, strength]) => strength > 0.65),
      {
        radius: 30,
        blur: 25,
        maxZoom: 16,
        max: 1,
        gradient: {
          0.66: "#66ff33", // Light green
          1.0: "#00ff00", // Strong green
        },
      }
    );

    // 🗺️ Add layers to the map
    redLayer.addTo(map);
    orangeLayer.addTo(map);
    greenLayer.addTo(map);

    // Cleanup function to remove layers
    return () => {
      map.removeLayer(redLayer);
      map.removeLayer(orangeLayer);
      map.removeLayer(greenLayer);
    };
  }, [connectionHeatData]);

  return (
    <div className="h-screen relative">
      <MapContainer center={center} zoom={_ZOOM_LEVEL} ref={mapRef} className="h-full z-0">
        <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
        <MapEventHandler />
        {/* When zoomed in, render individual markers */}
        {currentZoom >= ZOOM_THRESHOLD &&
          visibleMarkers.map(({ pk, name, type, pole_use, coords, pole_name, ina, active, dormant, strength_active }) => (
            <Marker key={pk} position={coords} icon={dotIcon}>
              <Popup>
                <b>Pole Name:</b> {pole_name || name} <br />
                <b>Active Strength:</b> {active ?? "N/A"} <br />
                <b>Dormant Strength:</b> {dormant ?? "N/A"} <br />
                <b>Ina Strength:</b> {ina ?? "N/A"} <br />
                <b>Strength (Active) Percentage:</b> {strength_active != null ? `${(strength_active * 100).toFixed(2)}%` : "N/A"} <br />

              </Popup>
            </Marker>
          ))}
        {visibleMarkers.length === 0 && <p>No visible markers in the current view.</p>}
      </MapContainer>
    </div>
  );
};

export default GISViewerHeat;
