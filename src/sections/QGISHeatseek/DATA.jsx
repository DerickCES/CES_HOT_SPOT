import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState('Connections'); // Default type

  const fetchData = async (type, status = '') => {
    if (!type) {
      console.error('Type is required but missing.');
      setError('Type parameter is missing.');
      setLoading(false);
      return;
    }
  
    try {
      console.log('Fetching data with:', { type, status });
  
      const response = await axios.get('https://hotspot-service.onrender.com/fetchData', {
        params: { type, ...(status ? { status } : {}) },
        timeout: 60000, // Wait for 60 seconds
      });
  
      console.log('Received Data:', response.data); // Log response data
  
      if (!response.data || response.data.length === 0) {
        console.warn('Warning: No data received from backend');
        setError('No data available.');
        setData([]); // Clear previous data
      } else {
        setData(response.data); // Store data in state
      }
  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from the backend');
      setLoading(false);
    }
  };
  

  // Fetch data when the component mounts or type changes
  useEffect(() => {
    fetchData(type, ''); // Ensure status is passed, even if empty
  }, [type]);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message

  return (
    <div>
      <h1>{type} Data</h1>

      <div>
        <button onClick={() => setType('Poles')}>Poles</button>
        <button onClick={() => setType('Connections')}>Connections</button>
      </div>

      <div>
        {data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item.pk} style={{ marginBottom: '10px' }}>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default DataFetcher;
