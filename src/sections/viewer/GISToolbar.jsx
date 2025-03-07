import { FaHome, FaSearch, FaBell, FaStreetView, FaMap, FaLayerGroup, FaRoute, FaDrawPolygon, FaRegSave, FaUpload, FaDownload, FaRegCompass, FaGlobe } from 'react-icons/fa';
import { useState } from 'react';
import { TILE_LAYERS } from '../map_tile_providerGISViewer'

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
        <div className="absolute bg-white shadow-lg rounded-md mt-2 w-48 z-50 p-2 right-0 md:left-0 md:right-auto max-w-xs md:max-w-sm overflow-hidden border border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

function ToolbarButton({ icon, label }) {
  return (
    <button className="flex flex-col items-center text-white hover:text-blue-400 transition duration-300 p-2" title={label}>
      {icon}
    </button>
  );
}

const GISToolbar = ({ onTileLayerChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleTileLayerChange = (layer) => {
    onTileLayerChange(layer);
    setOpenDropdown(null);
  };

  return (
    <div className="bg-gray-800 p-2 shadow-md">
      <div className="container mx-2 flex space-x-2">
        {/* Navigation Tools */}
        <div className="flex space-x-2 bg-gradient-to-r from-blue-900 to-blue-400 rounded-lg">
          <ToolbarButton icon={<FaHome size={15} />} label="Home" />
          <ToolbarButton icon={<FaSearch size={15} />} label="Search" />
          <ToolbarButton icon={<FaBell size={15} />} label="Alerts" />
          <ToolbarButton icon={<FaRegCompass size={15} />} label="Compass" />
          <ToolbarButton icon={<FaGlobe size={15} />} label="Global View" />
          <ToolbarButton icon={<FaStreetView size={15} />} label="Street View" />
        </div>
        
        {/* Mapping Tools */}
        <div className="flex space-x-2 bg-gradient-to-r from-blue-900 to-blue-400 rounded-lg">
          <ToolbarButton icon={<FaLayerGroup size={15} />} label="Layers" />
          <Dropdown
            label="Map Tiles"
            isOpen={openDropdown === "Change Map Tile"}
            onToggle={() => toggleDropdown("Change Map Tile")}
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
          <ToolbarButton icon={<FaRoute size={15} />} label="Routes" />
          <ToolbarButton icon={<FaDrawPolygon size={15} />} label="Draw" />
          <ToolbarButton icon={<FaRegSave size={15} />} label="Save" />
          <ToolbarButton icon={<FaUpload size={15} />} label="Upload" />
        </div>

        {/* Data Tools */}
        <div className="flex space-x-2 bg-gradient-to-r from-blue-900 to-blue-400 rounded-lg">
          <ToolbarButton icon={<FaDownload size={15} />} label="Download" />
          <ToolbarButton icon={<FaRegSave size={15} />} label="Export" />
          <ToolbarButton icon={<FaUpload size={15} />} label="Import" />
          <ToolbarButton icon={<FaLayerGroup size={15} />} label="Layers" />
          <ToolbarButton icon={<FaMap size={15} />} label="Map Data" />
          <ToolbarButton icon={<FaStreetView size={15} />} label="Street Data" />
        </div>
      </div>
    </div>
  );
};

export default GISToolbar;
