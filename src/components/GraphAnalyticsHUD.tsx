import React from 'react';
import { 
  Network, 
  Activity, 
  Layers, 
  Share2, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Target, 
  GitCommit, 
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { Scenario, AccountNode } from '../types';

interface GraphAnalyticsHUDProps {
  scenario: Scenario;
  selectedNode: AccountNode | null;
}

export const GraphAnalyticsHUD: React.FC<GraphAnalyticsHUDProps> = ({
  scenario,
  selectedNode
}) => {
  const gm = scenario.graphMetrics;

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Graph Network Analytics &amp; Topology Metrics
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Graph Theory Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Quantitative structural metrics computed via Brandes Centrality, PageRank, and Louvain Modularity algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-blue-700" />
            <span>Inference Time: <strong className="text-blue-900">{gm.inferenceLatencyMs} ms</strong></span>
          </div>
        </div>
      </div>

      {/* Global Graph Topological Metrics 6-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        
        {/* Metric 1: Graph Density */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Graph Density (ρ)</div>
          <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">
            {gm.graphDensity.toFixed(3)}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            |E| / (|V|*(|V|-1))
          </div>
        </div>

        {/* Metric 2: Average Degree */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Average Node Degree (⟨k⟩)</div>
          <div className="text-lg font-bold font-mono text-blue-900 mt-0.5">
            {gm.avgDegree.toFixed(2)} edges/node
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Degree distribution
          </div>
        </div>

        {/* Metric 3: Clustering Coefficient */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Clustering Coeff (C)</div>
          <div className="text-lg font-bold font-mono text-amber-800 mt-0.5">
            {gm.clusteringCoefficient.toFixed(2)}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Triadic closure ratio
          </div>
        </div>

        {/* Metric 4: Louvain Modularity */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Louvain Modularity (Q)</div>
          <div className="text-lg font-bold font-mono text-purple-900 mt-0.5">
            {gm.louvainModularity.toFixed(2)}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Community isolation
          </div>
        </div>

        {/* Metric 5: Diameter & Path Length */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Graph Diameter (D)</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {gm.diameter} Hops
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Avg Path: {gm.avgShortestPath.toFixed(1)} hops
          </div>
        </div>

        {/* Metric 6: Detected Cycle Loops */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300">
          <div className="text-[10px] font-mono text-amber-900 uppercase font-semibold">Laundering Cycles (SCC)</div>
          <div className="text-lg font-bold font-mono text-amber-950 mt-0.5">
            {gm.detectedCycleCount} Loops Detected
          </div>
          <div className="text-[9px] text-amber-800 font-mono mt-0.5 font-medium">
            Tarjan DFS traversal
          </div>
        </div>

      </div>

      {/* Selected Node Quantitative Centrality Profile */}
      {selectedNode && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-emerald-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-900">
                Selected Node Centrality Vector: <strong className="text-emerald-800">{selectedNode.name}</strong> ({selectedNode.accountNumber})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold shadow-2xs">
                {selectedNode.communityCluster}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Role: <span className="text-amber-800 font-bold uppercase">{selectedNode.role}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
            
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500">In-Degree / Out-Degree</div>
              <div className="font-bold text-slate-900 mt-0.5">
                <span className="text-blue-700">{selectedNode.inDegree} In</span> / <span className="text-amber-700">{selectedNode.outDegree} Out</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500">PageRank Vector</div>
              <div className="font-bold text-emerald-800 mt-0.5">
                {(selectedNode.pageRank * 100).toFixed(1)}% ({selectedNode.pageRank.toFixed(3)})
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500">Betweenness Centrality (g)</div>
              <div className={`font-bold mt-0.5 ${selectedNode.betweennessCentrality > 0.6 ? 'text-red-700' : 'text-slate-800'}`}>
                {selectedNode.betweennessCentrality.toFixed(2)} {selectedNode.betweennessCentrality > 0.6 ? '(Hub Node)' : ''}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500">Eigenvector Centrality (x)</div>
              <div className="font-bold text-purple-900 mt-0.5">
                {selectedNode.eigenvectorCentrality.toFixed(2)}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500">Clustering Coeff (c_i)</div>
              <div className="font-bold text-amber-800 mt-0.5">
                {selectedNode.clusteringCoefficient.toFixed(2)}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <div className="text-[9px] text-slate-500">Velocity Drain Index</div>
              <div className="font-bold text-red-700 mt-0.5">
                {selectedNode.velocityScore}/100 ({selectedNode.drainLatencySeconds}s)
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
