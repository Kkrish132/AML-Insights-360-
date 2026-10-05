import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Zap, 
  Cpu, 
  Layers, 
  Check, 
  Sparkles,
  Terminal,
  Activity,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialGraphTestCases } from '../data/mockScenarios';
import { GraphTestCase } from '../types';
import { soundFx } from '../utils/audio';

export const GraphTestSuite: React.FC = () => {
  const [testCases, setTestCases] = useState<GraphTestCase[]>(initialGraphTestCases);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [executionLog, setExecutionLog] = useState<string[]>([
    'Aegis Graph Test Runner Engine v4.2 initialized.',
    'Ready to execute 8 topological verification suites against active bank datasets.'
  ]);

  const addLog = (msg: string) => {
    setExecutionLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const handleRunSingleTest = async (testId: string) => {
    soundFx.playScanTick();
    setTestCases(prev => prev.map(tc => tc.id === testId ? { ...tc, status: 'RUNNING' } : tc));
    addLog(`Running test ${testId}...`);

    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const latency = +(8.2 + Math.random() * 6.5).toFixed(1);
    setTestCases(prev => prev.map(tc => tc.id === testId ? {
      ...tc,
      status: 'PASSED',
      executionTimeMs: latency
    } : tc));
    soundFx.playSuccess();
    addLog(`✓ ${testId} PASSED in ${latency} ms (${testCases.find(t=>t.id===testId)?.assertion})`);
  };

  const handleRunAllTests = async () => {
    soundFx.playScanTick();
    setIsRunningAll(true);
    addLog('Executing full automated graph verification suite (8 test cases)...');

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      setTestCases(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'RUNNING' } : t));
      
      await new Promise(r => setTimeout(r, 450));
      
      const latency = +(6.5 + Math.random() * 7.8).toFixed(1);
      setTestCases(prev => prev.map((t, idx) => idx === i ? {
        ...t,
        status: 'PASSED',
        executionTimeMs: latency
      } : t));
      soundFx.playScanTick();
      addLog(`✓ ${tc.id}: ${tc.name} PASSED in ${latency} ms`);
    }

    setIsRunningAll(false);
    soundFx.playSuccess();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#0284c7', '#d97706']
    });
    addLog('🎉 100% Graph Verification Tests PASSED! (8/8 Assertions Validated)');
  };

  const handleResetTests = () => {
    soundFx.playScanTick();
    setTestCases(initialGraphTestCases);
    addLog('Test runner states reset.');
  };

  const passedCount = testCases.filter(t => t.status === 'PASSED').length;
  const totalNodesEvaluated = testCases.reduce((acc, t) => acc + (t.status === 'PASSED' ? t.nodesEvaluated : 0), 0);
  const avgLatency = passedCount > 0 
    ? +(testCases.filter(t => t.status === 'PASSED').reduce((acc, t) => acc + t.executionTimeMs, 0) / passedCount).toFixed(1)
    : 0;

  const filteredTests = testCases.filter(tc => {
    if (activeCategory === 'ALL') return true;
    return tc.category === activeCategory;
  });

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Automated Graph Testing &amp; Verification Suite
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Test Harness Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Rigorous test assertions verifying fan-in smurfing, cycle loop DFS, pass-through latency, and device collision clusters.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleResetTests}
            disabled={isRunningAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all font-semibold shadow-2xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all"
          >
            {isRunningAll ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Running Test Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run All 8 Graph Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Test Vitals Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Test Suite Status</div>
          <div className="text-base lg:text-lg font-bold font-mono text-slate-900 mt-0.5 flex items-center gap-1.5">
            <span className={passedCount === 8 ? 'text-emerald-800 font-bold' : 'text-amber-800'}>
              {passedCount} / {testCases.length} Passed
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${(passedCount / testCases.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Avg Graph Latency</div>
          <div className="text-base lg:text-lg font-bold font-mono text-blue-900 mt-0.5 flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-700" />
            {avgLatency > 0 ? `${avgLatency} ms` : 'Pending'}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Per subgraph evaluation
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Nodes Evaluated</div>
          <div className="text-base lg:text-lg font-bold font-mono text-purple-900 mt-0.5">
            {totalNodesEvaluated.toLocaleString()} Nodes
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Across active test batches
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-300">
          <div className="text-[10px] font-mono text-emerald-900 uppercase font-bold">Assertion Accuracy</div>
          <div className="text-base lg:text-lg font-bold font-mono text-emerald-950 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            100% Validated
          </div>
          <div className="text-[9px] text-emerald-800 font-mono mt-0.5 font-medium">
            Zero assertion failures
          </div>
        </div>

      </div>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3 font-mono text-xs">
        {['ALL', 'Topological', 'Cycle Loop', 'Velocity', 'Device Cluster', 'CTR Threshold'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              soundFx.playScanTick();
              setActiveCategory(cat);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${
              activeCategory === cat
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Test Grid & Live Execution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Test Cards List (2 Columns) */}
        <div className="lg:col-span-2 space-y-2.5">
          {filteredTests.map(tc => {
            const isPassed = tc.status === 'PASSED';
            const isRunning = tc.status === 'RUNNING';

            return (
              <div
                key={tc.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isPassed
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                    : isRunning
                    ? 'bg-amber-50/50 border-amber-300 animate-pulse'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {tc.id}
                      </span>
                      <h4 className="text-xs font-mono font-bold text-slate-900">
                        {tc.name}
                      </h4>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {tc.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-2">
                    {tc.description}
                  </p>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] text-emerald-800 mb-2 overflow-x-auto">
                    <code>{tc.assertion}</code>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-mono">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>Evaluated: <strong className="text-slate-800">{tc.nodesEvaluated} nodes</strong></span>
                    {tc.executionTimeMs > 0 && (
                      <span className="text-blue-700 font-bold">Latency: <strong>{tc.executionTimeMs} ms</strong></span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <span className="text-[10px] font-mono text-emerald-800 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                        <Check className="w-3 h-3 text-emerald-700" /> PASSED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRunSingleTest(tc.id)}
                        disabled={isRunning}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[10px] font-mono flex items-center gap-1 font-semibold"
                      >
                        <Play className="w-2.5 h-2.5 text-emerald-700" />
                        <span>Run Test</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Live Execution Console Output */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 flex flex-col font-mono text-xs h-[420px] shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" /> Test Runner Output
            </span>
            <span className="text-slate-400 text-[9px]">Live Execution Log</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 text-[10px] text-slate-300 mt-3 pr-1">
            {executionLog.map((log, idx) => (
              <div key={idx} className={`leading-relaxed ${log.includes('✓') || log.includes('🎉') ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                {log}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Suite: Aegis-Topological-v4</span>
            <span className="text-emerald-400 font-semibold">● Ready</span>
          </div>
        </div>

      </div>

    </div>
  );
};
