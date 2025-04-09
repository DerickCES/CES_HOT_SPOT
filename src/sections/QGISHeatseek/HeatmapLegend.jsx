import React from "react";

const HeatmapLegend = () => {
  return (
    <div className="absolute bottom-5 right-5 bg-white shadow-md rounded-md p-3 w-64 z-[1000]">
      <b className="block text-center mb-2">Avg Connection Strength</b>

      {/* Gradient Bar */}
      <div className="relative h-4 w-full rounded-full overflow-hidden border border-gray-400 flex">
        {/* Red Layer */}
        <div
          className="h-full w-1/4"
          style={{ background: "linear-gradient(to left, #ffcccc, #ff0000)" }}
        ></div>
        {/* Orange Layer */}
        <div
          className="h-full w-1/4"
          style={{ background: "linear-gradient(to right, #ffcc99, #ff8000)" }}
        ></div>
        {/* Yellow Layer */}
        <div
          className="h-full w-1/4"
          style={{ background: "linear-gradient(to right, #ffffcc, #ffcc00)" }}
        ></div>
        {/* Green Layer */}
        <div
          className="h-full w-1/4"
          style={{ background: "linear-gradient(to right, #defcb8, #3cc93c)" }}
        ></div>
      </div>


      {/* Percentage Labels */}
      <div className="flex justify-between text-xs mt-1 font-bold">
        <span className="text-red-700">0%</span>
        <span className="text-orange-300">25%</span>
        <span className="text-orange-500">50%</span>
        <span className="text-yellow-600">75%</span>
        <span className="text-green-600">100%</span>
      </div>
    </div>
  );
};

export default HeatmapLegend;
