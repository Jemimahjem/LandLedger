import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, RotateCcw, Lock, Unlock, Hash, ArrowRight, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Block, ChainValidationResult } from '../types';
import { api } from '../utils/api';
import { useToast } from './Toast';

interface TamperLabProps {
  blocks: Block[];
  onChainUpdate: () => void;
}

export const TamperLab: React.FC<TamperLabProps> = ({
  blocks,
  onChainUpdate
}) => {
  const { showToast } = useToast();
  // Filter only editable non-genesis blocks
  const editableBlocks = blocks.filter((b) => b.transactionType !== 'GENESIS');

  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(
    editableBlocks.length > 1 ? editableBlocks[1].index : editableBlocks[0]?.index ?? 1
  );
  const [fakeOwner, setFakeOwner] = useState('Fraudulent Imposter');
  const [tamperingResult, setTamperingResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ChainValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentSelectedBlock = blocks.find((b) => b.index === selectedBlockIndex);

  const handleSimulateTamper = async () => {
    if (!fakeOwner.trim()) {
      showToast('Please enter a fake owner name to simulate illegal modification.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.tamperChain(selectedBlockIndex, fakeOwner.trim());
      setTamperingResult(response.tamperResult);
      setValidationResult(response.validation);
      showToast('Tampering detected! Cryptographic integrity compromised.', 'error', 6000);
      onChainUpdate();
    } catch (err: any) {
      showToast('Failed to simulate tampering: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const response = await api.restoreChain();
      setTamperingResult(null);
      setValidationResult(response.validation);
      showToast('Chain restored successfully! Hashes valid and record integrity verified.', 'success', 6000);
      onChainUpdate();
    } catch (err: any) {
      showToast('Failed to restore chain: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Security Diagnostics & Forensics Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Chain Security & Forensics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cryptographic Forensics & Tamper Audit
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Verify the mathematical defense of the blockchain against unauthorized data alterations.
              Test simulated block modification scenarios to observe how the SHA-256 avalanche cascade instantly isolates compromised nodes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Blockchain Guarantee
            </span>
            <p className="text-slate-300">
              <span className="text-emerald-400 font-mono font-semibold">H(Block n)</span> anchors to{' '}
              <span className="text-cyan-400 font-mono font-semibold">H(Block n-1)</span>
            </p>
            <p className="text-slate-500 text-[11px]">
              Any 1-bit change completely recalculates the block hash.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Control Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tampering Form Panel */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Simulate Unauthorized Record Alteration</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Block Picker */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5">
                Target Block to Compromise *
              </label>
              <select
                id="tamper-block-select"
                value={selectedBlockIndex}
                onChange={(e) => setSelectedBlockIndex(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-rose-500 focus:outline-none"
              >
                {editableBlocks.map((b) => (
                  <option key={b.index} value={b.index}>
                    Block #{b.index} — {b.landId} ({b.owner}) • {b.transactionType}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Real Owner Info Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Legitimate Titleholder on Stored Ledger
              </span>
              <span className="text-sm font-bold text-emerald-300">
                {currentSelectedBlock ? currentSelectedBlock.owner : '—'}
              </span>
              <p className="text-[11px] text-slate-400">
                Parcel ID: {currentSelectedBlock?.landId} • Survey No: {currentSelectedBlock?.surveyNumber}
              </p>
            </div>

            {/* Fake Owner Input */}
            <div>
              <label className="block text-rose-300 font-semibold mb-1.5">
                Inject Malicious Owner Name *
              </label>
              <input
                id="tamper-fake-owner-input"
                type="text"
                value={fakeOwner}
                onChange={(e) => setFakeOwner(e.target.value)}
                placeholder="e.g. Fraudulent Imposter"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-500/50 text-rose-200 text-sm font-medium focus:border-rose-400 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Simulates an attacker tampering with the database record directly without proper consensus.
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                id="simulate-tampering-btn"
                onClick={handleSimulateTamper}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
              >
                <Unlock className="w-4 h-4" />
                <span>{isLoading ? 'Injecting Fault...' : 'Simulate Tampering'}</span>
              </button>

              <button
                id="restore-chain-btn"
                onClick={handleRestore}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore Original Record</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Cryptographic Audit & Hash Verification */}
        <div className="lg:col-span-6 space-y-4">
          {tamperingResult ? (
            /* Compromised State Display */
            <div className="p-6 sm:p-7 rounded-3xl bg-rose-950/40 border-2 border-rose-500/80 shadow-2xl backdrop-blur-xl space-y-5 animate-pulse-slow">
              {/* Alert Ribbon */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase font-extrabold text-rose-400 tracking-wider">
                    CRITICAL AUDIT EXCEPTION
                  </span>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white">
                    ⚠ INTEGRITY COMPROMISED
                  </h4>
                  <p className="text-xs text-rose-200 mt-0.5">
                    Block #{tamperingResult.tamperedBlockIndex} data has been modified. Content hash mismatch detected!
                  </p>
                </div>
              </div>

              {/* Mathematical Proof */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/60 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">
                    1. Stored Consensus Hash (Calculated from legit record):
                  </span>
                  <div className="p-2 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-400 break-all select-all">
                    {tamperingResult.storedHash}
                  </div>
                </div>

                <div>
                  <span className="text-rose-300 block mb-1 font-semibold">
                    2. Recalculated Hash (Computed over tampered "{tamperingResult.modifiedOwner}"):
                  </span>
                  <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-500/50 font-mono text-[11px] text-rose-300 break-all select-all">
                    {tamperingResult.recalculatedHash}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">CRYPTOGRAPHIC RESULT:</span>
                  <span className="text-rose-400 font-bold">STORED ≠ RECALCULATED (FAIL)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-rose-300">Why the attack failed:</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  In a real blockchain network, subsequent blocks depend on the legitimate hash of Block #{tamperingResult.tamperedBlockIndex}.
                  To forge this owner without detection, an attacker would need to rewrite and remine every subsequent block in the entire chain.
                </p>
              </div>

              <button
                id="audit-restore-btn"
                onClick={handleRestore}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Click here to Restore Original Record</span>
              </button>
            </div>
          ) : (
            /* Healthy State Display */
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                    CRYPTOGRAPHIC AUDIT STATUS
                  </span>
                  <h4 className="text-lg sm:text-xl font-extrabold text-white">
                    Chain Fully Valid (100% Integrity)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    All blocks pass SHA-256 integrity checks and previous-hash pointer validation.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Audited Blocks:</span>
                    <span className="text-white font-mono font-bold">{blocks.length} Blocks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hash Algorithm:</span>
                    <span className="text-cyan-300 font-mono">SHA-256 (256-bit digest)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Genesis Anchor:</span>
                    <span className="text-emerald-400 font-mono">Block #0 (Valid)</span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  Use the controls on the left to simulate a fraudulent modification to any block,
                  then watch how LandLedger's cryptographic validator flags the corruption automatically.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
