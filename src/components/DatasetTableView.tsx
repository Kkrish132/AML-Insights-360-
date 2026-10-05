import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Smartphone, 
  Globe, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Scenario, AccountNode } from '../types';
import { soundFx } from '../utils/audio';

interface DatasetTableViewProps {
  scenario: Scenario;
  selectedNode: AccountNode | null;
  onSelectNode: (node: AccountNode) => void;
  onFreezeAccount: (nodeId: string) => void;
  onUnfreezeAccount: (nodeId: string) => void;
  onGenerateSARForNode: (node: AccountNode) => void;
  frozenAccountIds: string[];
}

export const DatasetTableView: React.FC<DatasetTableViewProps> = ({
  scenario,
  selectedNode,
  onSelectNode,
  onFreezeAccount,
  onUnfreezeAccount,
  onGenerateSARForNode,
  frozenAccountIds
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'balance' | 'inDegree' | 'betweennessCentrality'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'riskScore' | 'balance' | 'inDegree' | 'betweennessCentrality') => {
    soundFx.playScanTick();
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredNodes = scenario.nodes
    .filter(n => {
      if (riskFilter === 'CRITICAL' && n.riskScore < 90) return false;
      if (riskFilter === 'HIGH' && (n.riskScore < 75 || n.riskScore >= 90)) return false;
      if (riskFilter === 'FROZEN' && !frozenAccountIds.includes(n.id)) return false;
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        n.name.toLowerCase().includes(q) ||
        n.accountNumber.toLowerCase().includes(q) ||
        n.bank.toLowerCase().includes(q) ||
        n.muleType.toLowerCase().includes(q) ||
        n.deviceId.toLowerCase().includes(q) ||
        n.ip.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA = a[sortBy] || 0;
      let valB = b[sortBy] || 0;
      return sortOrder === 'desc' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
    });

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs mb-6 flex flex-col space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Uploaded Dataset Account Parameters &amp; Forensic Ledger
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                {scenario.nodes.length} Accounts Extracted
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Complete surveillance table displaying account holder names, balance sheets, graph centralities, and risk scores.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, account, IP, device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs font-mono font-semibold">
            {['ALL', 'CRITICAL', 'HIGH', 'FROZEN'].map(tier => (
              <button
                key={tier}
                onClick={() => {
                  soundFx.playScanTick();
                  setRiskFilter(tier);
                }}
                className={`px-2 py-0.5 rounded ${
                  riskFilter === tier 
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

      {/* Main Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3">Account Holder &amp; Bank</th>
              <th 
                className="p-3 cursor-pointer hover:bg-slate-100 transition-all select-none"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Mule Classification</th>
              <th 
                className="p-3 cursor-pointer hover:bg-slate-100 transition-all select-none"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center gap-1">
                  <span>Balance ($)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:bg-slate-100 transition-all select-none"
                onClick={() => handleSort('inDegree')}
              >
                <div className="flex items-center gap-1">
                  <span>Degree (In / Out)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer hover:bg-slate-100 transition-all select-none"
                onClick={() => handleSort('betweennessCentrality')}
              >
                <div className="flex items-center gap-1">
                  <span>Betweenness (g)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Device &amp; IP Geolocation</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {filteredNodes.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-500 font-mono">
                  No accounts found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isFrozen = frozenAccountIds.includes(node.id);
                return (
                  <tr 
                    key={node.id}
                    className={`hover:bg-slate-50/80 transition-all ${
                      isSelected ? 'bg-emerald-50/60 font-semibold' : ''
                    }`}
                  >
                    {/* Account Holder & Bank */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{node.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span>{node.accountNumber}</span>
                        <span>•</span>
                        <span>{node.bank}</span>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isFrozen
                            ? 'bg-slate-200 text-slate-800'
                            : node.riskScore > 90
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : (node.riskScore > 75 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                        }`}>
                          {isFrozen ? '⛔ FROZEN' : `${node.riskScore}%`}
                        </span>
                      </div>
                    </td>

                    {/* Mule Classification */}
                    <td className="p-3">
                      <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {node.muleType}
                      </span>
                    </td>

                    {/* Balance */}
                    <td className="p-3 font-bold text-slate-900">
                      ${node.balance.toLocaleString()} {node.currency}
                      <div className="text-[10px] font-normal text-slate-400">
                        {node.drainLatencySeconds}s drain latency
                      </div>
                    </td>

                    {/* Degree */}
                    <td className="p-3">
                      <span className="text-blue-700 font-bold">{node.inDegree} In</span> / <span className="text-amber-700 font-bold">{node.outDegree} Out</span>
                    </td>

                    {/* Betweenness Centrality */}
                    <td className="p-3">
                      <span className={`font-bold ${(node.betweennessCentrality || 0) > 0.5 ? 'text-red-700' : 'text-slate-800'}`}>
                        {(node.betweennessCentrality || 0).toFixed(2)} {(node.betweennessCentrality || 0) > 0.5 ? '(Hub)' : ''}
                      </span>
                    </td>

                    {/* Device & IP */}
                    <td className="p-3 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 font-mono">
                        <Smartphone className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[120px]">{node.deviceId}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {node.ip} ({node.country})
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            soundFx.playScanTick();
                            onSelectNode(node);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-300 transition-all"
                          title="Inspect in Interactive Graph & XAI Dossier"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (isFrozen) {
                              onUnfreezeAccount(node.id);
                            } else {
                              onFreezeAccount(node.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isFrozen 
                              ? 'bg-slate-200 text-slate-700 border-slate-300' 
                              : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                          }`}
                          title={isFrozen ? 'Release Hold' : 'Freeze Outflows'}
                        >
                          {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => onGenerateSARForNode(node)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-all"
                          title="Generate FinCEN Form 111 SAR"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
