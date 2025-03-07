import React, { useState } from 'react';

const GISLayers = () => {
  const [layers, setLayers] = useState({
    Poles: true,
    Connections: false,
  });

  const handleToggle = (layer) => {
    setLayers((prevLayers) => ({
      ...prevLayers,
      [layer]: !prevLayers[layer],
    }));
  };

  return (
    <div className="absolute right-4 top-20 bg-white shadow-lg p-4 rounded-lg w-64">
      <h3 className="text-lg font-semibold mb-2">GIS Layers</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={layers.roads}
            onChange={() => handleToggle('roads')}
          />
          <span>Roads</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={layers.buildings}
            onChange={() => handleToggle('buildings')}
          />
          <span>Buildings</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={layers.parks}
            onChange={() => handleToggle('parks')}
          />
          <span>Parks</span>
        </label>
      </div>
    </div>
  );
};

export default GISLayers;
