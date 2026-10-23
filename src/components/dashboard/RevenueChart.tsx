"use client";

import React, { useState } from "react";

interface DataPoint {
  day: string;
  revenue: number;
  bondsCount: number;
}

const mockDailyData: DataPoint[] = [
  { day: "1", revenue: 8500, bondsCount: 3 },
  { day: "4", revenue: 14200, bondsCount: 5 },
  { day: "7", revenue: 11000, bondsCount: 4 },
  { day: "10", revenue: 26500, bondsCount: 8 },
  { day: "13", revenue: 18000, bondsCount: 6 },
  { day: "16", revenue: 32000, bondsCount: 11 },
  { day: "19", revenue: 24500, bondsCount: 7 },
  { day: "22", revenue: 38000, bondsCount: 12 },
  { day: "25", revenue: 29000, bondsCount: 9 },
  { day: "28", revenue: 42000, bondsCount: 14 },
];

export default function RevenueChart() {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const maxRevenue = Math.max(...mockDailyData.map((d) => d.revenue));
  const height = 160;
  const width = 500;
  const paddingX = 20;
  const paddingY = 20;

  // Generate SVG path points
  const points = mockDailyData.map((d, index) => {
    const x = paddingX + (index / (mockDailyData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.revenue / maxRevenue) * (height - 2 * paddingY);
    return { x, y, data: d };
  });

  const linePath = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full relative mt-4">
      {/* Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-0 right-4 z-10 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
          <span className="font-bold text-amber-300">اليوم {hoveredPoint.day}:</span>
          <span>{hoveredPoint.revenue.toLocaleString('en-US')} ر.س.</span>
          <span className="text-slate-400">({hoveredPoint.bondsCount} سند)</span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-40 overflow-visible"
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="#F1F5F9"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingX}
          y1={height / 2}
          x2={width - paddingX}
          y2={height / 2}
          stroke="#F1F5F9"
          strokeDasharray="4 4"
        />
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#E2E8F0"
        />

        {/* Gradient Area Fill */}
        <path d={areaPath} fill="url(#revenueGradient)" />

        {/* Smooth Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#4338CA"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r={hoveredPoint?.day === pt.data.day ? "6" : "4"}
            fill="#FFFFFF"
            stroke="#4338CA"
            strokeWidth="2.5"
            className="cursor-pointer transition-all hover:scale-125"
            onMouseEnter={() => setHoveredPoint(pt.data)}
            onMouseLeave={() => setHoveredPoint(null)}
          />
        ))}
      </svg>

      {/* X Axis Labels */}
      <div className="flex justify-between px-3 text-[11px] text-slate-400 font-medium mt-1">
        <span>1 أغسطس</span>
        <span>10 أغسطس</span>
        <span>20 أغسطس</span>
        <span>28 أغسطس</span>
      </div>
    </div>
  );
}
