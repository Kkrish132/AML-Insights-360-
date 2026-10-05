import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Pause, 
  Play, 
  Search, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  DollarSign, 
  Clock,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { TransactionLink, AccountNode, Scenario } from '../types';
import { soundFx } from '../utils/audio';

interface LiveTransactionsProps {
  scenario: Scenario;
  onSelectNodeById: (nodeId: string) => void;
}

export const LiveTransactions: React.FC<LiveTransactionsProps> = ({
  scenario,
  onSelectNodeById
}) => {
  const [transactions, setTransactions] = useState<TransactionLink[]>(scenario.links);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    setTransactions(scenario.links);
  }, [scenario]);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const randomNodeA = scenario.nodes[Math.floor(Math.random() * scenario.nodes.length)];
      const randomNodeB = scenario.nodes[Math.floor(Math.random() * scenario.nodes.length)];
      if (randomNodeA.id === randomNodeB.id) return;

      const amounts = [9850, 9920, 4800, 12500, 9780, 24500, 9900, 850];
      const selectedAmount = amounts[Math.floor(Math.random() * amounts.length)];
      const isCritical = selectedAmount >= 9000 && selectedAmount < 10000;

      const newTx: TransactionLink = {
        id: `tx-live-${Date.now()}`,
        source: randomNodeA.id,
        target: randomNodeB.id,
        amount: selectedAmount,
        currency: 'USD',
        timestamp: new Date().toLocaleTimeString(),
        type: isCritical ? 'WIRE' : 'FASTER_PAYMENT',
        flags: isCritical 
          ? ['Structuring < $10k Detection', 'Rapid Pass-Through Drain']
          : ['Routine Settlement'],
        riskLevel: isCritical ? 'CRITICAL' : 'LOW',
        latencySecs: Math.floor(15 + Math.random() * 45)
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 49)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming, scenario]);

  const getNodeName = (nodeId: string) => {
    const node = scenario.nodes.find(n => n.id === nodeId);
    return node ? node.name : nodeId;
  };

  const filteredTx = transactions.filter(tx => {
    if (filterRisk === 'CRITICAL' && tx.riskLevel !== 'CRITICAL') return false;
    if (filterRisk === 'STRUCTURING' && !tx.flags.some(f => f.toLowerCase().includes('structuring'))) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const sName = getNodeName(tx.source).toLowerCase();
      const tName = getNodeName(tx.target).toLowerCase();
      const flagsStr = tx.flags.join(' ').toLowerCase();
      return sName.includes(q) || tName.includes(q) || flagsStr.includes(q) || tx.amount.toString().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs flex flex-col h-[520px]">
      
      {/* Header & Stream Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Real-Time AML Transaction Stream
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold ${
                isStreaming 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'}`}></span>
                {isStreaming ? 'FEED ACTIVE' : 'PAUSED'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Filters */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              setIsStreaming(!isStreaming);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-900 shadow-2xs font-semibold"
          >
            {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-700" />}
            <span>{isStreaming ? 'Pause' : 'Resume'}</span>
          </button>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 text-[11px] font-mono font-semibold">
            {['ALL', 'CRITICAL', 'STRUCTURING'].map(tier => (
              <button
                key={tier}
                onClick={() => {
                  soundFx.playScanTick();
                  setFilterRisk(tier);
                }}
                className={`px-2 py-0.5 rounded ${
                  filterRisk === tier 
                    ? 'bg-white text-emerald-900 font-bold border border-emerald-300 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Live Transaction Stream List */}
      <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
        {filteredTx.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No transactions match the selected filter criteria.
          </div>
        ) : (
          filteredTx.map(tx => {
            const isCrit = tx.riskLevel === 'CRITICAL';
            return (
              <div
                key={tx.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCrit
                    ? 'bg-red-50/60 hover:bg-red-50 border-red-200 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                {/* Transaction Route & Accounts */}
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isCrit ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {isCrit ? <AlertTriangle className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900">
                      <button 
                        onClick={() => onSelectNodeById(tx.source)}
                        className="hover:text-emerald-700 hover:underline"
                        title="Click to view sender in graph"
                      >
                        {getNodeName(tx.source)}
                      </button>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <button 
                        onClick={() => onSelectNodeById(tx.target)}
                        className="hover:text-emerald-700 hover:underline"
                        title="Click to view beneficiary in graph"
                      >
                        {getNodeName(tx.target)}
                      </button>
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {tx.flags.map((flag, idx) => (
                        <span 
                          key={idx}
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                            isCrit 
                              ? 'bg-red-100 text-red-800 border-red-200' 
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amount, Latency & Timestamp */}
                <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                  <div>
                    <div className={`text-sm font-mono font-bold ${isCrit ? 'text-red-800' : 'text-slate-900'}`}>
                      ${tx.amount.toLocaleString()} {tx.currency}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center justify-end gap-1">
                      <Clock className="w-2.5 h-2.5" /> {tx.timestamp} ({tx.latencySecs}s pass)
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-1 rounded-lg border uppercase font-bold ${
                    isCrit 
                      ? 'bg-red-100 text-red-800 border-red-300' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {tx.riskLevel}
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
