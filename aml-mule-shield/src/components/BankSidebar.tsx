import React from 'react';
import { 
  ShieldAlert, 
  Network, 
  Activity, 
  Sliders, 
  Layers, 
  BarChart3, 
  Terminal, 
  FolderGit2, 
  Check, 
  UserCheck, 
  ChevronRight, 
  Sparkles,
  Building2,
  Table,
  Database,
  LogOut,
  User
} from 'lucide-react';
import { Scenario, UserProfile } from '../types';
import { mockScenarios } from '../data/mockScenarios';
import { soundFx } from '../utils/audio';

interface BankSidebarProps {
  activeTab: 'COMMAND' | 'DATASET_TABLE' | 'ANALYTICS' | 'TEST_SUITE' | 'BENCHMARKS' | 'TRANSACTIONS' | 'RINGS' | 'SIMULATOR';
  setActiveTab: (tab: 'COMMAND' | 'DATASET_TABLE' | 'ANALYTICS' | 'TEST_SUITE' | 'BENCHMARKS' | 'TRANSACTIONS' | 'RINGS' | 'SIMULATOR') => void;
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  currentUser?: UserProfile | null;
  onLogout: () => void;
}

export const BankSidebar: React.FC<BankSidebarProps> = ({
  activeTab,
  setActiveTab,
  currentScenario,
  onSelectScenario,
  currentUser,
  onLogout
}) => {
  const navItems: Array<{
    id: 'COMMAND' | 'DATASET_TABLE' | 'ANALYTICS' | 'TEST_SUITE' | 'BENCHMARKS' | 'TRANSACTIONS' | 'RINGS' | 'SIMULATOR';
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'COMMAND', label: 'Investigator Workbench', icon: Network, badge: 'Live' },
    { id: 'DATASET_TABLE', label: 'Dataset Accounts Table', icon: Table, badge: `${currentScenario.nodes.length}` },
    { id: 'ANALYTICS', label: 'Graph Topology Metrics', icon: BarChart3 },
    { id: 'TEST_SUITE', label: 'Automated Test Suite', icon: Terminal, badge: '8/8' },
    { id: 'BENCHMARKS', label: 'Past vs Present ML', icon: Activity },
    { id: 'TRANSACTIONS', label: 'Live Transaction Stream', icon: Activity },
    { id: 'RINGS', label: 'Mule Syndicates & Rings', icon: Layers, badge: `${currentScenario.muleRings.length}` },
    { id: 'SIMULATOR', label: 'AML Rule Simulator', icon: Sliders },
  ];

  const userInitials = currentUser?.name 
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'MS';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      
      <div>
        {/* Bank Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Apex Commercial
              </h1>
            </div>
            <p className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> AML Mule Shield AI
            </p>
          </div>
        </div>

        {/* Scenario / Investigation Case Selector Dropdown */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/80">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">
            Active AML Case / Dataset:
          </label>
          <div className="relative">
            <select
              value={currentScenario.id}
              onChange={(e) => {
                const sc = mockScenarios.find(s => s.id === e.target.value);
                if (sc) {
                  soundFx.playScanTick();
                  onSelectScenario(sc);
                }
              }}
              className="w-full text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-800 p-2 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 shadow-sm cursor-pointer"
            >
              {mockScenarios.map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.title} ({sc.badge})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 font-mono">
            Surveillance Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playScanTick();
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Officer Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Magan S.'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                {currentUser?.role || 'Senior AML Officer (L3)'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playScanTick();
              onLogout();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
            title="Sign Out / Lock Terminal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Badge: <strong className="text-slate-700">{currentUser?.badgeNumber || 'AML-CHIEF'}</strong></span>
          <span className="text-emerald-700 font-bold">● Active Session</span>
        </div>
      </div>

    </aside>
  );
};
