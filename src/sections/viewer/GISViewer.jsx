import { useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { TILE_LAYERS } from '../map_tile_providerGISViewer'

const GISViewer = ({
  tileLayer
}) => {
  const [center] = useState({ lat: -33.9249, lng: 18.4241 });
  const _ZOOM_LEVEL = 18;
  const mapRef = useRef();


  return (
    <div className="h-screen relative">
      <MapContainer center={center} zoom={_ZOOM_LEVEL} ref={mapRef} className="h-full z-0">
        {/* Drawing Controls */}
        <FeatureGroup>
          <EditControl
            position="topleft"
            draw={{
              rectangle: true,
              circle: true,
              circlemarker: true,
              marker: true,
              polygon: true,
              polyline: true,
            }}
          />
        </FeatureGroup>

        {/* Tile Layer */}
        <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
      </MapContainer>
    </div>
  );
};

export default GISViewer;
