import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { Africa } from "../../assets/images";

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
  const navigate = useNavigate(); // Hook for navigation

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleLogout = () => {
    navigate("/LoginGIS"); // Redirect to login page
  };

  return (
    <nav className="bg-gradient-to-r from-white to-sky-500 text-sky-900 py-3 shadow-md">
      <div className="container px-6 flex items-center justify-between">
        {/* Left Side: Logo & Title */}
        <div className="flex items-center space-x-4">
          <img src={Africa} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-sky-900 to-sky-600 text-transparent bg-clip-text drop-shadow-md">
            Sales Portal
          </h1>
        </div>

       
      </div>
    </nav>
  );
};

export default GISMenuBar;
