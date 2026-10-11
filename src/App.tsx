/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { ParcelView } from './components/ParcelView';
import { LedgerExplorer } from './components/LedgerExplorer';
import { LandSearch } from './components/LandSearch';
import { LandDetailModal } from './components/LandDetailModal';
import { RegisterModal } from './components/RegisterModal';
import { TransferModal } from './components/TransferModal';
import { TamperLab } from './components/TamperLab';
import { ChainIntegrityModal } from './components/ChainIntegrityModal';
import { AboutSection } from './components/AboutSection';
import { ActivityFeed } from './components/ActivityFeed';
import { ToastProvider, useToast } from './components/Toast';
import { LandRecord, Block, LedgerStats, ActivityFeedItem, ChainValidationResult } from './types';
import { api } from './utils/api';
import { ShieldCheck, ShieldAlert, Layers, Search, Map, Cpu, ArrowRight, RotateCcw } from 'lucide-react';

function MainApp() {
  const { showToast } = useToast();

  // Navigation & Data States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [stats, setStats] = useState<LedgerStats | null>(null);
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [validationResult, setValidationResult] = useState<ChainValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isTransferOpen, setIsTransferOpen] = useState<boolean>(false);
  const [isIntegrityOpen, setIsIntegrityOpen] = useState<boolean>(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<LandRecord | null>(null);
  const [selectedRecordForTransfer, setSelectedRecordForTransfer] = useState<LandRecord | null>(null);

  // Load all app data from backend APIs
  const refreshData = useCallback(async () => {
    try {
      const [statsData, recordsData, chainData, actsData, valData] = await Promise.all([
        api.getStats(),
        api.getLandRecords(),
        api.getBlockchain(),
        api.getActivities(),
        api.verifyChain()
      ]);

      setStats(statsData);
      setRecords(recordsData);
      setBlocks(chainData.chain);
      setActivities(actsData);
      setValidationResult(valData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Ledger State Synchronization
  const handleSyncLedger = async () => {
    try {
      await api.syncLedgerState();
      await refreshData();
      showToast('Official registry records & genesis blockchain state synchronized successfully.', 'info');
    } catch (err: any) {
      showToast('Failed to synchronize ledger: ' + err.message, 'error');
    }
  };

  // Quick Action handlers
  const handleOpenRegister = () => setIsRegisterOpen(true);
  const handleOpenTransfer = (record?: LandRecord) => {
    setSelectedRecordForTransfer(record || null);
    setIsTransferOpen(true);
  };
  const handleOpenIntegrity = () => setIsIntegrityOpen(true);

  const handleSelectRecordById = (landId: string) => {
    const found = records.find((r) => r.landId === landId);
    if (found) {
      setSelectedRecordForDetail(found);
    } else {
      setActiveTab('search');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenRegister={handleOpenRegister}
        onOpenTransfer={() => handleOpenTransfer()}
        onOpenIntegrity={handleOpenIntegrity}
        onSyncLedger={handleSyncLedger}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Futuristic Hero */}
            <Hero
              stats={stats}
              onRegisterLand={handleOpenRegister}
              onExploreLedger={() => setActiveTab('explorer')}
              onTamperLab={() => setActiveTab('tamper-lab')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
              {/* Live Statistics & Quick Action Buttons */}
              <StatsBar
                stats={stats}
                onRegisterLand={handleOpenRegister}
                onTransferOwnership={() => handleOpenTransfer()}
                onSearchRecords={() => setActiveTab('search')}
                onExploreBlockchain={() => setActiveTab('explorer')}
                onVerifyRecords={handleOpenIntegrity}
              />

              {/* Spatial Cadastre Map Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Map className="w-4 h-4" />
                    <span>Spatial Cadastre Plots</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('parcels')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Full Screen GIS Cadastre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ParcelView
                  records={records}
                  onSelectRecord={(rec) => setSelectedRecordForDetail(rec)}
                  onRegisterLand={handleOpenRegister}
                />
              </div>

              {/* Grid: Search & Live Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                      Recent Land Parcels
                    </h3>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      View All Registry Parcels →
                    </button>
                  </div>
                  <LandSearch
                    records={records.slice(0, 4)}
                    onSelectRecord={(rec) => setSelectedRecordForDetail(rec)}
                    onRegisterLand={handleOpenRegister}
                  />
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <ActivityFeed
                    activities={activities}
                    onSelectRecord={handleSelectRecordById}
                  />

                  {/* Security Forensics Teaser Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Security & Forensics</span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      Verify Blockchain Resilience
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Simulate an illegal database modification and watch the SHA-256 cascade detect the forgery in real time.
                    </p>
                    <button
                      id="dashboard-open-tamper-lab-btn"
                      onClick={() => setActiveTab('tamper-lab')}
                      className="px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                    >
                      <span>Security Forensics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPLORER TAB */}
        {activeTab === 'explorer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <LedgerExplorer
              blocks={blocks}
              onSelectLandRecord={handleSelectRecordById}
            />
          </div>
        )}

        {/* SEARCH & REGISTRY TAB */}
        {activeTab === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <LandSearch
              records={records}
              onSelectRecord={(rec) => setSelectedRecordForDetail(rec)}
              onRegisterLand={handleOpenRegister}
            />
          </div>
        )}

        {/* PARCEL MAP TAB */}
        {activeTab === 'parcels' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ParcelView
              records={records}
              onSelectRecord={(rec) => setSelectedRecordForDetail(rec)}
              onRegisterLand={handleOpenRegister}
            />
          </div>
        )}

        {/* TAMPER LAB TAB */}
        {activeTab === 'tamper-lab' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <TamperLab
              blocks={blocks}
              onChainUpdate={refreshData}
            />
          </div>
        )}

        {/* ABOUT & ARCHITECTURE TAB */}
        {activeTab === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AboutSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">LANDLEDGER</span>
            <span>—</span>
            <span>Every parcel. One trusted history.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-emerald-400 transition-colors"
            >
              Protocol Architecture
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('tamper-lab')}
              className="hover:text-emerald-400 transition-colors"
            >
              Security & Forensics
            </button>
            <span>•</span>
            <button
              onClick={handleSyncLedger}
              className="hover:text-white transition-colors"
            >
              Sync State
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={refreshData}
      />

      <TransferModal
        isOpen={isTransferOpen}
        records={records}
        initialRecord={selectedRecordForTransfer}
        onClose={() => {
          setIsTransferOpen(false);
          setSelectedRecordForTransfer(null);
        }}
        onSuccess={refreshData}
      />

      <LandDetailModal
        record={selectedRecordForDetail}
        onClose={() => setSelectedRecordForDetail(null)}
        onInitiateTransfer={(rec) => {
          setSelectedRecordForDetail(null);
          handleOpenTransfer(rec);
        }}
        onViewInExplorer={(idx) => {
          setActiveTab('explorer');
        }}
      />

      <ChainIntegrityModal
        isOpen={isIntegrityOpen}
        onClose={() => setIsIntegrityOpen(false)}
        validationResult={validationResult}
        onRefresh={refreshData}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
