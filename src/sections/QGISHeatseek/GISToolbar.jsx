import { FaLayerGroup, FaMap } from 'react-icons/fa';
import { useState } from 'react';
import { TILE_LAYERS } from '../map_tile_providerGISViewer';

const Dropdown = ({ label, isOpen, onToggle, children }) => {
  return (
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
};

const LayersDropdown = ({ label, isOpen, onToggle, children }) => {
  return (
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
};

const GISToolbar = ({
  layers,
  connectionStatus,
  onTileLayerChange,
  onConnectionsChange,
  onLayerToggle
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(false);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const toggleSubDropdown = () => {
    setOpenSubDropdown(!openSubDropdown);
  };

  const handleTileLayerChange = (layer) => {
    onTileLayerChange(layer);
    setOpenDropdown(null);
  };

  const handleLayerToggle = (layer) => {
    onLayerToggle(layer);
    // Only toggle the connection or pole layer
    if (layer === 'Connections') {
      // If Connections is toggled, we fetch the Connections layer
      onConnectionsChange({ ...connectionStatus, Connections: !layers.Connections });
    }
  };

  return (
    <div className="bg-gray-800 p-2 shadow-md">
      <div className="container mx-6 flex space-x-2">
        {/* Toolbar components */}
        <div className="flex space-x-2 bg-gradient-to-r from-sky-400 to-sky-600 text-sky-900 rounded-lg">
          {/* Map Tiles Dropdown */}
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

          {/* Layers Dropdown */}
          <LayersDropdown
            label="Layer View"
            isOpen={openDropdown === 'Change Layer View'}
            onToggle={() => toggleDropdown('Change Layer View')}
          >
            <div className="flex flex-col bg-gray-100 rounded-md shadow-md">
              <div className="space-y-2">
                {/* Poles Layer */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={layers.Poles}
                    onChange={() => handleLayerToggle('Poles')}
                  />
                  <span>Poles</span>
                </label>

                {/* Connections Layer */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={layers.Connections}
                    onChange={() => handleLayerToggle('Connections')}
                  />
                  <span>Connections</span>
                </label>
              </div>
            </div>
          </LayersDropdown>
        </div>
      </div>
    </div>
  );
};

export default GISToolbar;
