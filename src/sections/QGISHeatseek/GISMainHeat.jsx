import { useState, useEffect } from 'react';
import axios from 'axios';
import { TILE_LAYERS } from '../map_tile_providerGISViewer';
import GISToolbar from './GISToolbar';
import GISViewerHeat from './GISViewerHeat';
import DataFetcher from './DATA';
import GISMenuBar from './GISMenuBar';
import HeatmapLegend from './HeatmapLegend';
import dayjs from 'dayjs';


const GISMainHeat = () => {
  const [currentTileLayer, setCurrentTileLayer] = useState(TILE_LAYERS.GoogleHybrid);
  const [fetchedData, setFetchedData] = useState({ result: [] }); // Real fetched data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [distpoint, setDistributionPointsVisible] = useState(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formattedDate = newDate.format('MMYYYY');
    fetchData(formattedDate, distpoint);
  };

  const handleDistributionPointsChange = (isVisible) => {
    setDistributionPointsVisible(isVisible);
    const formattedDate = selectedDate.format('MMYYYY');
    fetchData(formattedDate, isVisible);
  };

  const fetchData = async (date, distpoint) => {
    if (!date) {
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get('https://hotspot-service.onrender.com/fetchData', {
        params: { date, distpoint },
        timeout: 60000, // 60 seconds timeout
      });
  
      if (response.data.result === "_F") {
        setError('No data available or table does not exist.');
        setFetchedData({ result: [] });
      } else {
        setFetchedData({ result: response.data });

        
      }
    } catch (err) {
      setError('Failed to fetch data from the backend');
      setFetchedData({ result: [] });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <GISMenuBar />
      <GISToolbar
        onTileLayerChange={setCurrentTileLayer}
        onDateChange={handleDateChange} // Ensure this function is defined in the parent
        onDistributionPointsChange={handleDistributionPointsChange}
      />
      <GISViewerHeat
        tileLayer={currentTileLayer}
        fetchedData={fetchedData}
        distpoint={distpoint} // Pass both poles and connections
      />
      <HeatmapLegend />
    </div>
  );
};

export default GISMainHeat;

