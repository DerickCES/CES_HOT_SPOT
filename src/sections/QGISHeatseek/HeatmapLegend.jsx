import React from "react";

const HeatmapLegend = () => {
  return (
    <div className="absolute bottom-5 right-5 bg-white shadow-md rounded-md p-3 w-56">
      <b className="block text-center mb-2">Avg Connection Strength</b>

      {/* Gradient Bar */}
      <div className="relative h-4 w-full rounded-full overflow-hidden border border-gray-400">
        <div
          className="h-full w-1/4 inline-block"
          style={{ background: "linear-gradient(to right, #8B0000, #FF0000)" }} // Dark red to light red
        ></div>
        <div
          className="h-full w-1/4 inline-block"
          style={{ background: "linear-gradient(to right, #FFA500, #FF4500)" }} // Light orange to dark orange
        ></div>
        <div
          className="h-full w-1/4 inline-block"
          style={{ background: "linear-gradient(to right, #FFFF99, #FFD700)" }} // Light yellow to dark yellow
        ></div>
        <div
          className="h-full w-1/4 inline-block"
          style={{ background: "linear-gradient(to right, #00FF00, #006400)" }} // Light green to dark green
        ></div>
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between text-xs mt-1 font-bold">
        <span className="text-red-800">0%</span>
        <span className="text-orange-700">25%</span>
        <span className="text-yellow-600">50%</span>
        <span className="text-green-600">75%</span>
        <span className="text-green-900">100%</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
