import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeftRight, UserCheck, ShieldCheck, FileCheck } from 'lucide-react';
import { LandRecord } from '../types';
import { api } from '../utils/api';
import { useToast } from './Toast';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: LandRecord[];
  initialRecord?: LandRecord | null;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  records,
  initialRecord,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [selectedLandId, setSelectedLandId] = useState<string>('');
  const [currentRecord, setCurrentRecord] = useState<LandRecord | null>(null);
  const [newOwner, setNewOwner] = useState('');
  const [transferType, setTransferType] = useState('Sale');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRecord) {
      setSelectedLandId(initialRecord.landId);
      setCurrentRecord(initialRecord);
    } else if (records.length > 0 && !selectedLandId) {
      setSelectedLandId(records[0].landId);
      setCurrentRecord(records[0]);
    }
  }, [initialRecord, records]);

  useEffect(() => {
    const found = records.find((r) => r.landId === selectedLandId);
    if (found) {
      setCurrentRecord(found);
    }
  }, [selectedLandId, records]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandId || !newOwner.trim()) {
      showToast('Please specify a valid new owner name.', 'warning');
      return;
    }

    if (currentRecord && newOwner.trim().toLowerCase() === currentRecord.currentOwner.trim().toLowerCase()) {
      showToast('New owner must be different from current owner.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.transferOwnership({
        landId: selectedLandId,
        newOwner: newOwner.trim(),
        transferType,
        transferNotes,
        transferDate
      });

      showToast('Ownership transfer committed to blockchain ledger!', 'success', 5000);
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Failed to transfer ownership: ' + err.message, 'error', 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="transfer-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="transfer-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950/40 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ArrowLeftRight className="w-4 h-4" />
              <span>CONVEYANCE PROTOCOL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Transfer Land Ownership Title
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute a legal conveyance and anchor new block with previous block hash.
            </p>
          </div>

          <button
            id="close-transfer-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Land Parcel Picker */}
          <div className="text-xs">
            <label className="block text-slate-400 font-semibold mb-1">
              Select Land Parcel ID *
            </label>
            <select
              id="transfer-land-picker"
              value={selectedLandId}
              onChange={(e) => setSelectedLandId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
            >
              {records.map((r) => (
                <option key={r.landId} value={r.landId}>
                  {r.landId} — Survey No. {r.surveyNumber} ({r.location})
                </option>
              ))}
            </select>
          </div>

          {/* Current & New Owner Visual Comparison */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Title Transfer Comparison
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* CURRENT OWNER */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  CURRENT OWNER
                </span>
                <span className="text-sm font-bold text-white block truncate">
                  {currentRecord ? currentRecord.currentOwner : 'Loading...'}
                </span>
                <span className="text-[11px] text-slate-500">Certified Titleholder</span>
              </div>

              {/* NEW OWNER */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                  NEW OWNER
                </span>
                <span className="text-sm font-bold text-cyan-200 block truncate">
                  {newOwner.trim() || '(Enter Name Below)'}
                </span>
                <span className="text-[11px] text-cyan-400/80">Pending Blockchain Block</span>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                New Legal Titleholder Full Name *
              </label>
              <input
                id="transfer-new-owner-input"
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Conveyance / Transfer Type
                </label>
                <select
                  id="transfer-type-picker"
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Sale">Registered Sale Deed</option>
                  <option value="Gift">Gift Deed</option>
                  <option value="Inheritance">Inheritance / Succession</option>
                  <option value="Relinquishment">Relinquishment Deed</option>
                  <option value="Other">Other Legal Conveyance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Execution Date *
                </label>
                <input
                  id="transfer-date-picker"
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Legal Deed Notes / Registry Reference
              </label>
              <textarea
                id="transfer-notes-input"
                rows={2}
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                placeholder="e.g. Registered Sale Deed No. 4589/2026, Sub-Registrar Office, full consideration paid."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              id="transfer-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              id="transfer-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Recording on Chain...' : 'Confirm Transfer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
