import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  ShieldAlert, 
  Search, 
  ExternalLink, 
  Layers, 
  Zap, 
  CheckCircle2, 
  Info,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  if (!isOpen) return null;

  const typologies = [
    {
      id: 'TYP-01',
      title: 'Money Mule Account Smurfing & Fan-In Aggregation',
      summary: 'Splitting large ill-gotten funds into dozens of sub-$10,000 deposits to evade automated CTR thresholds.',
      graphIndicators: 'High in-degree on collector hub, high turnover velocity (<60s pass-through), shared hardware device UUIDs.',
      regulatoryRef: 'FinCEN Advisory FIN-2020-A003 on Cybercrime Smurfing Schemes',
      remediation: 'Immediate account hold, freezing downstream outbound wires, Filing FinCEN SAR Form 111.'
    },
    {
      id: 'TYP-02',
      title: 'Circular Hawala & Round-Trip Invoicing Loops',
      summary: 'Moving funds in a closed directed graph cycle across multiple jurisdictions to disguise the true source of capital.',
      graphIndicators: 'Strongly Connected Component (SCC) cycles of length 3-6 hops with minimal fund dissipation (<8%).',
      regulatoryRef: 'FATF Guidance on Trade-Based Money Laundering & Hawala Underground Banking',
      remediation: 'Multi-jurisdictional FIU information sharing under USA PATRIOT Act Section 314(b).'
    },
    {
      id: 'TYP-03',
      title: 'Crypto P2P Layering & Decentralized Exchange Offramps',
      summary: 'Funneling fiat currency into peer-to-peer cryptocurrency escrow accounts and privacy mixer contracts.',
      graphIndicators: 'Burst transfers to designated crypto offramp merchants followed by sudden dormancy.',
      regulatoryRef: 'FinCEN Advisory on Illicit Virtual Asset Service Providers (VASPs)',
      remediation: 'Blockchain wallet address clustering and blacklisting across integrated compliance API rails.'
    },
    {
      id: 'TYP-04',
      title: 'Dormancy Influx Burst & Synthetic Identity Fraud',
      summary: 'Aged bank accounts inactive for 1+ years suddenly receiving six-figure wire surges and immediate liquidation.',
      graphIndicators: 'Historical dormancy >360 days followed by 99% balance evacuation within 120 seconds.',
      regulatoryRef: 'Federal Reserve Guidelines on Synthetic Identity Fraud Mitigation',
      remediation: 'Automated step-up KYC authentication and temporary hold on instant outbound clearing.'
    }
  ];

  const filteredTopics = typologies.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.graphIndicators.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-300 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                  AML Typologies &amp; Mule Detection Handbook
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-emerald-800" /> Major Project Reference
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Academic &amp; Operational Guide on Money Laundering Typologies &amp; Graph Neural Diagnostics
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

        {/* Modal Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search typologies, graph indicators, FATF/FinCEN guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-inner"
            />
          </div>
        </div>

        {/* Content Split: Left list & Right Topic Details */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 font-mono text-xs">
          
          {/* Left 5 Columns: Topics List */}
          <div className="md:col-span-5 p-4 space-y-2 overflow-y-auto max-h-[500px]">
            {filteredTopics.map((topic, idx) => {
              const isSelected = selectedTopic === idx;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    soundFx.playScanTick();
                    setSelectedTopic(idx);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-emerald-800 font-bold px-1.5 py-0.5 rounded bg-white border border-emerald-200">
                      {topic.id}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 font-mono line-clamp-2">
                    {topic.title}
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Right 7 Columns: Topic Deep Dive */}
          <div className="md:col-span-7 p-6 space-y-4 bg-slate-50/50 overflow-y-auto max-h-[500px]">
            {filteredTopics[selectedTopic] && (
              <>
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                    {filteredTopics[selectedTopic].id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 font-mono mt-1.5 leading-snug">
                    {filteredTopics[selectedTopic].title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {filteredTopics[selectedTopic].summary}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-600" /> Graph Neural Network Signatures:
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    {filteredTopics[selectedTopic].graphIndicators}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-blue-600" /> Regulatory &amp; Compliance Authority:
                  </div>
                  <p className="text-xs text-blue-900 leading-relaxed font-semibold">
                    {filteredTopics[selectedTopic].regulatoryRef}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                  <div className="text-[10px] text-emerald-900 uppercase font-bold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Standard Banking Protocol:
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {filteredTopics[selectedTopic].remediation}
                  </p>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>FATF &amp; FinCEN Typology Guide for Academic &amp; Viva Evaluations</span>
          <button
            onClick={() => {
              soundFx.playScanTick();
              onClose();
            }}
            className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 font-semibold shadow-2xs"
          >
            Close Handbook
          </button>
        </div>

      </div>
    </div>
  );
};
