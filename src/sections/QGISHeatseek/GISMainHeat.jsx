import { useState, useEffect } from 'react';
import axios from 'axios';
import { TILE_LAYERS } from '../map_tile_providerGISViewer';
import GISToolbar from './GISToolbar';
import GISViewerHeat from './GISViewerHeat';
import DataFetcher from './DATA';
import GISMenuBar from './GISMenuBar';
import HeatmapLegend from './HeatmapLegend';


const GISMainHeat = () => {
  const [currentTileLayer, setCurrentTileLayer] = useState(TILE_LAYERS.OpenStreetMapUK);
  const [fetchedData, setFetchedData] = useState({ poles: [], connections: [] }); // Real fetched data
  const [layers, setLayers] = useState({
    Poles: false,
    Connections: false,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    INA: false,
    Dormant: false,
    Active: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data based on the type and status
  const fetchData = async (type, status = '') => {
    if (!type) {
      console.error('Type is required but missing.');
      setError('Type parameter is missing.');
      setLoading(false);
      return;
    }

    try {
      

      const response = await axios.get('https://hotspot-service.onrender.com/fetchData', {
        params: { type, ...(status ? { status } : {}) },
        timeout: 60000, // Wait for 60 seconds
      });

      

      if (!response.data || response.data.length === 0) {
        
        setError('No data available.');
        setFetchedData({ poles: [], connections: [] }); // Clear previous data
      } else {
        // Set fetched data based on type
        if (type === 'Poles') {
          setFetchedData((prevData) => ({ ...prevData, poles: response.data }));
        } else if (type === 'Connections') {
          setFetchedData((prevData) => ({ ...prevData, connections: response.data }));
        }
      }

      setLoading(false);
    } catch (err) {
    
      setError('Failed to fetch data from the backend');
      setLoading(false);
    }
  };

  // Trigger data fetch when layer toggles (for Poles and Connections)
  useEffect(() => {
    // If Poles is true, fetch Poles data
    if (layers.Poles) {
      fetchData('Poles');
    } else {
      setFetchedData((prevData) => ({ ...prevData, poles: [] })); // Clear Poles data when unchecked
    }

    // If Connections is true, fetch Connections data
    if (layers.Connections) {
      fetchData('Connections');
    } else {
      setFetchedData((prevData) => ({ ...prevData, connections: [] })); // Clear Connections data when unchecked
    }
  }, [layers]);

  // Trigger data fetch when connection status toggles
  useEffect(() => {
    if (layers.Poles || layers.Connections) {
      // If either Poles or Connections is enabled, trigger the corresponding fetch
      fetchData(layers.Poles ? 'Poles' : 'Connections', connectionStatus.Active ? 'Active' : '');
    }
  }, [connectionStatus]);

  // Handle layer toggle (Poles and Connections)
  const handleLayerToggle = (layer) => {
    setLayers((prevLayers) => {
      const newLayers = { ...prevLayers, [layer]: !prevLayers[layer] };
      return newLayers;
    });
  };

  // Handle connection status toggle
  const handleConnectionStatusToggle = (status) => {
    setConnectionStatus((prevStatus) => {
      const newStatus = { ...prevStatus, [status]: !prevStatus[status] };
      return newStatus;
    });
  };

  return (
	
    <div>
		<GISMenuBar/>
      <GISToolbar
        layers={layers}
        connectionStatus={connectionStatus}
        onTileLayerChange={setCurrentTileLayer}
        onConnectionsChange={setConnectionStatus}
        onLayerToggle={handleLayerToggle}
        onConnectionStatusToggle={handleConnectionStatusToggle}
      />
      <GISViewerHeat
        tileLayer={currentTileLayer}
        layers={layers}
        connectionStatus={connectionStatus}
        fetchedData={fetchedData} // Pass both poles and connections

      />
	  <HeatmapLegend/>
    </div>
  );
};

export default GISMainHeat;
