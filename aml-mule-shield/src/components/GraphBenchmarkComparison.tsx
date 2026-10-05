import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Percent,
  DollarSign
} from 'lucide-react';
import { modelBenchmarks, historicalQuarterComparisons } from '../data/mockScenarios';
import { ModelBenchmark } from '../types';
import { soundFx } from '../utils/audio';

export const GraphBenchmarkComparison: React.FC = () => {
  const [selectedBenchmarkModel, setSelectedBenchmarkModel] = useState<string>('CURRENT_GNN');
  const [activeView, setActiveView] = useState<'BENCHMARK_TABLE' | 'HISTORICAL_TIMELINE' | 'CONFUSION_MATRIX'>('BENCHMARK_TABLE');

  const gnnModel = modelBenchmarks.find(m => m.type === 'CURRENT_GNN')!;
  const pastMlModel = modelBenchmarks.find(m => m.type === 'PAST_ML_BASELINE')!;
  const legacyRuleModel = modelBenchmarks.find(m => m.type === 'LEGACY_RULE_BASED')!;

  // Confusion Matrix Data (per 10,000 transactions sample)
  const confusionData = {
    CURRENT_GNN: { tp: 994, fp: 36, tn: 8964, fn: 6, precision: 96.5, recall: 99.4, accuracy: 99.6 },
    PAST_ML_BASELINE: { tp: 782, fp: 612, tn: 8388, fn: 218, precision: 56.1, recall: 78.2, accuracy: 91.7 },
    LEGACY_RULE_BASED: { tp: 461, fp: 1701, tn: 7299, fn: 539, precision: 21.3, recall: 46.1, accuracy: 77.6 }
  };

  const currentConf = confusionData[selectedBenchmarkModel as keyof typeof confusionData];

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs mb-6">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Model vs. Past Benchmarks &amp; Historical Performance
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Quantitative Comparison
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Comparative metrics demonstrating performance leap of Temporal Graph Neural Networks over past quarterly baselines.
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-mono">
          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveView('BENCHMARK_TABLE');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'BENCHMARK_TABLE'
                ? 'bg-white text-emerald-900 border border-emerald-300 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side Matrix
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveView('HISTORICAL_TIMELINE');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'HISTORICAL_TIMELINE'
                ? 'bg-white text-emerald-900 border border-emerald-300 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quarterly Evolution (Q1-Q4)
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveView('CONFUSION_MATRIX');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'CONFUSION_MATRIX'
                ? 'bg-white text-emerald-900 border border-emerald-300 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confusion Matrix (10k)
          </button>
        </div>
      </div>

      {/* VIEW 1: Side-by-Side Benchmark Matrix */}
      {activeView === 'BENCHMARK_TABLE' && (
        <div className="mt-4 space-y-4">
          
          {/* Key KPI Deltas Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Detection Speedup</div>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-1 flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-emerald-700" />
                1,500,000x Faster
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                11.4 ms vs 4.8 hours (Legacy SQL)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">False Positive Reduction</div>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-1 flex items-center gap-1.5">
                <TrendingDown className="w-5 h-5 text-emerald-700" />
                -97.9% Drop
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                0.4% FPR vs 18.9% (Legacy SQL)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300">
              <div className="text-[10px] font-mono text-amber-900 uppercase font-semibold">Cycle Loop Interception</div>
              <div className="text-xl font-bold font-mono text-amber-950 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-amber-700" />
                100% vs 12%
              </div>
              <div className="text-[10px] text-amber-800 font-mono mt-0.5">
                Full graph Tarjan cycle coverage
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Capital Loss Intercepted</div>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-1 flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                $4.82M vs $420k
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                +$4.4M net prevented laundering
              </div>
            </div>

          </div>

          {/* Full Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Surveillance Architecture</th>
                  <th className="p-3.5 text-emerald-900 bg-emerald-50/80 border-x border-emerald-200">
                    ✨ Aegis Temporal GNN (Current)
                  </th>
                  <th className="p-3.5 text-slate-700">
                    Past ML (XGBoost v1.4 - Q4 '25)
                  </th>
                  <th className="p-3.5 text-slate-500">
                    Legacy Rule Engine (SQL - 2024)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                
                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">F1 Classification Score</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/40 border-x border-emerald-200">
                    {gnnModel.f1Score}%
                  </td>
                  <td className="p-3.5 text-amber-800 font-semibold">{pastMlModel.f1Score}%</td>
                  <td className="p-3.5 text-red-700 font-semibold">{legacyRuleModel.f1Score}%</td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">Model Precision / Recall</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/40 border-x border-emerald-200">
                    {gnnModel.precision}% / {gnnModel.recall}%
                  </td>
                  <td className="p-3.5">{pastMlModel.precision}% / {pastMlModel.recall}%</td>
                  <td className="p-3.5 text-slate-600">{legacyRuleModel.precision}% / {legacyRuleModel.recall}%</td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">False Positive Rate (FPR)</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/40 border-x border-emerald-200">
                    {gnnModel.falsePositiveRate}% (Near-Zero)
                  </td>
                  <td className="p-3.5 text-amber-800">{pastMlModel.falsePositiveRate}%</td>
                  <td className="p-3.5 text-red-700 font-bold">{legacyRuleModel.falsePositiveRate}% (Severe Noise)</td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">Inference / Alert Latency</td>
                  <td className="p-3.5 font-bold text-blue-900 bg-emerald-50/40 border-x border-emerald-200">
                    {gnnModel.detectionLatency} (Real-time Stream)
                  </td>
                  <td className="p-3.5">{pastMlModel.detectionLatency}</td>
                  <td className="p-3.5 text-red-700">{legacyRuleModel.detectionLatency}</td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">Mule Ring Interception Rate</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/40 border-x border-emerald-200">
                    {gnnModel.muleInterceptionRate}% Interception
                  </td>
                  <td className="p-3.5">{pastMlModel.muleInterceptionRate}%</td>
                  <td className="p-3.5 text-red-700">{legacyRuleModel.muleInterceptionRate}%</td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">Graph Cycle Round-Trip Detection</td>
                  <td className="p-3.5 font-bold text-amber-800 bg-emerald-50/40 border-x border-emerald-200">
                    {gnnModel.graphCycleDetectionRate}% Coverage
                  </td>
                  <td className="p-3.5">{pastMlModel.graphCycleDetectionRate}%</td>
                  <td className="p-3.5 text-red-700">{legacyRuleModel.graphCycleDetectionRate}% (Blind)</td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-all">
                  <td className="p-3.5 font-semibold text-slate-900">False Alert Investigation Cost / Mo</td>
                  <td className="p-3.5 font-bold text-emerald-800 bg-emerald-50/40 border-x border-emerald-200">
                    ${gnnModel.falseAlertsCostPerMonth.toLocaleString()} USD
                  </td>
                  <td className="p-3.5">${pastMlModel.falseAlertsCostPerMonth.toLocaleString()} USD</td>
                  <td className="p-3.5 text-red-700">${legacyRuleModel.falseAlertsCostPerMonth.toLocaleString()} USD</td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* VIEW 2: Historical Quarterly Progression (Q1 2025 -> Q3 2026) */}
      {activeView === 'HISTORICAL_TIMELINE' && (
        <div className="mt-4 space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            📊 Historical progression tracking the evolution of the bank's AML surveillance infrastructure over the past 7 quarters.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
            {historicalQuarterComparisons.map((item, idx) => {
              const isLatest = idx === historicalQuarterComparisons.length - 1;
              return (
                <div 
                  key={item.quarter}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    isLatest 
                      ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                      <span className={isLatest ? 'text-emerald-900' : 'text-slate-800'}>{item.quarter}</span>
                      {isLatest && <span className="text-[9px] px-1 rounded bg-emerald-700 text-white font-bold">CURRENT</span>}
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono mb-2 line-clamp-2">
                      {item.systemType}
                    </div>

                    <div className="space-y-1.5 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-semibold">F1 Score</span>
                        <span className={`font-bold ${item.f1Score > 90 ? 'text-emerald-800' : (item.f1Score > 65 ? 'text-amber-800' : 'text-red-700')}`}>
                          {item.f1Score}%
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-semibold">False Positives</span>
                        <span className={`font-bold ${item.falsePositiveRate < 1 ? 'text-emerald-800' : 'text-amber-800'}`}>
                          {item.falsePositiveRate}%
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[9px] block uppercase font-semibold">Saved Loss</span>
                        <span className="font-bold text-slate-900">
                          ${(item.preventedLossUSD / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-blue-800 font-semibold">
                    {item.detectionTimeSeconds >= 3600 
                      ? `${(item.detectionTimeSeconds / 3600).toFixed(1)} hrs` 
                      : (item.detectionTimeSeconds >= 60 ? `${(item.detectionTimeSeconds / 60).toFixed(1)} mins` : `${(item.detectionTimeSeconds * 1000).toFixed(0)} ms`)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Confusion Matrix Benchmark (10,000 Sample Population) */}
      {activeView === 'CONFUSION_MATRIX' && (
        <div className="mt-4 space-y-4">
          
          {/* Model Selector Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 font-medium">Select Model Architecture:</span>
            {[
              { id: 'CURRENT_GNN', label: 'Temporal GNN (Current)' },
              { id: 'PAST_ML_BASELINE', label: 'XGBoost Baseline (Past ML)' },
              { id: 'LEGACY_RULE_BASED', label: 'Legacy SQL Rules' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  soundFx.playScanTick();
                  setSelectedBenchmarkModel(m.id);
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all font-semibold ${
                  selectedBenchmarkModel === m.id
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Confusion Matrix 2x2 Grid */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-mono font-bold text-slate-900 uppercase mb-3 flex items-center justify-between">
                <span>Confusion Matrix (N = 10,000 Transactions)</span>
                <span className="text-emerald-800 font-bold">Accuracy: {currentConf.accuracy}%</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                
                {/* True Positive */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                  <div className="text-[10px] text-emerald-800 uppercase font-bold">True Positive (TP)</div>
                  <div className="text-2xl font-bold text-emerald-900 my-1">{currentConf.tp.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Correctly Intercepted Mules</div>
                </div>

                {/* False Positive */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-[10px] text-amber-800 uppercase font-bold">False Positive (FP)</div>
                  <div className="text-2xl font-bold text-amber-900 my-1">{currentConf.fp.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Legitimate Flagged (Noise)</div>
                </div>

                {/* False Negative */}
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-[10px] text-red-800 uppercase font-bold">False Negative (FN)</div>
                  <div className="text-2xl font-bold text-red-900 my-1">{currentConf.fn.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Missed Laundering Wires</div>
                </div>

                {/* True Negative */}
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] text-slate-600 uppercase font-bold">True Negative (TN)</div>
                  <div className="text-2xl font-bold text-slate-800 my-1">{currentConf.tn.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Correctly Cleared Legit</div>
                </div>

              </div>
            </div>

            {/* Derived Mathematical Scores */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-slate-900 uppercase mb-3">
                  Derived Classification Performance
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 font-medium">Precision (TP / (TP + FP)):</span>
                      <span className="text-emerald-800 font-bold">{currentConf.precision}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${currentConf.precision}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 font-medium">Recall / Sensitivity (TP / (TP + FN)):</span>
                      <span className="text-blue-800 font-bold">{currentConf.recall}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${currentConf.recall}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 font-medium">Overall Accuracy ((TP+TN) / N):</span>
                      <span className="text-purple-800 font-bold">{currentConf.accuracy}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${currentConf.accuracy}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-500">
                📌 Graph Neural Network structural embeddings reduce false alerts by 94.2%, saving over $60k/month in manual compliance triage costs.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
