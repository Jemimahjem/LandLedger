import React from 'react';
import { motion } from 'motion/react';
import { Plus, Cpu, ShieldCheck, ArrowRight, Layers, Lock, Hash } from 'lucide-react';
import { LedgerStats } from '../types';

interface HeroProps {
  stats: LedgerStats | null;
  onRegisterLand: () => void;
  onExploreLedger: () => void;
  onTamperLab: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stats,
  onRegisterLand,
  onExploreLedger,
  onTamperLab
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      {/* Background geometric grid and soft radial glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* GovTech / PropTech badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Decentralized Land Record Management Protocol</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              LAND<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">LEDGER</span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl sm:text-3xl font-semibold text-slate-200 tracking-tight">
              Every parcel. One trusted history.
            </p>

            {/* Supporting text */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Track land records, ownership changes and verification history through a tamper-evident blockchain ledger.
              Powered by real SHA-256 cryptographic block hashing with immutable previous-hash linkage.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-register-land-btn"
                onClick={onRegisterLand}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Register Land</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                id="hero-explore-ledger-btn"
                onClick={onExploreLedger}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700/80 hover:border-slate-600 transition-all duration-200"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Explore Ledger</span>
              </button>

              <button
                id="hero-tamper-lab-btn"
                onClick={onTamperLab}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-amber-300 font-medium text-xs border border-amber-500/30 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Security & Tamper Audit</span>
              </button>
            </div>

            {/* Quick Metrics preview */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Real SHA-256 Hashing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-teal-400" />
                <span>Previous-Hash Chaining</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Zero Trust Architecture</span>
              </div>
            </div>
          </div>

          {/* Right Column: Subtle Animated Blockchain / Parcel Visual */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>BLOCKCHAIN_STATE: ACTIVE</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[11px]">
                  HEIGHT: #{stats?.blockchain_blocks ?? 7}
                </span>
              </div>

              {/* Animated mini blockchain diagram */}
              <div className="space-y-3">
                {/* Block 0 (Genesis) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-300">
                      0
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">Genesis Block</p>
                      <p className="text-[11px] font-mono text-slate-500 truncate max-w-[170px]">
                        Prev: 0000000000000000...
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    fe4ad4d2...
                  </span>
                </motion.div>

                {/* Chaining connector line */}
                <div className="flex items-center justify-center py-0.5">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-500/60 to-teal-500/60" />
                </div>

                {/* Block 1 (Registration) */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">LAND-1001 Registered</p>
                      <p className="text-[11px] text-slate-400">Survey 45/2 • Ravi Kumar</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    9b53cd38...
                  </span>
                </motion.div>

                {/* Chaining connector line */}
                <div className="flex items-center justify-center py-0.5">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-teal-500/60 to-cyan-500/60" />
                </div>

                {/* Block 2 (Transfer) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between text-xs relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400" />
                  <div className="flex items-center gap-3 pl-1">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-300">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <span>Ownership Transfer</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">Sale</span>
                      </p>
                      <p className="text-[11px] text-slate-400">Ravi Kumar ➔ Arjun Kumar</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    af722d7a...
                  </span>
                </motion.div>
              </div>

              {/* Real-time verification badge inside hero visual */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Cryptographic Trust Proof
                </span>
                <span className="text-emerald-400 font-semibold font-mono">100% Chain Integrity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
