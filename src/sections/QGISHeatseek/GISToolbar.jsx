import React, { useState } from 'react';
import { FaLayerGroup, FaMap } from 'react-icons/fa';
import { TILE_LAYERS } from '../map_tile_providerGISViewer';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const Dropdown = ({ label, isOpen, onToggle, children }) => (
  <div className="relative inline-block">
    <button
      onClick={onToggle}
      className="flex flex-col items-center text-white hover:text-blue-400 transition duration-300 p-2"
      title={label}
    >
      <FaMap size={15} />
    </button>
    {isOpen && (
      <div className="absolute bg-white shadow-lg rounded-md mt-2 w-48 z-50 p-2 left-0 border border-gray-300">
        {children}
      </div>
    )}
  </div>
);

const LayersDropdown = ({ label, isOpen, onToggle, children }) => (
  <div className="relative inline-block">
    <button
      onClick={onToggle}
      className="flex flex-col items-center text-white hover:text-blue-400 transition duration-300 p-2"
      title={label}
    >
      <FaLayerGroup size={15} />
    </button>
    {isOpen && (
      <div className="absolute bg-white shadow-lg rounded-md mt-2 w-48 z-50 p-2 left-0 border border-gray-300">
        {children}
      </div>
    )}
  </div>
);

const GISToolbar = ({
  onDistributionPointsChange,
  onTileLayerChange,
  onDateChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [distributionPointsChecked, setDistributionPointsChecked] = useState(false);


  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleTileLayerChange = (layer) => {
    onTileLayerChange(layer);
    setOpenDropdown(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handleCheckboxChange = (event) => {
    onDistributionPointsChange(event.target.checked);
    setDistributionPointsChecked(event.target.checked)
  };

  return (
    <div className="bg-gray-800 p-2 shadow-md">
      <div className="container mx-6 flex space-x-2">
        <div className="flex space-x-2 bg-gradient-to-r from-sky-400 to-sky-600 text-sky-900 rounded-lg">
          <Dropdown
            label="Map Tiles"
            isOpen={openDropdown === 'Change Map Tile'}
            onToggle={() => toggleDropdown('Change Map Tile')}
          >
            <div className="flex flex-col bg-gray-100 rounded-md shadow-md">
              {Object.keys(TILE_LAYERS).map((layerKey) => (
                <button
                  key={layerKey}
                  onClick={() => handleTileLayerChange(TILE_LAYERS[layerKey])}
                  className="w-full text-left hover:bg-gray-300 rounded p-1"
                >
                  {layerKey}
                </button>
              ))}
            </div>
          </Dropdown>

          <LayersDropdown
            label="Layer View"
            isOpen={openDropdown === 'Change Layer View'}
            onToggle={() => toggleDropdown('Change Layer View')}
          >
            <div className="flex flex-col bg-gray-100 rounded-md shadow-md p-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month']}
                  label="Select Month and Year"
                  minDate={dayjs('2022-01-01')}
                  maxDate={dayjs('2025-12-31')}
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </LocalizationProvider>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={distributionPointsChecked}
                  onChange={handleCheckboxChange}
                />
                <span>Distribution Points</span>
              </label>
            </div>
          </LayersDropdown>
        </div>
      </div>
    </div>
  );
};

export default GISToolbar;
