import React from 'react';
import { 
  FolderGit2, 
  GraduationCap, 
  Coins, 
  RotateCw, 
  Clock, 
  Check, 
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Scenario } from '../types';
import { mockScenarios } from '../data/mockScenarios';
import { soundFx } from '../utils/audio';

interface ScenarioSelectorProps {
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  onSelectScenario
}) => {
  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'student-job-scam':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'crypto-p2p-smurfing':
        return <Coins className="w-4 h-4 text-amber-400" />;
      case 'hawala-circular-shell':
        return <RotateCw className="w-4 h-4 text-cyan-400" />;
      case 'dormant-account-burst':
        return <Clock className="w-4 h-4 text-purple-400" />;
      default:
        return <FolderGit2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleSelect = (scenario: Scenario) => {
    soundFx.playScanTick();
    onSelectScenario(scenario);
  };

  return (
    <div className="glass-panel rounded-xl p-3 mb-4 border border-emerald-500/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Evaluation Scenario Matrix
              </h2>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Graph & AI Reactivity
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Select an AML topology scenario to inspect graph topologies, mule archetypes, and fraud flows.
            </p>
          </div>
        </div>

        {/* Scenario Pill Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2">
          {mockScenarios.map((sc) => {
            const isSelected = sc.id === currentScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelect(sc)}
                className={`flex items-center justify-between lg:justify-start gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-glow-sm font-semibold'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-950/60 border border-slate-800">
                    {getScenarioIcon(sc.id)}
                  </div>
                  <div>
                    <div className="text-[11px] font-mono leading-tight">{sc.title}</div>
                    <div className="text-[9px] text-slate-400 line-clamp-1">{sc.badge}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px] ml-1">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
