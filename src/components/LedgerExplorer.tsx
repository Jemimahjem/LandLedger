import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Block } from '../types';
import { Cpu, Search, Copy, Check, ShieldCheck, ShieldAlert, ArrowDown, Hash, Clock, User, MapPin, Layers, X, ExternalLink } from 'lucide-react';
import { useToast } from './Toast';

interface LedgerExplorerProps {
  blocks: Block[];
  onSelectLandRecord?: (landId: string) => void;
}

export const LedgerExplorer: React.FC<LedgerExplorerProps> = ({
  blocks,
  onSelectLandRecord
}) => {
  const { showToast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(blocks[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string, label = 'Hash') => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    showToast(`${label} copied to clipboard!`, 'info', 2500);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filteredBlocks = blocks.filter((b) => {
    const matchesType =
      filterType === 'All' ||
      (filterType === 'Registration' && b.transactionType === 'REGISTRATION') ||
      (filterType === 'Transfer' && b.transactionType === 'TRANSFER') ||
      (filterType === 'Genesis' && b.transactionType === 'GENESIS');

    const matchesSearch =
      searchQuery.trim() === '' ||
      b.index.toString() === searchQuery.trim() ||
      b.landId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hash.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const latestBlock = blocks[blocks.length - 1];

  return (
    <div className="space-y-8">
      {/* Explorer Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>BLOCKCHAIN EXPLORER</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Ledger Explorer</h2>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic cryptographically linked chain of land record events.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              BLOCK HEIGHT
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              #{blocks.length - 1} ({blocks.length} total blocks)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              CHAIN PROTOCOL
            </span>
            <span className="text-sm font-bold font-mono text-cyan-300">
              SHA-256 HASH CHAIN
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              LATEST BLOCK HASH
            </span>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-mono text-slate-300 truncate">
                {latestBlock ? latestBlock.hash.slice(0, 16) + '...' : '0x0'}
              </span>
              {latestBlock && (
                <button
                  onClick={() => handleCopy(latestBlock.hash, 'Latest block hash')}
                  className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                  title="Copy latest hash"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="block-search-input"
              type="text"
              placeholder="Search Block #, Land ID, or Hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Registration', 'Transfer', 'Genesis'].map((type) => (
              <button
                key={type}
                id={`block-filter-${type.toLowerCase()}`}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Connected Blockchain Visualizer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Connected Blocks Stream */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
            <span>Cryptographic Chain Graph</span>
            <span>Showing {filteredBlocks.length} Blocks</span>
          </div>

          {filteredBlocks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-sm">
              No blocks matching "{searchQuery}".
            </div>
          ) : (
            <div className="relative py-2">
              {filteredBlocks.map((block, i) => {
                const isSelected = selectedBlock?.index === block.index;
                const isGenesis = block.transactionType === 'GENESIS';
                const isTransfer = block.transactionType === 'TRANSFER';
                const isTampered = block.isTampered;

                return (
                  <React.Fragment key={block.index}>
                    <motion.div
                      id={`ledger-block-card-${block.index}`}
                      onClick={() => setSelectedBlock(block)}
                      whileHover={{ scale: 1.01 }}
                      className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 backdrop-blur-md ${
                        isTampered
                          ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50'
                          : isSelected
                          ? 'bg-slate-900 border-emerald-500/80 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {/* Left vertical status accent line */}
                      <div
                        className={`absolute inset-y-0 left-0 w-1.5 rounded-l-2xl ${
                          isTampered
                            ? 'bg-rose-500'
                            : isGenesis
                            ? 'bg-indigo-500'
                            : isTransfer
                            ? 'bg-cyan-500'
                            : 'bg-emerald-500'
                        }`}
                      />

                      <div className="flex items-start justify-between gap-4 pl-2">
                        {/* Index & Type badge */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                              isTampered
                                ? 'bg-rose-900/50 text-rose-300 border-rose-500/40'
                                : isGenesis
                                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                                : isTransfer
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            #{block.index}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">
                                {isGenesis
                                  ? 'Genesis Block'
                                  : isTransfer
                                  ? 'Ownership Transferred'
                                  : 'Land Title Registered'}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase ${
                                  isTampered
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : isGenesis
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : isTransfer
                                    ? 'bg-cyan-500/20 text-cyan-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {block.transactionType}
                              </span>
                              {isTampered && (
                                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                                  TAMPERED
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isGenesis
                                ? 'Protocol root initialization anchor'
                                : `${block.landId} • Survey No. ${block.surveyNumber} • ${block.owner}`}
                            </p>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{new Date(block.timestamp).toLocaleDateString()}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Hash Preview Footprint */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono pl-2">
                        <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate max-w-sm">
                          <span className="text-slate-400">Prev Hash:</span>
                          <span className="text-slate-500 truncate">{block.previousHash.slice(0, 18)}...</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <span className="text-slate-400">Hash:</span>
                          <span className="font-semibold text-emerald-400">{block.hash.slice(0, 16)}...</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Animated Connection Arrow between blocks */}
                    {i < filteredBlocks.length - 1 && (
                      <div className="flex items-center justify-center my-1">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 h-3 bg-gradient-to-b from-emerald-500/80 to-teal-500/80" />
                          <div className="p-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 shadow-sm">
                            <ArrowDown className="w-3 h-3 text-emerald-400" />
                          </div>
                          <div className="w-0.5 h-3 bg-gradient-to-b from-teal-500/80 to-cyan-500/80" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sticky Block Detail Inspector Panel */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="p-6 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Block Details</h3>
                  <p className="text-xs text-slate-400">SHA-256 Cryptographic Payload</p>
                </div>
              </div>

              {selectedBlock && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                  BLOCK #{selectedBlock.index}
                </span>
              )}
            </div>

            {selectedBlock ? (
              <div className="space-y-5">
                {/* Block Status Indicator */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                    selectedBlock.isTampered
                      ? 'bg-rose-950/50 border-rose-500 text-rose-300'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedBlock.isTampered ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-semibold">
                      {selectedBlock.isTampered
                        ? 'Tampering Detected: Content hash altered'
                        : 'Cryptographically Verified Block'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    {selectedBlock.isTampered ? 'INVALID' : 'VALID'}
                  </span>
                </div>

                {/* Primary Attributes */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Transaction Type
                    </span>
                    <span className="font-semibold text-slate-200">
                      {selectedBlock.transactionType}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Land Parcel ID
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {selectedBlock.landId}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Survey Number
                    </span>
                    <span className="font-medium text-slate-200">
                      {selectedBlock.surveyNumber}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      Land Type
                    </span>
                    <span className="font-medium text-slate-200">
                      {selectedBlock.landType}
                    </span>
                  </div>
                </div>

                {/* Current & Previous Owner */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Current Owner:</span>
                    <span className="font-bold text-white">{selectedBlock.owner}</span>
                  </div>
                  {selectedBlock.previousOwner && (
                    <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1.5">
                      <span>Previous Owner:</span>
                      <span className="text-slate-300">{selectedBlock.previousOwner}</span>
                    </div>
                  )}
                  {selectedBlock.transferType && (
                    <div className="flex items-center justify-between text-slate-400 border-t border-slate-800/60 pt-1.5">
                      <span>Conveyance Type:</span>
                      <span className="text-cyan-400">{selectedBlock.transferType}</span>
                    </div>
                  )}
                  {selectedBlock.transferNotes && (
                    <div className="text-slate-400 border-t border-slate-800/60 pt-1.5 text-[11px] italic">
                      Notes: {selectedBlock.transferNotes}
                    </div>
                  )}
                </div>

                {/* Previous Hash Display with Copy */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Previous Block Hash</span>
                    <button
                      id="copy-prev-hash-btn"
                      onClick={() => handleCopy(selectedBlock.previousHash, 'Previous hash')}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      {copiedHash === selectedBlock.previousHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedHash === selectedBlock.previousHash ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 break-all leading-relaxed select-all">
                    {selectedBlock.previousHash}
                  </div>
                </div>

                {/* Current Block Hash Display with Copy */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">Current Block SHA-256 Hash</span>
                    <button
                      id="copy-current-hash-btn"
                      onClick={() => handleCopy(selectedBlock.hash, 'Block hash')}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors font-medium"
                    >
                      {copiedHash === selectedBlock.hash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedHash === selectedBlock.hash ? 'Copied!' : 'Copy Hash'}</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 break-all leading-relaxed select-all shadow-inner">
                    {selectedBlock.hash}
                  </div>
                </div>

                {/* Action button: inspect land record if available */}
                {selectedBlock.transactionType !== 'GENESIS' && onSelectLandRecord && (
                  <button
                    id="ledger-view-parcel-record-btn"
                    onClick={() => onSelectLandRecord(selectedBlock.landId)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-colors border border-slate-700"
                  >
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    <span>View Property Title History ({selectedBlock.landId})</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-sm">
                Select any block on the left to inspect its cryptographic payload.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
