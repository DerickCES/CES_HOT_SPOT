import React, { useState } from "react";
import { motion } from "framer-motion";

const fiberData = [
  { color: "#0000FF", name: "Blue" },
  { color: "#FF8000", name: "Orange" },
  { color: "#00FF00", name: "Green" },
  { color: "#8B4513", name: "Brown" },
  { color: "#C0C0C0", name: "Slate" },
  { color: "#FFFFFF", name: "White" },
  { color: "#FF0000", name: "Red" },
  { color: "#000000", name: "Black" },
  { color: "#FFFF00", name: "Yellow" },
  { color: "#4B0082", name: "Purple" },
  { color: "#FF007F", name: "Rose" },
  { color: "#00CED1", name: "Aqua" },
];

const FiberSplicingGUI = () => {
  const [connections, setConnections] = useState(Array(12).fill(null));

  const handleSelect = (index, value) => {
    const newConnections = [...connections];
    newConnections[index] = value;
    setConnections(newConnections);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Fiber Splicing Interface</h1>
      <div className="flex justify-center items-center bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Left Fibers */}
        <div className="space-y-2">
          {fiberData.map((fiber, index) => (
            <div key={`left-${index}`} className="flex items-center space-x-2">
              <span className="text-white font-bold">{index + 1}</span>
              <span className="text-white">{fiber.name}</span>
              <select
                className="bg-gray-700 text-white p-1 rounded"
                value={connections[index] || ""}
                onChange={(e) => handleSelect(index, e.target.value)}
              >
                <option value="">Select</option>
                {fiberData.map((option, i) => (
                  <option key={i} value={option.name}>{option.name}</option>
                ))}
              </select>
              <motion.div
                className="w-16 h-6 rounded-md cursor-pointer shadow-lg"
                style={{ backgroundColor: fiber.color }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              />
           

            </div>
          ))}
        </div>

        {/* Splice Area */}
        <div className="w-64 h-96 bg-gray-600 border-4 border-gray-500 rounded-lg flex flex-col justify-center items-center mx-10 shadow-lg">
          <span className="text-gray-300">Splice Here</span>
        </div>

        {/* Right Fibers */}
        <div className="space-y-2">
          {fiberData.map((fiber, index) => (
            <div key={`right-${index}`} className="flex items-center space-x-2">
              <motion.div
                className="w-16 h-6 rounded-md cursor-pointer shadow-lg"
                style={{ backgroundColor: fiber.color }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              />
              <span className="text-white">{fiber.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiberSplicingGUI;
