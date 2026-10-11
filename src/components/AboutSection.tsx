import React from 'react';
import { ShieldCheck, Layers, Hash, Lock, Database, FileCheck, ArrowRight, AlertCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/30 border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>GovTech Architecture Overview</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How LandLedger Establishes Immutable Property Trust
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            In conventional land governance, land records are vulnerable to duplicate registrations,
            unauthorized database tampering, and conflicting survey titles. LandLedger introduces a
            deterministic blockchain architecture providing cryptographic permanence for every parcel.
          </p>
        </div>
      </div>

      {/* 4 Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Why Land Records Need Blockchain */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            1. Mitigating Title Fraud & Double Selling
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Paper-based registries and centralized mutable databases are susceptible to backdated deeds,
            clandestine Khata transfers, and duplicate mortgaging. On LandLedger, every parcel conveyance
            is committed sequentially, rendering retroactive alterations mathematically impossible without
            breaking all descendant blocks.
          </p>
        </div>

        {/* Pillar 2: SHA-256 Hashing and the Avalanche Effect */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Hash className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            2. SHA-256 Hashing & Avalanche Effect
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every block calculates a 256-bit hash over its payload (Survey Number, Owner, Area, Type,
            Conveyance Notes, and Timestamp). The cryptographic avalanche effect dictates that altering
            even a single character in the owner's name creates a wildly different hash digest, exposing
            tampering instantaneously.
          </p>
        </div>

        {/* Pillar 3: Previous-Hash Pointer Chains */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            3. Previous-Hash Pointer Linkage
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Each new block stores <code className="text-emerald-400 font-mono">previousHash</code>, anchoring
            itself directly to its predecessor. Because the previous hash is part of the input to the current
            hash, an attacker cannot modify an older block without recomputing the cryptographic proof for
            every subsequent block in the chain.
          </p>
        </div>

        {/* Pillar 4: The Genesis Anchor */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            4. Genesis Anchor (Block #0)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The foundation of LandLedger is Block #0, initialized with a previous hash of "0". It serves as the
            cryptographic root of trust. All land parcel registrations and ownership conveyances branch
            deterministically from this genesis origin point.
          </p>
        </div>
      </div>

      {/* Protocol Transaction Flow Lifecycle */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          Transaction Lifecycle in LandLedger
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold text-xs">STEP 01</span>
            <h4 className="font-bold text-white">Land Cadastre Entry</h4>
            <p className="text-slate-400 text-[11px]">
              Surveyors and registration officers submit surveyed coordinates, survey number, and titleholder identity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="text-teal-400 font-mono font-bold text-xs">STEP 02</span>
            <h4 className="font-bold text-white">Payload Serialization</h4>
            <p className="text-slate-400 text-[11px]">
              Parcel details, conveyance metadata, and previous block hash are concatenated into a canonical payload string.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="text-cyan-400 font-mono font-bold text-xs">STEP 03</span>
            <h4 className="font-bold text-white">SHA-256 Mining</h4>
            <p className="text-slate-400 text-[11px]">
              The block generates its unique 64-character hexadecimal SHA-256 digest and locks it to the ledger.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="text-indigo-400 font-mono font-bold text-xs">STEP 04</span>
            <h4 className="font-bold text-white">Autonomous Verification</h4>
            <p className="text-slate-400 text-[11px]">
              Any citizen or banking institution can verify parcel authenticity instantly by executing an audit against the ledger.
            </p>
          </div>
        </div>
      </div>

      {/* System Governance & Cadastral Compliance Notice */}
      <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/20 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Cadastral Standards & Legal Non-Repudiation Architecture
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            LANDLEDGER delivers sovereign digital cadastre management. Every land parcel boundary, survey coordinate, title conveyance deed, and ownership event is cryptographically sealed using SHA-256 block hashing and linked sequentially to enforce an immutable, non-repudiable audit trail.
          </p>
        </div>
      </div>

      {/* Live Deployment & Documentation Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-sm font-bold text-white">Live Working Demo & Repository</h4>
          </div>
          <p className="text-xs text-slate-400">
            The full-stack application is deployed live with verified SHA-256 block integrity and interactive cadastral mapping.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://ais-pre-wzjrwotqcwi3pt2a3hs7x6-614781592914.asia-east1.run.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 inline-flex items-center gap-1.5"
          >
            <span>Live Demo URL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
