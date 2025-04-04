import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // Import Leaflet Heatmap plugin
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster'; // Import the marker cluster plugin
import throttle from "lodash.throttle";

const GISViewerHeat = ({ tileLayer, fetchedData, distpoint }) => {
  const [center] = useState({ lat: -34.0099, lng: 18.5808 });
  const _ZOOM_LEVEL = 14;
  const ZOOM_THRESHOLD = 16;
  const mapRef = useRef(null);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(_ZOOM_LEVEL);

  const fetchedDataRef = useRef(fetchedData);
  useEffect(() => {
    fetchedDataRef.current = fetchedData;
  }, [fetchedData]);

  const dispointRef = useRef(distpoint);
  useEffect(() => {
    dispointRef.current = distpoint;
  }, [distpoint]);

  const markerClusterGroupRef = useRef(L.markerClusterGroup());
  const lastVisibleMarkersRef = useRef([]);
  const lastBoundsRef = useRef(null);

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

  const parseGeom = useCallback((geom) => {
    if (!geom || typeof geom !== "string") return null;
    const match = geom.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match) return [parseFloat(match[2]), parseFloat(match[1])];
    return null;
  }, []);

  const updateVisibleMarkers = useCallback((map) => {
    const currentFetchedData = fetchedDataRef.current;
    if (!map || !currentFetchedData) return;

    const bounds = map.getBounds();
    if (lastBoundsRef.current && lastBoundsRef.current.equals(bounds)) return;
    lastBoundsRef.current = bounds;

    const poles = Array.isArray(currentFetchedData.result.poles) ? currentFetchedData.result.poles : [];
    const connections = Array.isArray(currentFetchedData.result.connections) ? currentFetchedData.result.connections : [];

    const filteredMarkers = poles
      .map((pole) => {
        const coords = parseGeom(pole.geom);
        if (!coords) return null;
        return { ...pole, coords };
      })
      .filter((item) => item?.coords && bounds.contains(item.coords));

    if (filteredMarkers.length !== lastVisibleMarkersRef.current.length) {
      lastVisibleMarkersRef.current = filteredMarkers;
      setVisibleMarkers(filteredMarkers);
    }

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
  }, [parseGeom]);

  const throttledUpdateVisibleMarkers = useMemo(() => throttle(updateVisibleMarkers, 200), [updateVisibleMarkers]);

  const MapEventHandler = () => {
    const map = useMap();
    useEffect(() => {
      setCurrentZoom(map.getZoom());
      throttledUpdateVisibleMarkers(map);

      const onZoomEnd = () => throttledUpdateVisibleMarkers(map);
      const onMoveEnd = () => throttledUpdateVisibleMarkers(map);

      map.on("zoomend", onZoomEnd);
      map.on("moveend", onMoveEnd);

      return () => {
        map.off("zoomend", onZoomEnd);
        map.off("moveend", onMoveEnd);
      };
    }, [map, throttledUpdateVisibleMarkers]);
    return null;
  };

  useEffect(() => {
    if (mapRef.current && fetchedData?.poles?.length + fetchedData?.connections?.length > 0) {
      const map = mapRef.current;
      if (!lastBoundsRef.current) {
        const bounds = L.latLngBounds([
          ...fetchedData.poles.map((p) => parseGeom(p.geom)).filter(Boolean),
          ...fetchedData.connections.map((c) => parseGeom(c.geom)).filter(Boolean),
        ]);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
          lastBoundsRef.current = bounds;
        }
      }
    }
  }, [fetchedData, parseGeom]);

  const connectionHeatData = useMemo(() => {
    const connections = Array.isArray(fetchedData.result?.connections) ? fetchedData.result.connections : [];
    return connections
      .map((connection) => {
        const coords = parseGeom(connection.geom);
        if (!coords) return null;
        const strength = connection.strength_active != null ? connection.strength_active : 1;
        return [coords[0], coords[1], strength];
      })
      .filter(Boolean);
  }, [fetchedData, parseGeom]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const adjustedHeatData = connectionHeatData.map(([lat, lng, strength]) => [lat, lng, 1 - strength]);

    const redLayer = L.heatLayer(adjustedHeatData, {
      radius: 30,
      blur: 25,
      maxZoom: 16,
      max: 1,
      gradient: {
        1.0: "#ff0000",
        0.75: "#ff4d4d",
        0.65: "#ff6666",
        0.50: "#ff8080",
        0.35: "#ff9999",
        0.20: "#ffcccc",
        0.0: "#ffffff",
      },
      opacity: 0.9,
    });

    const orangeLayer = L.heatLayer(
      connectionHeatData.filter(([, , strength]) => strength > 0.25 && strength <= 0.5),
      {
        radius: 30,
        blur: 25,
        maxZoom: 16,
        max: 0.5,
        gradient: {
          0.50: "#ff8000",
          0.45: "#ff9933",
          0.40: "#ffb366",
          0.35: "#ffcc99",
        },
      }
    );

    const yellowLayer = L.heatLayer(
      connectionHeatData.filter(([, , strength]) => strength > 0.5 && strength <= 0.75),
      {
        radius: 30,
        blur: 25,
        maxZoom: 16,
        max: 0.75,
        gradient: {
          0.75: "#ffff00",
          0.70: "#ffff33",
          0.65: "#ffff66",
          0.60: "#ffff99",
        },
      }
    );

    const greenLayer = L.heatLayer(
      connectionHeatData.filter(([, , strength]) => strength > 0.75),
      {
        radius: 30,
        blur: 25,
        maxZoom: 16,
        max: 1,
        gradient: {
          1.0: "#00ff00",
          0.85: "#33ff33",
          0.75: "#66ff66",
          0.66: "#99ff99",
        },
      }
    );

    redLayer.addTo(map);
    orangeLayer.addTo(map);
    yellowLayer.addTo(map);
    greenLayer.addTo(map);

    return () => {
      map.removeLayer(redLayer);
      map.removeLayer(orangeLayer);
      map.removeLayer(yellowLayer);
      map.removeLayer(greenLayer);
    };
  }, [connectionHeatData]);

  return (
    <div className="h-screen relative">
      <MapContainer center={center} zoom={_ZOOM_LEVEL} ref={mapRef} className="h-full z-0">
        <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
        <MapEventHandler />
        
        {/* Render red dots instantly based on distpoint */}
        {distpoint && currentZoom >= ZOOM_THRESHOLD &&
          visibleMarkers.map(({ pk, name, coords, pole_name }) => {
            const connections = fetchedData?.result?.connections || [];

            // Try to match using pole_name first, fallback to pk
            const connection = connections.find(
              (c) => c.pole_name === pole_name || c.pk === pk
            );

            return (
              <Marker key={pk} position={coords} icon={dotIcon}>
                <Popup>
                  <b>Name:</b> {pole_name || name} <br />
                  <b>Active Strength:</b> {connection?.active ?? "N/A"} <br />
                  <b>Dormant Strength:</b> {connection?.dormant ?? "N/A"} <br />
                  <b>Ina Strength:</b> {connection?.ina ?? "N/A"} <br />
                  <b>Strength (Active) Percentage:</b>{" "}
                  {connection?.strength_active != null
                    ? `${(connection.strength_active * 100).toFixed(2)}%`
                    : "N/A"}
                </Popup>
              </Marker>
            );
          })}
        
        {visibleMarkers.length === 0 && <p>No visible markers in the current view.</p>}
      </MapContainer>
    </div>
  );
};

export default GISViewerHeat;
