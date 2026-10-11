import React, { useState } from 'react';
import { LandRecord, LandType } from '../types';
import { Search, MapPin, Layers, CheckCircle2, ShieldAlert, Check, ShieldCheck, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from './Toast';
import { api } from '../utils/api';

interface LandSearchProps {
  records: LandRecord[];
  onSelectRecord: (record: LandRecord) => void;
  onRegisterLand: () => void;
}

export const LandSearch: React.FC<LandSearchProps> = ({
  records,
  onSelectRecord,
  onRegisterLand
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<Record<string, { verified: boolean; message: string }>>({});

  // Unique districts from actual records
  const districts = ['All', ...Array.from(new Set(records.map((r) => r.district)))];

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      r.landId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.currentOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || r.landType.toLowerCase() === selectedType.toLowerCase();
    const matchesDistrict = selectedDistrict === 'All' || r.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'All' || r.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesType && matchesDistrict && matchesStatus;
  });

  const handleVerifyRecord = async (e: React.MouseEvent, record: LandRecord) => {
    e.stopPropagation();
    setVerifyingId(record.landId);
    try {
      // Run blockchain verification for this block
      const result = await api.verifyChain();
      const blockVerification = result.details.find((d) => d.block_index === record.blockIndex);

      if (blockVerification && blockVerification.valid && result.is_valid) {
        setVerificationResults((prev) => ({
          ...prev,
          [record.landId]: {
            verified: true,
            message: 'Land record is consistent with the blockchain ledger.'
          }
        }));
        showToast(`Record ${record.landId} verified against blockchain!`, 'success');
      } else {
        setVerificationResults((prev) => ({
          ...prev,
          [record.landId]: {
            verified: false,
            message: 'Record integrity could not be confirmed.'
          }
        }));
        showToast(`Verification failed for ${record.landId}: hash mismatch!`, 'error');
      }
    } catch (err: any) {
      showToast('Verification failed: ' + err.message, 'error');
    } finally {
      setVerifyingId(null);
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'agricultural':
        return 'bg-lime-500/15 text-lime-300 border-lime-500/30';
      case 'commercial':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'industrial':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Public Land Registry Search</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Find a Land Record</h2>
          <p className="text-sm text-slate-400">
            Search verified land parcels by parcel identifier, survey number, owner name, or geographical locality.
          </p>
        </div>

        <button
          id="search-register-btn"
          onClick={onRegisterLand}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          + Register New Parcel
        </button>
      </div>

      {/* Interactive Search Controls & Filters */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="registry-search-input"
            type="text"
            placeholder="Search by Land ID (e.g. LAND-1001), Survey No (45/2), Owner (Arjun Kumar), or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          {/* Land Type Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Land Type</label>
            <select
              id="filter-land-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Land Types</option>
              <option value="Residential">Residential</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">District</label>
            <select
              id="filter-district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Districts' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Record Status Filter */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Ledger Status</label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified on Blockchain</option>
              <option value="Compromised">Compromised / Tampered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
        <span>Found {filteredRecords.length} parcel records</span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('All');
              setSelectedDistrict('All');
              setSelectedStatus('All');
            }}
            className="text-emerald-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Property Cards Grid */}
      {filteredRecords.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No land records found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any land parcel matching your search criteria. Try clearing your filters or register a new parcel.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('All');
            }}
            className="mt-2 text-xs font-semibold text-emerald-400 hover:underline"
          >
            Reset Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => {
            const vResult = verificationResults[record.landId];
            const isVerifying = verifyingId === record.landId;

            return (
              <div
                key={record.landId}
                id={`property-card-${record.landId}`}
                onClick={() => onSelectRecord(record)}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-200 shadow-xl cursor-pointer flex flex-col justify-between"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-lg font-extrabold font-mono text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                        {record.landId}
                      </span>
                      <p className="text-xs font-semibold text-slate-300">
                        Survey No. {record.surveyNumber}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeClass(
                        record.landType
                      )}`}
                    >
                      {record.landType}
                    </span>
                  </div>

                  {/* Location & District */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{record.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{record.district}, {record.state}</span>
                      <span className="font-mono font-medium text-slate-300">{record.area}</span>
                    </div>
                  </div>

                  {/* Current Owner Box */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">
                      Current Owner
                    </span>
                    <span className="text-sm font-bold text-slate-100 block truncate">
                      {record.currentOwner}
                    </span>
                  </div>

                  {/* Dynamic Verification Status Feedback if checked */}
                  {vResult && (
                    <div
                      className={`p-2.5 rounded-xl text-xs mb-4 flex items-start gap-2 ${
                        vResult.verified
                          ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {vResult.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold block">
                          {vResult.verified ? '✓ RECORD VERIFIED' : '⚠ VERIFICATION FAILED'}
                        </span>
                        <span className="text-[11px]">{vResult.message}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    id={`card-verify-btn-${record.landId}`}
                    onClick={(e) => handleVerifyRecord(e, record)}
                    disabled={isVerifying}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors border border-slate-700"
                    title="Run cryptographic hash check against blockchain"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Checking...' : 'Verify Record'}</span>
                  </button>

                  <button
                    id={`card-view-btn-${record.landId}`}
                    onClick={() => onSelectRecord(record)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white group-hover:translate-x-0.5 transition-all"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
