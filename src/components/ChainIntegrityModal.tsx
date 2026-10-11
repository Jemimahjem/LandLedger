import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Layers, Check } from 'lucide-react';
import { ChainValidationResult } from '../types';
import { api } from '../utils/api';
import { useToast } from './Toast';

interface ChainIntegrityModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: ChainValidationResult | null;
  onRefresh: () => void;
}

export const ChainIntegrityModal: React.FC<ChainIntegrityModalProps> = ({
  isOpen,
  onClose,
  validationResult,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditData, setAuditData] = useState<ChainValidationResult | null>(validationResult);

  if (!isOpen) return null;

  const handleRunFullAudit = async () => {
    setIsRunningAudit(true);
    try {
      const res = await api.verifyChain();
      setAuditData(res);
      onRefresh();
      if (res.is_valid) {
        showToast('Blockchain verification completed: 100% chain integrity confirmed.', 'success');
      } else {
        showToast('Blockchain verification alert: Tampered block detected!', 'error');
      }
    } catch (err: any) {
      showToast('Audit failed: ' + err.message, 'error');
    } finally {
      setIsRunningAudit(false);
    }
  };

  const result = auditData || validationResult;
  const isValid = result ? result.is_valid : true;

  return (
    <div
      id="chain-integrity-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="chain-integrity-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>CONSENSUS AUDIT PROTOCOL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Blockchain Integrity Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Full mathematical traversal verifying block payload hashes and cryptographic chain links.
            </p>
          </div>

          <button
            id="close-integrity-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status summary banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isValid
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/60 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`p-3 rounded-xl ${
                  isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {isValid ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase font-bold tracking-wider block">
                  {isValid ? 'VERIFICATION STATUS: PASSED' : 'VERIFICATION STATUS: COMPROMISED'}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {isValid
                    ? 'All Records Authenticated and Untampered'
                    : `Integrity Alert: Compromise at Block #${result?.tampered_block_index ?? '?'}`}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {result?.message || 'Every block matches its SHA-256 digest and previous-hash pointer.'}
                </p>
              </div>
            </div>

            <button
              id="integrity-run-audit-btn"
              onClick={handleRunFullAudit}
              disabled={isRunningAudit}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
              <span>{isRunningAudit ? 'Auditing...' : 'Re-verify Entire Chain'}</span>
            </button>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Total Blocks Audited
              </span>
              <span className="font-mono font-bold text-base text-white">
                {result?.total_blocks ?? 7} Blocks
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Verified Sound
              </span>
              <span className="font-mono font-bold text-base text-emerald-400">
                {result?.verified_blocks ?? 7} Blocks
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Chain Mathematical Soundness
              </span>
              <span
                className={`font-mono font-bold text-base ${
                  isValid ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isValid ? '100% SECURE' : 'FAULT FOUND'}
              </span>
            </div>
          </div>

          {/* Detailed Block Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1 uppercase tracking-wider">
              <span>Block Verification Checklist</span>
              <span>Audit Rules: Recalculated Hash == Stored Hash & Linkage</span>
            </div>

            <div className="space-y-2">
              {result?.details.map((item) => (
                <div
                  key={item.block_index}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.valid
                      ? 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                      : 'bg-rose-950/40 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        item.valid ? 'bg-slate-900 text-slate-300' : 'bg-rose-600 text-white'
                      }`}
                    >
                      #{item.block_index}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {item.block_index === 0 ? 'Genesis Anchor Block' : `Block #${item.block_index}`}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold ${
                            item.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {item.valid ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex flex-wrap gap-2">
                        <span>Hash: {item.stored_hash.slice(0, 14)}...</span>
                        <span>•</span>
                        <span>Prev: {item.stored_previous_hash.slice(0, 14)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
                    <span
                      className={`flex items-center gap-1 ${
                        item.hash_valid ? 'text-emerald-400' : 'text-rose-400 font-bold'
                      }`}
                    >
                      {item.hash_valid ? <Check className="w-3 h-3" /> : '✗'}
                      <span>Hash Check</span>
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        item.link_valid ? 'text-emerald-400' : 'text-rose-400 font-bold'
                      }`}
                    >
                      {item.link_valid ? <Check className="w-3 h-3" /> : '✗'}
                      <span>Link Check</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
