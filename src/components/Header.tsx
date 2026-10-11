import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Layers, Search, Map, Cpu, Plus, ArrowLeftRight, RotateCcw, Menu, X, CheckCircle } from 'lucide-react';
import { LedgerStats } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: LedgerStats | null;
  onOpenRegister: () => void;
  onOpenTransfer: () => void;
  onOpenIntegrity: () => void;
  onSyncLedger: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenRegister,
  onOpenTransfer,
  onOpenIntegrity,
  onSyncLedger
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'explorer', label: 'Ledger Explorer', icon: Cpu },
    { id: 'search', label: 'Find Records', icon: Search },
    { id: 'parcels', label: 'Parcel Map', icon: Map },
    { id: 'tamper-lab', label: 'Security & Forensics', icon: ShieldAlert },
    { id: 'about', label: 'Architecture & Standards', icon: ShieldCheck }
  ];

  const isChainValid = stats?.is_valid ?? true;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              id="brand-logo-btn"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3.5 text-left group focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border border-emerald-500/40 group-hover:border-emerald-400/70 transition-all duration-300 shadow-lg shadow-emerald-950/40">
                <Layers className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                    LAND<span className="text-emerald-400">LEDGER</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    SHA-256
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Every parcel. One trusted history.</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Health indicator */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Chain Health Pill */}
            <button
              id="chain-health-header-btn"
              onClick={onOpenIntegrity}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                isChainValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25 animate-pulse'
              }`}
              title="Click to view full cryptographic chain verification"
            >
              <div className={`w-2 h-2 rounded-full ${isChainValid ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
              <span>{isChainValid ? 'Chain 100% Valid' : 'Chain Compromised'}</span>
            </button>

            {/* Quick Ledger Sync */}
            <button
              id="header-sync-ledger-btn"
              onClick={onSyncLedger}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
              title="Synchronize ledger state with primary registry nodes"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Sync Ledger</span>
            </button>

            {/* Quick Action: Register */}
            <button
              id="header-register-btn"
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Register Land</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-integrity-pill-btn"
              onClick={onOpenIntegrity}
              className={`p-2 rounded-lg border text-xs ${
                isChainValid
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse'
              }`}
            >
              {isChainValid ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              id="mobile-nav-register-btn"
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Register Land</span>
            </button>
            <button
              id="mobile-nav-transfer-btn"
              onClick={() => {
                onOpenTransfer();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-800 text-white text-xs font-semibold"
            >
              <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
              <span>Transfer Title</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              id="mobile-sync-ledger-btn"
              onClick={() => {
                onSyncLedger();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Synchronize Ledger</span>
            </button>
            <button
              id="mobile-verify-chain-btn"
              onClick={() => {
                onOpenIntegrity();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-400 font-medium"
            >
              Audit Chain Details →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
