import { useState } from 'react';
import { TILE_LAYERS } from '../map_tile_providerGISViewer';
import GISToolbar from './GISToolbar';
import GISViewerHeat from './GISViewerHeat';
import { connectionsArray, polesArray } from './Array'; // Using your static arrays

const GISMainHeat = () => {
  const [currentTileLayer, setCurrentTileLayer] = useState(TILE_LAYERS.OpenStreetMapUK);
  const [modalJointInfo, setModalJointInfo] = useState("");
  const [fetchedData, setFetchedData] = useState({ poles: [], connections: [] }); // Using static arrays for now

  const [layers, setLayers] = useState({
    Poles: false,
    Connections: false,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    INA: false,
    Dormant: false,
    Active: false,
  });

  // Trigger data fetch when layer toggles (but using static arrays now)
  const handleLayerToggle = (layer) => {
    setLayers((prevLayers) => {
      const newLayers = { ...prevLayers, [layer]: !prevLayers[layer] };

      // If the layer for Poles is false, clear the poles data; otherwise, use the full data
      if (!newLayers.Poles) {
        setFetchedData((prevData) => ({ ...prevData, poles: [] }));  // Reset poles data if unchecked
      } else {
        setFetchedData((prevData) => ({ ...prevData, poles: polesArray })); // Use full poles data if checked
      }

      // If the layer for Connections is false, clear the connections data; otherwise, use the full data
      if (!newLayers.Connections) {
        setFetchedData((prevData) => ({ ...prevData, connections: [] }));  // Reset connections data if unchecked
      } else {
        setFetchedData((prevData) => ({ ...prevData, connections: connectionsArray })); // Use full connections data if checked
      }

      return newLayers;
    });
  };

  // Trigger data fetch when connection status toggles (but using static arrays now)
  const handleConnectionStatusToggle = (status) => {
    setConnectionStatus((prevStatus) => {
      const newStatus = { ...prevStatus, [status]: !prevStatus[status] };

      // Since we have static arrays, no need to fetch data for Connections
      if (!newStatus[status]) {
        setFetchedData((prevData) => ({ ...prevData, connections: [] }));  // Reset connections data if unchecked
      }

      return newStatus;
    });
  };

  return (
    <div>
      <GISToolbar
        layers={layers}
        connectionStatus={connectionStatus}
        onTileLayerChange={setCurrentTileLayer}
        onConnectionsChange={setConnectionStatus}
        onLayerToggle={handleLayerToggle}
        onConnectionStatusToggle={handleConnectionStatusToggle}  // Pass handler for connection status
      />
      <GISViewerHeat
        tileLayer={currentTileLayer}
        layers={layers}
        connectionStatus={connectionStatus}
        fetchedData={fetchedData} // Pass both poles and connections
      />
      
   
    </div>
  );
};

export default GISMainHeat;
