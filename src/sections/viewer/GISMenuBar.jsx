import React, { useState } from "react";

const Dropdown = ({ label, isOpen, onToggle, children }) => {
  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="text-white hover:text-blue-400 transition duration-300 px-2 py-1 text-sm"
      >
        {label}
      </button>
      {isOpen && (
        <div className="absolute bg-white shadow-lg rounded-md mt-1 w-40 z-50 p-1 left-0 border border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

const GISMenuBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="bg-blue-900 text-white py-2 shadow-md text-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Side: Dropdowns */}
        <div className="flex space-x-4">
        <Dropdown label="File" isOpen={openDropdown === 'File'} onToggle={() => toggleDropdown('File')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">New</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Open</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Save</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Export</button>
        </Dropdown>
        <Dropdown label="Edit" isOpen={openDropdown === 'Edit'} onToggle={() => toggleDropdown('Edit')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Undo</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Redo</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Cut</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Copy</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Paste</button>
        </Dropdown>
        <Dropdown label="View" isOpen={openDropdown === 'View'} onToggle={() => toggleDropdown('View')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Zoom In</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Zoom Out</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Full Screen</button>
        </Dropdown>
        <Dropdown label="Settings" isOpen={openDropdown === 'Settings'} onToggle={() => toggleDropdown('Settings')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Preferences</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Theme</button>
        </Dropdown>
        <Dropdown label="Plugins" isOpen={openDropdown === 'Plugins'} onToggle={() => toggleDropdown('Plugins')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Manage Plugins</button>
        </Dropdown>
        <Dropdown label="Filter" isOpen={openDropdown === 'Filter'} onToggle={() => toggleDropdown('Filter')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Apply Filter</button>
        </Dropdown>
        <Dropdown label="Map Layer" isOpen={openDropdown === 'Map Layer'} onToggle={() => toggleDropdown('Map Layer')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Select Layer</button>
        </Dropdown>
        <Dropdown label="Help" isOpen={openDropdown === 'Help'} onToggle={() => toggleDropdown('Help')}>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">Documentation</button>
          <button className="w-full text-blue-700 text-left hover:bg-gray-300 px-2 py-1">About</button>
        </Dropdown>
        </div>

        {/* Right Side: Title */}
        <h1 className="text-xl font-bold ml-auto">CES GIS Viewer</h1>
      </div>
    </nav>
  );
};

export default GISMenuBar;
