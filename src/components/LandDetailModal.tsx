import React, { useEffect, useState } from 'react';
import { LandRecord, OwnershipEvent } from '../types';
import { api } from '../utils/api';
import { X, CheckCircle2, ShieldAlert, ArrowLeftRight, Cpu, Clock, Calendar, MapPin, Hash, User, FileText, Check } from 'lucide-react';
import { useToast } from './Toast';

interface LandDetailModalProps {
  record: LandRecord | null;
  onClose: () => void;
  onInitiateTransfer: (record: LandRecord) => void;
  onViewInExplorer: (blockIndex: number) => void;
}

export const LandDetailModal: React.FC<LandDetailModalProps> = ({
  record,
  onClose,
  onInitiateTransfer,
  onViewInExplorer
}) => {
  const { showToast } = useToast();
  const [transfers, setTransfers] = useState<OwnershipEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!record) return;
    setLoading(true);
    setVerified(null);
    api.getTransfers(record.landId)
      .then((data) => {
        setTransfers(data);
      })
      .catch((err) => {
        console.error('Failed to load transfers:', err);
      })
      .finally(() => setLoading(false));
  }, [record]);

  if (!record) return null;

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await api.verifyChain();
      const match = result.details.find((d) => d.block_index === record.blockIndex);
      if (match && match.valid && result.is_valid) {
        setVerified(true);
        showToast(`✓ Land Record ${record.landId} is verified and consistent with the blockchain.`, 'success');
      } else {
        setVerified(false);
        showToast(`⚠ Integrity check failed for ${record.landId}. Cryptographic mismatch detected!`, 'error');
      }
    } catch (err: any) {
      showToast('Verification failed: ' + err.message, 'error');
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      id="land-detail-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="land-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {record.landId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {record.landType}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  record.status === 'Verified'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}
              >
                {record.status}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Land Parcel Deed Record
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Survey No. {record.surveyNumber} • {record.location}, {record.district}
            </p>
          </div>

          <button
            id="close-land-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Core Parcel Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Land ID</span>
              <span className="font-mono font-bold text-sm text-emerald-400">{record.landId}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Survey Number</span>
              <span className="font-bold text-sm text-white">{record.surveyNumber}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Parcel Area</span>
              <span className="font-mono font-bold text-sm text-cyan-300">{record.area}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Reg Date</span>
              <span className="font-medium text-slate-300">{record.registrationDate}</span>
            </div>
          </div>

          {/* Current Ownership Callout */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Certified Owner
                </span>
                <span className="text-lg font-extrabold text-white">{record.currentOwner}</span>
                <p className="text-xs text-slate-400">
                  Initial Registered Titleholder: {record.initialOwner}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="modal-verify-record-btn"
                onClick={handleVerify}
                disabled={verifying}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{verifying ? 'Verifying...' : 'Verify Record'}</span>
              </button>

              <button
                id="modal-transfer-btn"
                onClick={() => {
                  onClose();
                  onInitiateTransfer(record);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
                <span>Transfer Ownership</span>
              </button>
            </div>
          </div>

          {/* Verification Status Banner if checked */}
          {verified !== null && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
                verified
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {verified ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold block text-sm">
                    {verified ? '✓ RECORD VERIFIED' : '⚠ VERIFICATION FAILED'}
                  </span>
                  <span>
                    {verified
                      ? 'Land record is consistent with the blockchain ledger.'
                      : 'Record integrity could not be confirmed.'}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-950">
                {verified ? 'SHA-256 MATCH' : 'HASH MISMATCH'}
              </span>
            </div>
          )}

          {/* OWNERSHIP JOURNEY TIMELINE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>OWNERSHIP JOURNEY</span>
              </h3>
              <span className="text-xs text-slate-400">
                {transfers.length} Ledger Event{transfers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading ownership journey...</div>
            ) : transfers.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 text-xs text-slate-400">
                Initial registration recorded at Block #{record.blockIndex}.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {transfers.map((tx, idx) => {
                  const isLatest = idx === transfers.length - 1;
                  return (
                    <div key={tx.id || idx} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                          isLatest ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-slate-600'
                        }`}
                      />

                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {tx.transactionType === 'REGISTRATION'
                                ? 'Initial Registration'
                                : `Ownership Transfer (${tx.transferType || 'Sale'})`}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              Block #{tx.blockIndex}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {tx.date || tx.year}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 text-slate-300">
                          {tx.previousOwner && tx.previousOwner !== 'None' && (
                            <p className="text-slate-400">
                              From:{' '}
                              <span className="text-slate-200 font-medium">{tx.previousOwner}</span>
                            </p>
                          )}
                          <p className="text-slate-400">
                            To:{' '}
                            <span className="text-emerald-300 font-bold">{tx.newOwner}</span>
                          </p>
                          {tx.transferNotes && (
                            <p className="text-[11px] text-slate-500 italic pt-1">
                              "{tx.transferNotes}"
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="truncate max-w-[220px]">
                            Hash: {tx.blockHash ? tx.blockHash.slice(0, 16) + '...' : '0x...'}
                          </span>
                          <button
                            onClick={() => {
                              onClose();
                              onViewInExplorer(tx.blockIndex);
                            }}
                            className="text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>Inspect Block</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
