import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  FileText, 
  BookOpen, 
  Cpu,
  Layers,
  Sparkles,
  UploadCloud,
  PlusCircle,
  Download,
  Building2
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSAR: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenUploadModal: () => void;
  onOpenEditorModal: () => void;
  onExportJSON: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenSAR,
  onOpenKnowledgeBase,
  onOpenUploadModal,
  onOpenEditorModal,
  onExportJSON,
  onSearch,
  searchQuery
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playScanTick();
    }
  };

  const handleToggleTheme = () => {
    soundFx.playScanTick();
    setDarkMode(!darkMode);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 lg:px-6 py-2.5 transition-colors duration-200 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Global Node & Transaction Search */}
        <div className="w-full md:w-96 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search account no, holder name, IP, device..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs font-mono rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearch('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          
          {/* CSV / Dataset Uploader Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenUploadModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-xs"
            title="Upload CSV / JSON Dataset to Generate Custom Graph"
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
            <span>Upload CSV</span>
          </button>

          {/* Add Node/Edge Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenEditorModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:text-blue-900 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all shadow-xs"
            title="Add Custom Node or Transfer Path"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
            <span>+ Edit Graph</span>
          </button>

          {/* Export JSON Button */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onExportJSON();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-xs"
            title="Export Current Graph Scenario as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          {/* Quick SAR Generator Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenSAR();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 shadow-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>File FinCEN SAR</span>
          </button>

          {/* Typology Knowledge Base */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenKnowledgeBase();
            }}
            className="p-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 transition-all shadow-xs"
            title="AML Typology Handbook"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border transition-all shadow-xs ${
              isMuted 
                ? 'border-slate-300 text-slate-400 bg-slate-50' 
                : 'border-emerald-300 text-emerald-800 bg-emerald-50'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle (Luminous Light / Cyber Dark) */}
          <button
            onClick={handleToggleTheme}
            className="p-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all shadow-xs"
            title={darkMode ? 'Switch to Light Banking Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
