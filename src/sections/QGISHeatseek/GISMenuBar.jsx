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
        {/* Right Side: Title */}
        <h1 className="text-xl font-bold ml-auto">CES HotSpot</h1>
      </div>
    </nav>
  );
};

export default GISMenuBar;
