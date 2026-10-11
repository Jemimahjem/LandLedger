import React from 'react';
import { ActivityFeedItem } from '../types';
import { Layers, ArrowLeftRight, CheckCircle2, ShieldAlert, Clock, Sparkles } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
  onSelectRecord?: (landId: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  onSelectRecord
}) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'registration':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'transfer':
        return <ArrowLeftRight className="w-4 h-4 text-cyan-400" />;
      case 'verification':
      case 'verify':
        return <CheckCircle2 className="w-4 h-4 text-teal-400" />;
      case 'tamper':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
            Recent Ledger Activity Feed
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Live Events
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            id={`activity-item-${item.id}`}
            onClick={() => item.landId && onSelectRecord && onSelectRecord(item.landId)}
            className={`p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs transition-colors ${
              item.landId ? 'hover:border-slate-700 cursor-pointer' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              <div>
                <p className="font-semibold text-slate-200 leading-snug">{item.title}</p>
                {item.description && item.description !== item.title && (
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{item.description}</p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                  {item.landId && (
                    <span className="text-emerald-400 font-semibold">{item.landId}</span>
                  )}
                  {item.blockIndex !== undefined && (
                    <span>Block #{item.blockIndex}</span>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 shrink-0 font-mono">
              {item.relativeTime || item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
