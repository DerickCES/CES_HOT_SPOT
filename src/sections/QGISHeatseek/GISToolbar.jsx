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
    if (layer === 'Connections') {
      setOpenSubDropdown(!layers.Connections);
      onConnectionsChange({ ...connectionStatus, Connections: !layers.Connections });
      toggleSubDropdown()
    }
  };

  const handleConnectionStatusToggle = (status) => {
    const newConnectionStatus = { ...connectionStatus, [status]: !connectionStatus[status] };
    onConnectionsChange(newConnectionStatus);
  };

  return (
    <div className="bg-gray-800 p-2 shadow-md">
      <div className="container mx-2 flex space-x-2">
        {/* Toolbar components */}
        <div className="flex space-x-2 bg-gradient-to-r from-blue-900 to-blue-400 rounded-lg">
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
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={layers.Poles}
                    onChange={() => handleLayerToggle('Poles')}
                  />
                  <span>Poles</span>
                </label>

                <label className="flex items-center space-x-2 relative">
                  <input
                    type="checkbox"
                    checked={layers.Connections}
                    onChange={() => handleLayerToggle('Connections')}
                  />
                  <span>Connections</span>
                  {layers.Connections && openSubDropdown && (
                    <div className="absolute left-44 top-0 bg-white shadow-lg rounded-md p-2 border border-gray-300 w-36">
                      {['INA', 'Dormant', 'Active'].map((status) => (
                        <label key={status} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={connectionStatus[status]}
                            onChange={() => handleConnectionStatusToggle(status)}
                          />
                          <span>{status}</span>
                        </label>
                      ))}
                    </div>
                  )}
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
