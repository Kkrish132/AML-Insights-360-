import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Check, 
  AlertTriangle, 
  Download, 
  Sparkles, 
  Network, 
  Layers, 
  ArrowRight,
  Database,
  SlidersHorizontal,
  Table,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseTransactionCSV, sampleCSVTemplates, ColumnMapping } from '../utils/csvParser';
import { Scenario } from '../types';
import { soundFx } from '../utils/audio';

interface DatasetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomScenario: (scenario: Scenario) => void;
}

export const DatasetUploadModal: React.FC<DatasetUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomScenario
}) => {
  const [csvContent, setCsvContent] = useState<string>(sampleCSVTemplates.smurfing);
  const [datasetName, setDatasetName] = useState<string>('Custom Uploaded Bank Transaction Matrix');
  const [showMapping, setShowMapping] = useState<boolean>(false);
  const [customMapping, setCustomMapping] = useState<Partial<ColumnMapping>>({});
  const [previewResult, setPreviewResult] = useState(parseTransactionCSV(sampleCSVTemplates.smurfing));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (text: string, mappingOverride?: Partial<ColumnMapping>) => {
    setCsvContent(text);
    const activeMap = mappingOverride || customMapping;
    const parsed = parseTransactionCSV(text, activeMap);
    setPreviewResult(parsed);
    if (!mappingOverride && Object.keys(customMapping).length === 0) {
      setCustomMapping(parsed.suggestedMapping);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.playScanTick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
        const parsed = parseTransactionCSV(content);
        setCustomMapping(parsed.suggestedMapping);
        setCsvContent(content);
        setPreviewResult(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (key: keyof typeof sampleCSVTemplates, name: string) => {
    soundFx.playScanTick();
    setDatasetName(name);
    setCustomMapping({});
    handleTextChange(sampleCSVTemplates[key], {});
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    const updated = { ...customMapping, [field]: value };
    setCustomMapping(updated);
    handleTextChange(csvContent, updated);
  };

  const handleGenerateGraph = () => {
    if (previewResult.nodes.length === 0 || previewResult.links.length === 0) {
      soundFx.playAlert();
      return;
    }

    soundFx.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#0284c7', '#d97706']
    });

    const totalVolume = previewResult.links.reduce((acc, l) => acc + l.amount, 0);
    const flaggedVolume = previewResult.links.filter(l => l.riskLevel === 'CRITICAL' || l.riskLevel === 'HIGH').reduce((acc, l) => acc + l.amount, 0);
    const suspiciousCount = previewResult.nodes.filter(n => n.riskScore > 75).length;

    const customScenario: Scenario = {
      id: `custom-dataset-${Date.now()}`,
      title: datasetName,
      subtitle: `Custom Ingested Feed (${previewResult.nodes.length} Accounts / ${previewResult.links.length} Transfers)`,
      badge: 'Uploaded Dataset',
      difficulty: 'High Velocity',
      description: `Dynamically generated graph network parsed from user-uploaded CSV dataset. Contains ${previewResult.totalRows.toLocaleString()} transaction records with multi-parameter account profiling.`,
      summary: {
        totalVolume,
        flaggedVolume: flaggedVolume || totalVolume,
        suspiciousAccounts: suspiciousCount || previewResult.nodes.length,
        avgDrainTime: `${previewResult.nodes[0]?.drainLatencySeconds || 32} seconds`,
        criticalRings: previewResult.metrics.detectedCycleCount > 0 ? 2 : 1
      },
      graphMetrics: previewResult.metrics,
      muleRings: [
        {
          id: 'RING-DATASET-01',
          name: `${datasetName} Core Syndicate`,
          typology: 'Dynamic Graph Cluster Flow Pattern',
          totalLaundered: flaggedVolume || totalVolume,
          nodeCount: previewResult.nodes.length,
          ringRiskScore: 95,
          status: 'ACTIVE_SYNDICATE',
          keyOrganizerId: previewResult.nodes.find(n => n.role === 'collector')?.id || previewResult.nodes[0]?.id || 'node-1',
          funnelAccountId: previewResult.nodes.find(n => n.role === 'collector')?.id || previewResult.nodes[0]?.id || 'node-1',
          description: 'Dynamically clustered mule syndicate extracted from uploaded transaction matrix.',
          sarFiled: false,
          graphDensity: previewResult.metrics.graphDensity,
          modularityScore: previewResult.metrics.louvainModularity
        }
      ],
      nodes: previewResult.nodes,
      links: previewResult.links
    };

    onApplyCustomScenario(customScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-300 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-2xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                  Bank Transaction Dataset &amp; CSV Parser
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold">
                  Large Dataset Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Upload your CSV file (PaySim, IBM AML, Bank Statements) to extract Account Holder Names, Balances, and Graph Centralities.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playScanTick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
          
          {/* Preset Sample Templates Quick Load */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Preloaded Bank Datasets &amp; Academic Schemas:
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLoadSample('smurfing', 'Student Mule Smurfing Ring')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-300 text-slate-800 text-[11px] font-semibold transition-all shadow-2xs"
              >
                🎓 Student Smurfing (9 Rows)
              </button>

              <button
                onClick={() => handleLoadSample('paysim_kaggle', 'Kaggle PaySim Banking Fraud Format')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-300 text-slate-800 text-[11px] font-semibold transition-all shadow-2xs"
              >
                📊 Kaggle PaySim Schema
              </button>

              <button
                onClick={() => handleLoadSample('circular_hawala', 'Hawala Circular Shell Ring')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-300 text-slate-800 text-[11px] font-semibold transition-all shadow-2xs"
              >
                🔄 Circular Hawala (Cycle Loop)
              </button>

              <button
                onClick={() => handleLoadSample('crypto_layering', 'Crypto P2P Layering & Mixer')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 border border-slate-300 text-slate-800 text-[11px] font-semibold transition-all shadow-2xs"
              >
                🪙 Crypto Layering &amp; DEX
              </button>
            </div>
          </div>

          {/* Dataset Title & File Upload Button */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                Dataset / Investigation Title:
              </label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 font-mono text-xs shadow-inner font-semibold"
                placeholder="e.g. My Bank Transaction Ledger"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                Upload CSV File:
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <UploadCloud className="w-4 h-4 text-emerald-700" />
                <span>Select .CSV File</span>
              </button>
            </div>
          </div>

          {/* Column Mapping Selector (Collapsible) */}
          {previewResult.detectedHeaders.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700" /> Auto-Detected CSV Columns &amp; Field Mapping
                </span>
                <button
                  onClick={() => setShowMapping(!showMapping)}
                  className="text-[10px] font-bold text-emerald-800 hover:underline"
                >
                  {showMapping ? 'Hide Column Mapping' : 'Customize Column Mapping'}
                </button>
              </div>

              {showMapping && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1 font-semibold">Source Account (ID):</label>
                    <select
                      value={customMapping.sourceAccount || ''}
                      onChange={(e) => handleMappingChange('sourceAccount', e.target.value)}
                      className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-800 text-[11px]"
                    >
                      {previewResult.detectedHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1 font-semibold">Target Account (ID):</label>
                    <select
                      value={customMapping.targetAccount || ''}
                      onChange={(e) => handleMappingChange('targetAccount', e.target.value)}
                      className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-800 text-[11px]"
                    >
                      {previewResult.detectedHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1 font-semibold">Amount ($):</label>
                    <select
                      value={customMapping.amount || ''}
                      onChange={(e) => handleMappingChange('amount', e.target.value)}
                      className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-800 text-[11px]"
                    >
                      {previewResult.detectedHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase block mb-1 font-semibold">Account Holder Name (Optional):</label>
                    <select
                      value={customMapping.sourceName || ''}
                      onChange={(e) => handleMappingChange('sourceName', e.target.value)}
                      className="w-full p-1.5 rounded bg-white border border-slate-300 text-slate-800 text-[11px]"
                    >
                      <option value="">(Auto-generate)</option>
                      {previewResult.detectedHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Raw CSV Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">
                Transaction Data Matrix (CSV Content):
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {previewResult.totalRows.toLocaleString()} Rows Detected
              </span>
            </div>
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-emerald-600 leading-relaxed shadow-inner"
              placeholder="Paste comma-separated transaction records here..."
            />
          </div>

          {/* Real-Time Extraction Preview Grid */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-emerald-700" /> Extracted Account Parameters &amp; Topology Summary:
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                previewResult.errors.length === 0 
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' 
                  : 'bg-red-100 text-red-950 border border-red-300'
              }`}>
                {previewResult.errors.length === 0 ? '✓ VALID DATASET' : '⚠ SCHEMA ERROR'}
              </span>
            </div>

            {previewResult.errors.length > 0 ? (
              <div className="text-[11px] text-red-700 space-y-1">
                {previewResult.errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[10px] block font-semibold">Extracted Accounts</span>
                  <span className="font-bold text-slate-900 text-sm">{previewResult.nodes.length} Accounts</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[10px] block font-semibold">Total Transfers</span>
                  <span className="font-bold text-blue-900 text-sm">{previewResult.links.length} Transfers</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[10px] block font-semibold">Graph Density (ρ)</span>
                  <span className="font-bold text-amber-900 text-sm">{previewResult.metrics.graphDensity}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[10px] block font-semibold">Detected Cycles</span>
                  <span className="font-bold text-emerald-800 text-sm">{previewResult.metrics.detectedCycleCount} Loops</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] font-mono text-slate-500">
            Auto-calculates Balances, Turnover Velocity, PageRank vectors, and XAI factors
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playScanTick();
                onClose();
              }}
              className="px-3 py-2 text-xs font-mono font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 shadow-2xs transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerateGraph}
              disabled={previewResult.nodes.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Network className="w-4 h-4" />
              <span>Generate Bank Graph &amp; Analyze</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
