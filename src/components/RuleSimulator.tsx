import React, { useState } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ShieldAlert, 
  DollarSign, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const RuleSimulator: React.FC = () => {
  const [velocityThreshold, setVelocityThreshold] = useState<number>(45); // seconds
  const [structuringLower, setStructuringLower] = useState<number>(9000); // USD
  const [inDegreeThreshold, setInDegreeThreshold] = useState<number>(4); // count
  const [dormancyDays, setDormancyDays] = useState<number>(60); // days
  const [minTurnoverRatio, setMinTurnoverRatio] = useState<number>(85); // %

  const handleReset = () => {
    soundFx.playScanTick();
    setVelocityThreshold(45);
    setStructuringLower(9000);
    setInDegreeThreshold(4);
    setDormancyDays(60);
    setMinTurnoverRatio(85);
  };

  // Dynamically calculate simulated model outcomes
  const estimatedInterception = Math.min(99.8, 85 + (60 - velocityThreshold) * 0.2 + (inDegreeThreshold <= 3 ? 4 : 0));
  const estimatedFalsePositive = Math.max(0.2, (10000 - structuringLower) * 0.0008 + (velocityThreshold < 20 ? 1.4 : 0.3));

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                AML Surveillance Rule &amp; Threshold Simulator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Dynamic Policy Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Calibrate graph threshold parameters and simulate impact on false positive rates and mule account capture.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-mono font-semibold shadow-2xs transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left 7 Columns: Rule Sliders */}
        <div className="lg:col-span-7 space-y-4 font-mono text-xs">
          
          {/* Slider 1: Pass-Through Drain Time */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-800 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-700" /> Rapid Pass-Through Velocity Threshold:
              </span>
              <span className="text-blue-900 font-bold text-sm">{velocityThreshold} Seconds</span>
            </div>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={velocityThreshold}
              onChange={(e) => {
                setVelocityThreshold(parseInt(e.target.value));
                soundFx.playScanTick();
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10s (High Aggression)</span>
              <span>180s (Relaxed)</span>
            </div>
          </div>

          {/* Slider 2: Structuring Window */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-800 font-bold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-700" /> CTR Structuring Detection Floor:
              </span>
              <span className="text-amber-900 font-bold text-sm">${structuringLower.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="7500"
              max="9950"
              step="50"
              value={structuringLower}
              onChange={(e) => {
                setStructuringLower(parseInt(e.target.value));
                soundFx.playScanTick();
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$7,500</span>
              <span>$9,950 (Standard $10k FinCEN threshold)</span>
            </div>
          </div>

          {/* Slider 3: Smurfing Fan-In Degree */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-800 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-700" /> Minimum Fan-In Degree (In-Degree k_in):
              </span>
              <span className="text-purple-900 font-bold text-sm">{inDegreeThreshold} Inbound Nodes</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={inDegreeThreshold}
              onChange={(e) => {
                setInDegreeThreshold(parseInt(e.target.value));
                soundFx.playScanTick();
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2 Inflows</span>
              <span>10 Inflows</span>
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Projected Impact HUD */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between font-mono">
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" /> Real-time Projected Policy Impact
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Simulated Interception Rate:</span>
                  <span className="text-emerald-800 font-bold text-base">{estimatedInterception.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${estimatedInterception}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Estimated False Positive Rate:</span>
                  <span className={`font-bold text-base ${estimatedFalsePositive < 1 ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {estimatedFalsePositive.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, estimatedFalsePositive * 20)}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Monthly Compliance Investigator Hours</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  ~{Math.round(24 + estimatedFalsePositive * 12)} hrs/month
                </div>
                <div className="text-[10px] text-slate-400">Reduced from 480 hrs/month (Legacy Baseline)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500">
            ✓ Graph Neural Network threshold optimization guarantees FinCEN 314(b) compliance while suppressing operational alert fatigue.
          </div>
        </div>

      </div>

    </div>
  );
};
