import React, { useState } from 'react';
import { 
  PlusCircle, 
  X, 
  Check, 
  ArrowRight, 
  UserPlus, 
  Send, 
  DollarSign, 
  ShieldAlert, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { AccountNode, TransactionLink, Scenario } from '../types';
import { computeGraphAnalytics } from '../utils/csvParser';
import { soundFx } from '../utils/audio';

interface CustomGraphEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  onUpdateScenario: (updatedScenario: Scenario) => void;
}

export const CustomGraphEditorModal: React.FC<CustomGraphEditorModalProps> = ({
  isOpen,
  onClose,
  scenario,
  onUpdateScenario
}) => {
  const [activeTab, setActiveTab] = useState<'ADD_NODE' | 'ADD_TRANSACTION'>('ADD_NODE');

  // Node Form State
  const [nodeName, setNodeName] = useState<string>('New Suspect Account');
  const [accountNumber, setAccountNumber] = useState<string>(`ACC-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [role, setRole] = useState<AccountNode['role']>('mule_account');
  const [muleType, setMuleType] = useState<AccountNode['muleType']>('Complicit Mule');
  const [balance, setBalance] = useState<number>(4500);
  const [bank, setBank] = useState<string>('Citibank');
  const [deviceId, setDeviceId] = useState<string>('DEV-IPHONE-14-PRO');
  const [ip, setIp] = useState<string>('192.168.10.45');

  // Transaction Form State
  const [sourceId, setSourceId] = useState<string>(scenario.nodes[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(scenario.nodes[1]?.id || '');
  const [amount, setAmount] = useState<number>(9850);
  const [txType, setTxType] = useState<TransactionLink['type']>('WIRE');
  const [customFlag, setCustomFlag] = useState<string>('Structuring CTR Evasion');

  if (!isOpen) return null;

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();

    const newNodeId = `custom-node-${Date.now()}`;
    const riskScore = role === 'collector' ? 98 : (muleType !== 'None' ? 95 : 20);

    const newNode: AccountNode = {
      id: newNodeId,
      accountNumber,
      name: nodeName,
      role,
      muleType,
      riskScore,
      riskTier: riskScore > 90 ? 'CRITICAL' : (riskScore > 75 ? 'HIGH' : 'LOW'),
      status: 'UNDER_REVIEW',
      balance,
      currency: 'USD',
      bank,
      country: 'US',
      ip,
      deviceId,
      velocityScore: 94,
      drainLatencySeconds: 35,
      inflowOutflowRatio: 0.98,
      dormantDaysPriorToBurst: 0,
      kycTier: 'TIER_1_BASIC',
      inDegree: 0,
      outDegree: 0,
      pageRank: 0.1,
      betweennessCentrality: 0.1,
      eigenvectorCentrality: 0.1,
      clusteringCoefficient: 0,
      communityCluster: 'Cluster-Custom',
      shapFactors: [
        { feature: 'Manual Dynamic Node Injection', impact: 45, description: 'Added via interactive graph editor' }
      ]
    };

    const updatedNodes = [...scenario.nodes, newNode];
    const { nodes: recomputedNodes, metrics } = computeGraphAnalytics(updatedNodes, scenario.links);

    const updatedScenario: Scenario = {
      ...scenario,
      nodes: recomputedNodes,
      graphMetrics: metrics,
      summary: {
        ...scenario.summary,
        suspiciousAccounts: scenario.summary.suspiciousAccounts + 1
      }
    };

    onUpdateScenario(updatedScenario);
    onClose();
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) {
      soundFx.playAlert();
      return;
    }
    soundFx.playSuccess();

    const newTxId = `custom-tx-${Date.now()}`;
    const isCritical = amount >= 9000 && amount < 10000;

    const newLink: TransactionLink = {
      id: newTxId,
      source: sourceId,
      target: targetId,
      amount,
      currency: 'USD',
      timestamp: new Date().toLocaleTimeString(),
      type: txType,
      flags: [customFlag, isCritical ? 'Structuring < $10k Detection' : 'Manual Wire'],
      riskLevel: isCritical ? 'CRITICAL' : 'HIGH',
      latencySecs: 28
    };

    const updatedLinks = [newLink, ...scenario.links];
    const { nodes: recomputedNodes, metrics } = computeGraphAnalytics(scenario.nodes, updatedLinks);

    const updatedScenario: Scenario = {
      ...scenario,
      links: updatedLinks,
      nodes: recomputedNodes,
      graphMetrics: metrics,
      summary: {
        ...scenario.summary,
        totalVolume: scenario.summary.totalVolume + amount,
        flaggedVolume: scenario.summary.flaggedVolume + amount
      }
    };

    onUpdateScenario(updatedScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-emerald-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/30 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-glow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                Graph Node &amp; Edge Creator
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Dynamically inject accounts and transfer paths into the live topological graph.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playScanTick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('ADD_NODE');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ADD_NODE'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Account (Node)</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('ADD_TRANSACTION');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ADD_TRANSACTION'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Connect Transfer (Edge)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 font-mono text-xs">
          {activeTab === 'ADD_NODE' ? (
            <form onSubmit={handleAddNode} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Account Holder Name:</label>
                  <input
                    type="text"
                    required
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Account Number:</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Graph Role:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="mule_account">Mule Account (Layering)</option>
                    <option value="collector">Master Collector Hub</option>
                    <option value="origin_fund">Origin Inflow Source</option>
                    <option value="crypto_offramp">Crypto P2P Offramp</option>
                    <option value="shell_company">Shell Entity LLC</option>
                    <option value="legit_customer">Legitimate Customer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mule Typology Classification:</label>
                  <select
                    value={muleType}
                    onChange={(e) => setMuleType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Complicit Mule">Complicit Mule (Recruited)</option>
                    <option value="Deceived (Job/Romance Scam)">Deceived Mule (Job/Romance Scam)</option>
                    <option value="Stolen Identity">Stolen / Synthetic Identity</option>
                    <option value="Master Organizer">Master Syndicate Organizer</option>
                    <option value="Shell Entity">Shell Entity</option>
                    <option value="None">None (Legitimate)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Initial Balance ($):</label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Bank Name:</label>
                  <input
                    type="text"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Device Hardware ID:</label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Insert Node to Graph</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Source Account (Origin):</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {scenario.nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.accountNumber})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Account (Beneficiary):</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {scenario.nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.accountNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Amount ($ USD):</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                  {amount >= 9000 && amount < 10000 && (
                    <span className="text-[9px] text-amber-400 mt-1 block">⚠ Triggers Structuring &lt; $10,000 threshold flag</span>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Transfer Protocol:</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="WIRE">Fedwire / SWIFT Interbank Wire</option>
                    <option value="FASTER_PAYMENT">Instant / Faster Payment Rail</option>
                    <option value="CRYPTO_P2P">Peer-to-Peer Crypto Escrow</option>
                    <option value="ACH">ACH Automated Clearing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Anomaly Tag / Risk Flag:</label>
                <input
                  type="text"
                  value={customFlag}
                  onChange={(e) => setCustomFlag(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. Rapid Drain / Pass-Through"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-glow-cyan flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Connect Path &amp; Recalculate</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
