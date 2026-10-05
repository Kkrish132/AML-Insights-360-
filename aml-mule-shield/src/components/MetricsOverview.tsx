import React from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Users, 
  Zap, 
  Network, 
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Scenario } from '../types';

interface MetricsOverviewProps {
  currentScenario: Scenario;
  frozenAccountsCount: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  currentScenario,
  frozenAccountsCount
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const flaggedPercent = Math.round((currentScenario.summary.flaggedVolume / Math.max(1, currentScenario.summary.totalVolume)) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      
      {/* Metric 1: Total Capital Flow */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">Monitored Wire Volume</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-slate-900">
          {formatCurrency(currentScenario.summary.totalVolume)}
        </div>
        <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" /> Real-time Wire Feed Active
        </div>
      </div>

      {/* Metric 2: Flagged Laundered Amount */}
      <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs hover:border-amber-300 transition-all bg-gradient-to-br from-white to-amber-50/40">
        <div className="flex items-center justify-between text-amber-800 mb-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">Flagged Suspicious</span>
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-amber-900">
          {formatCurrency(currentScenario.summary.flaggedVolume)}
        </div>
        <div className="text-[11px] text-amber-800 flex items-center gap-1 mt-1 font-medium">
          <TrendingUp className="w-3.5 h-3.5" /> {flaggedPercent}% of case volume
        </div>
      </div>

      {/* Metric 3: Identified Mules */}
      <div className="bg-white p-3.5 rounded-xl border border-red-200 shadow-xs hover:border-red-300 transition-all bg-gradient-to-br from-white to-red-50/40">
        <div className="flex items-center justify-between text-red-800 mb-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">Mule Accounts</span>
          <div className="p-1.5 rounded-lg bg-red-100 text-red-800">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-red-900 flex items-center gap-2">
          {currentScenario.summary.suspiciousAccounts} Suspect Nodes
        </div>
        <div className="text-[11px] text-red-700 flex items-center gap-1 mt-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> {frozenAccountsCount} Frozen / Held
        </div>
      </div>

      {/* Metric 4: Rapid Drain Velocity */}
      <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs hover:border-blue-300 transition-all bg-gradient-to-br from-white to-blue-50/40">
        <div className="flex items-center justify-between text-blue-800 mb-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider">Pass-Through Time</span>
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono text-blue-950">
          {currentScenario.summary.avgDrainTime}
        </div>
        <div className="text-[11px] text-blue-700 mt-1 font-medium">
          Velocity Anomaly (&lt;60s Evacuation)
        </div>
      </div>

    </div>
  );
};
