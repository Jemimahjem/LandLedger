import React, { useEffect, useState } from 'react';
import { Layers, MapPin, ArrowLeftRight, CheckCircle2, Cpu, ShieldCheck, ShieldAlert, Plus, Search } from 'lucide-react';
import { LedgerStats } from '../types';

interface StatsBarProps {
  stats: LedgerStats | null;
  onRegisterLand: () => void;
  onTransferOwnership: () => void;
  onSearchRecords: () => void;
  onExploreBlockchain: () => void;
  onVerifyRecords: () => void;
}

// Animated Counter component
const AnimatedNumber: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let start = displayVal;
    const end = value;
    if (start === end) return;

    const duration = 800;
    const steps = 24;
    const increment = (end - start) / steps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setDisplayVal(end);
        clearInterval(timer);
      } else {
        setDisplayVal(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayVal.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  onRegisterLand,
  onTransferOwnership,
  onSearchRecords,
  onExploreBlockchain,
  onVerifyRecords
}) => {
  const totalRecords = stats?.total_land_records ?? 5;
  const activeParcels = stats?.active_parcels ?? 5;
  const transfers = stats?.ownership_transfers ?? 1;
  const verifiedRecords = stats?.verified_records ?? 5;
  const blocks = stats?.blockchain_blocks ?? 7;
  const integrity = stats?.chain_integrity ?? 100;
  const isValid = stats?.is_valid ?? true;

  const statItems = [
    {
      id: 'stat-records',
      label: 'LAND RECORDS',
      value: totalRecords,
      icon: Layers,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      id: 'stat-parcels',
      label: 'ACTIVE PARCELS',
      value: activeParcels,
      icon: MapPin,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20'
    },
    {
      id: 'stat-transfers',
      label: 'TRANSFERS',
      value: transfers,
      icon: ArrowLeftRight,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      id: 'stat-blocks',
      label: 'LEDGER BLOCKS',
      value: blocks,
      icon: Cpu,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    },
    {
      id: 'stat-integrity',
      label: 'CHAIN INTEGRITY',
      value: integrity,
      suffix: '%',
      icon: isValid ? ShieldCheck : ShieldAlert,
      color: isValid ? 'text-emerald-400' : 'text-rose-400',
      bgColor: isValid ? 'bg-emerald-500/10' : 'bg-rose-500/15',
      borderColor: isValid ? 'border-emerald-500/20' : 'border-rose-500/40'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 5 Prominent Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={item.id}
              className={`p-4 sm:p-5 rounded-2xl bg-slate-900/80 border ${item.borderColor} backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5 duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.bgColor} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${item.color}`}>
                <AnimatedNumber value={item.value} suffix={item.suffix} />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                {item.id === 'stat-integrity'
                  ? isValid
                    ? 'All blocks mathematically valid'
                    : 'Cryptographic fault detected!'
                  : 'Live state from active ledger'}
              </p>
            </div>
          );
        })}
      </div>

      {/* DASHBOARD QUICK ACTIONS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Dashboard Quick Actions
            </h3>
            <p className="text-sm font-semibold text-slate-200">
              Direct cryptographic registry and ledger tools
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* + Register Land */}
            <button
              id="quick-action-register"
              onClick={onRegisterLand}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register Land</span>
            </button>

            {/* ↻ Transfer Ownership */}
            <button
              id="quick-action-transfer"
              onClick={onTransferOwnership}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              <span>Transfer Ownership</span>
            </button>

            {/* ⌕ Search Records */}
            <button
              id="quick-action-search"
              onClick={onSearchRecords}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <Search className="w-4 h-4 text-teal-400" />
              <span>Search Records</span>
            </button>

            {/* ⛓ Explore Blockchain */}
            <button
              id="quick-action-explore"
              onClick={onExploreBlockchain}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 hover:text-white border border-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Explore Blockchain</span>
            </button>

            {/* ✓ Verify Records */}
            <button
              id="quick-action-verify"
              onClick={onVerifyRecords}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verify Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
