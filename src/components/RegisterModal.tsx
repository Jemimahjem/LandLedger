import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Plus, ShieldCheck, Sparkles, Hash, Layers } from 'lucide-react';
import { api } from '../utils/api';
import { useToast } from './Toast';
import { LandType } from '../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    landId: `LAND-${Math.floor(1000 + Math.random() * 9000)}`,
    surveyNumber: '112/3A',
    location: 'Sarjapur Main Road',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    area: '2,400 sq.ft',
    landType: 'Residential' as LandType,
    owner: 'Priya Sharma',
    encumbranceCert: 'EC-KA-2026-98124',
    registrationDate: new Date().toISOString().split('T')[0],
    transferNotes: 'Initial allotment deed registered and verified with revenue records.'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.landId || !formData.surveyNumber || !formData.location || !formData.area) {
        showToast('Please fill out all required land parcel fields.', 'warning');
        return;
      }
    }
    if (step === 2) {
      if (!formData.owner || !formData.registrationDate) {
        showToast('Please specify the legal titleholder and registration date.', 'warning');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.registerLand({
        landId: formData.landId,
        surveyNumber: formData.surveyNumber,
        location: formData.location,
        district: formData.district,
        state: formData.state,
        area: formData.area,
        landType: formData.landType,
        owner: formData.owner,
        registrationDate: formData.registrationDate,
        transferNotes: formData.transferNotes
      });

      showToast('Land record successfully registered on blockchain ledger!', 'success', 5000);
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('Failed to register land: ' + err.message, 'error', 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="register-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="register-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>CADASTRAL PROTOCOL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Register New Land Parcel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mint an immutable land title block verified by SHA-256 cryptographic linkage.
            </p>
          </div>

          <button
            id="close-register-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="px-6 sm:px-8 py-3.5 bg-slate-950/70 border-b border-slate-800">
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Land Info' },
              { num: 2, label: 'Ownership' },
              { num: 3, label: 'Review' },
              { num: 4, label: 'Commit' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                    step === s.num
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                      : step > s.num
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    step === s.num ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body Step Views */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Land Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Step 1: Land Parcel Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Land ID (Unique Identifier) *
                  </label>
                  <input
                    id="reg-land-id"
                    type="text"
                    name="landId"
                    value={formData.landId}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. LAND-2048"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Survey Number *
                  </label>
                  <input
                    id="reg-survey-number"
                    type="text"
                    name="surveyNumber"
                    value={formData.surveyNumber}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 118/4"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">
                    Location / Street / Village *
                  </label>
                  <input
                    id="reg-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Sarjapur Main Road, Varthur Hobli"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">District *</label>
                  <input
                    id="reg-district"
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Bengaluru Urban"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">State *</label>
                  <input
                    id="reg-state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Karnataka"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Parcel Area *</label>
                  <input
                    id="reg-area"
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. 2,400 sq.ft or 1.5 Acres"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Land Type *</label>
                  <select
                    id="reg-land-type"
                    name="landType"
                    value={formData.landType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ownership Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Step 2: Titleholder & Encumbrance Details
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Current Legal Owner Name *
                  </label>
                  <input
                    id="reg-owner"
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none text-sm font-medium"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Government ID / Encumbrance Certificate (EC) Reference
                  </label>
                  <input
                    id="reg-ec-cert"
                    type="text"
                    name="encumbranceCert"
                    value={formData.encumbranceCert}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. EC-KA-2026-98124"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Registration Date *
                  </label>
                  <input
                    id="reg-date"
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Legal Document Notes / Khata Certificate Details
                  </label>
                  <textarea
                    id="reg-notes"
                    name="transferNotes"
                    rows={3}
                    value={formData.transferNotes}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g. Initial allotment deed registered and verified with revenue records."
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review Record */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Step 3: Review Record Summary
              </h3>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {formData.landId}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                    {formData.landType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Survey Number:</span>
                    <span className="font-semibold text-white">{formData.surveyNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Parcel Area:</span>
                    <span className="font-semibold text-white">{formData.area}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Location:</span>
                    <span className="font-semibold text-white">{formData.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">District, State:</span>
                    <span className="font-semibold text-white">
                      {formData.district}, {formData.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Certified Owner:</span>
                    <span className="font-bold text-emerald-300">{formData.owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Registration Date:</span>
                    <span className="font-medium text-slate-200">{formData.registrationDate}</span>
                  </div>
                </div>

                {formData.encumbranceCert && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-500 block">Encumbrance Certificate Reference:</span>
                    <span className="font-mono text-cyan-300">{formData.encumbranceCert}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Commit to Ledger */}
          {step === 4 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Ready to commit this record to the ledger?
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Upon clicking register, LandLedger will construct a new sequential block, compute
                  the definitive SHA-256 checksum over the parcel attributes, and anchor it to the
                  previous block hash.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>ACTION:</span>
                  <span className="text-emerald-400 font-bold">APPEND_BLOCK</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>TARGET PARCEL:</span>
                  <span className="text-white">{formData.landId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>PRIMARY OWNER:</span>
                  <span className="text-slate-200">{formData.owner}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>CRYPTO HASH:</span>
                  <span className="text-cyan-300">SHA-256 AUTOMATIC MINT</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              id="reg-prev-btn"
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              id="reg-next-btn"
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="reg-commit-btn"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Mining Block...' : 'Register on Blockchain'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
