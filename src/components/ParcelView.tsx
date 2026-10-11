import React, { useState } from 'react';
import { LandRecord } from '../types';
import { Map, Layers, CheckCircle2, ShieldAlert, Sparkles, ExternalLink, Compass } from 'lucide-react';

interface ParcelViewProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
  onRegisterLand: () => void;
}

export const ParcelView: React.FC<ParcelViewProps> = ({
  records,
  onSelectRecord,
  onRegisterLand
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [hoveredParcel, setHoveredParcel] = useState<LandRecord | null>(null);

  const filteredRecords = selectedType === 'All'
    ? records
    : records.filter(r => r.landType.toLowerCase() === selectedType.toLowerCase());

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential':
        return {
          fill: 'fill-emerald-500/20 hover:fill-emerald-500/35',
          stroke: 'stroke-emerald-400',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/40'
        };
      case 'agricultural':
        return {
          fill: 'fill-lime-500/20 hover:fill-lime-500/35',
          stroke: 'stroke-lime-400',
          badge: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
          text: 'text-lime-400',
          bg: 'bg-lime-950/40'
        };
      case 'commercial':
        return {
          fill: 'fill-cyan-500/20 hover:fill-cyan-500/35',
          stroke: 'stroke-cyan-400',
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          text: 'text-cyan-400',
          bg: 'bg-cyan-950/40'
        };
      case 'industrial':
        return {
          fill: 'fill-purple-500/20 hover:fill-purple-500/35',
          stroke: 'stroke-purple-400',
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          text: 'text-purple-400',
          bg: 'bg-purple-950/40'
        };
      default:
        return {
          fill: 'fill-slate-500/20 hover:fill-slate-500/35',
          stroke: 'stroke-slate-400',
          badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          text: 'text-slate-400',
          bg: 'bg-slate-900/40'
        };
    }
  };

  // Cadastral coordinate layout mapping
  const parcelCoordinates: Record<string, { x: number; y: number; w: number; h: number }> = {
    'LAND-1001': { x: 30, y: 30, w: 260, h: 170 },
    'LAND-1002': { x: 320, y: 30, w: 350, h: 170 },
    'LAND-1003': { x: 30, y: 230, w: 310, h: 170 },
    'LAND-1004': { x: 370, y: 230, w: 300, h: 170 },
    'LAND-1005': { x: 30, y: 430, w: 640, h: 150 }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Map className="w-4 h-4" />
            <span>Interactive Cadastre Map</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Spatial Parcel Cadastre
          </h2>
          <p className="text-sm text-slate-400">
            Select any registered parcel plot to inspect its immutable title chain, survey dimensions, and current owner.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {['All', 'Residential', 'Agricultural', 'Commercial', 'Industrial'].map((type) => (
            <button
              key={type}
              id={`parcel-filter-${type.toLowerCase()}`}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cadastral Map Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          {/* GIS Header info bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>CADASTRAL_ZONE: KARNATAKA_URBAN_REGISTRY_04</span>
            </div>
            <span className="hidden sm:inline-block text-slate-500">
              SCALE: 1:1000 • GEODETIC SHA-256 ANCHORED
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[700/620] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
            {/* Background grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <defs>
                <pattern id="cadastre-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cadastre-grid)" />
            </svg>

            {/* SVG Plot Shapes */}
            <svg
              viewBox="0 0 700 620"
              className="w-full h-full cursor-pointer select-none"
            >
              {records.map((record, index) => {
                const coords = parcelCoordinates[record.landId] || {
                  x: 30 + ((index * 130) % 500),
                  y: 450,
                  w: 180,
                  h: 120
                };
                const colors = getTypeColor(record.landType);
                const isHovered = hoveredParcel?.landId === record.landId;
                const isSelected = filteredRecords.some(r => r.landId === record.landId);

                return (
                  <g
                    key={record.landId}
                    id={`cadastre-plot-${record.landId}`}
                    onClick={() => onSelectRecord(record)}
                    onMouseEnter={() => setHoveredParcel(record)}
                    onMouseLeave={() => setHoveredParcel(null)}
                    className="transition-all duration-300"
                    opacity={isSelected ? 1 : 0.25}
                  >
                    {/* Plot boundary rectangle */}
                    <rect
                      x={coords.x}
                      y={coords.y}
                      width={coords.w}
                      height={coords.h}
                      rx="10"
                      className={`${colors.fill} transition-all duration-200 stroke-2 ${
                        isHovered ? 'stroke-white stroke-[3]' : colors.stroke
                      }`}
                    />

                    {/* Corner Survey markers */}
                    <circle cx={coords.x + 8} cy={coords.y + 8} r="3" fill="#10b981" />
                    <circle cx={coords.x + coords.w - 8} cy={coords.y + 8} r="3" fill="#10b981" />
                    <circle cx={coords.x + 8} cy={coords.y + coords.h - 8} r="3" fill="#10b981" />
                    <circle cx={coords.x + coords.w - 8} cy={coords.y + coords.h - 8} r="3" fill="#10b981" />

                    {/* Text labels inside parcel */}
                    <text
                      x={coords.x + 18}
                      y={coords.y + 32}
                      className="fill-white font-mono font-bold text-sm tracking-wide"
                    >
                      {record.landId}
                    </text>

                    <text
                      x={coords.x + 18}
                      y={coords.y + 54}
                      className="fill-slate-300 text-xs font-semibold"
                    >
                      Survey No: {record.surveyNumber}
                    </text>

                    <text
                      x={coords.x + 18}
                      y={coords.y + 74}
                      className="fill-slate-400 text-[11px]"
                    >
                      {record.area} • {record.district}
                    </text>

                    <text
                      x={coords.x + 18}
                      y={coords.y + coords.h - 20}
                      className="fill-slate-300 text-xs font-medium"
                    >
                      Owner: <tspan className="fill-emerald-300 font-semibold">{record.currentOwner}</tspan>
                    </text>

                    {/* Status badge in top right of plot */}
                    <rect
                      x={coords.x + coords.w - 82}
                      y={coords.y + 16}
                      width="68"
                      height="20"
                      rx="6"
                      fill="#0f172a"
                      stroke={record.status === 'Verified' ? '#10b981' : '#f43f5e'}
                      strokeWidth="1"
                    />
                    <text
                      x={coords.x + coords.w - 48}
                      y={coords.y + 30}
                      textAnchor="middle"
                      className="fill-slate-200 text-[10px] font-mono font-bold uppercase"
                    >
                      {record.status}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400" />
                <span className="text-slate-300">Residential</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-lime-500/30 border border-lime-400" />
                <span className="text-slate-300">Agricultural</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400" />
                <span className="text-slate-300">Commercial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-400" />
                <span className="text-slate-300">Industrial</span>
              </div>
            </div>

            <span className="text-slate-500 font-mono text-[11px]">
              Click any parcel to inspect title deed
            </span>
          </div>
        </div>

        {/* Selected / Hovered Parcel Detail Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Parcel Inspector</span>
              {hoveredParcel && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE SELECTION
                </span>
              )}
            </h3>

            {hoveredParcel ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-extrabold font-mono text-white">
                      {hoveredParcel.landId}
                    </h4>
                    <p className="text-xs text-slate-400">Survey No. {hoveredParcel.surveyNumber}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeColor(hoveredParcel.landType).badge}`}>
                    {hoveredParcel.landType}
                  </span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Location</span>
                    <span className="text-slate-200 font-medium text-right">{hoveredParcel.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">District & State</span>
                    <span className="text-slate-200 font-medium">{hoveredParcel.district}, {hoveredParcel.state}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Parcel Area</span>
                    <span className="text-emerald-400 font-mono font-semibold">{hoveredParcel.area}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Current Owner</span>
                    <span className="text-white font-bold">{hoveredParcel.currentOwner}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Block Reference</span>
                    <span className="text-cyan-400 font-mono">Block #{hoveredParcel.blockIndex}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Ledger Status</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {hoveredParcel.status}
                    </span>
                  </div>
                </div>

                <button
                  id="inspect-view-record-btn"
                  onClick={() => onSelectRecord(hoveredParcel)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Complete Land Title Record</span>
                </button>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800/60 mx-auto flex items-center justify-center text-slate-400">
                  <Map className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-300">No Parcel Hovered</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Move your cursor over any plot on the cadastre grid to inspect real-time ownership and title attributes.
                </p>
                {records.length > 0 && (
                  <button
                    id="inspect-default-first-btn"
                    onClick={() => onSelectRecord(records[0])}
                    className="text-xs text-emerald-400 hover:underline pt-2 font-medium"
                  >
                    Or view {records[0].landId} →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Register Prompt Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/60 to-emerald-950/30 border border-emerald-500/20 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">New Parcel Boundary?</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Register newly surveyed land plots directly into the blockchain ledger with automated SHA-256 block mining.
                </p>
                <button
                  id="parcel-card-register-btn"
                  onClick={onRegisterLand}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  + Add Parcel Record
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
