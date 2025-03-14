import React from "react";

const HeatmapLegend = () => {
  return (
    <div className="absolute bottom-5 right-5 bg-white shadow-md rounded-md p-3 w-56">
      <b className="block text-center mb-2">Strength Weigth</b>

      {/* Gradient Bar */}
      <div className="relative h-4 w-full rounded-full overflow-hidden border border-gray-400">
        <div
          className="h-full w-1/4 bg-red-500 inline-block"
        ></div>
        <div
          className="h-full w-1/4 bg-orange-500 inline-block"
        ></div>
        <div
          className="h-full w-1/4 bg-yellow-500 inline-block"
        ></div>
        <div
          className="h-full w-1/4 bg-green-500 inline-block"
        ></div>
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between text-xs mt-1 font-bold">
        <span className="text-red-600">0%</span>
        <span className="text-red-400">25%</span>
        <span className="text-orange-600">50%</span>
        <span className="text-yellow-400">75%</span>
        <span className="text-green-600">100%</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
