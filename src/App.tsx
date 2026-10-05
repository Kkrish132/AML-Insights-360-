import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Activity, 
  Sliders, 
  ShieldAlert, 
  Layers, 
  FileText, 
  BookOpen, 
  Sparkles,
  Info,
  CheckCircle,
  AlertOctagon,
  TrendingUp,
  Cpu,
  BarChart3,
  Terminal,
  Share2,
  UploadCloud,
  PlusCircle,
  Download,
  Table
} from 'lucide-react';
import { Header } from './components/Header';
import { BankSidebar } from './components/BankSidebar';
import { MetricsOverview } from './components/MetricsOverview';
import { NetworkVisualizer } from './components/NetworkGraph/NetworkVisualizer';
import { AccountInspector } from './components/AccountInspector';
import { DatasetTableView } from './components/DatasetTableView';
import { LiveTransactions } from './components/LiveTransactions';
import { MuleRingsMatrix } from './components/MuleRingsMatrix';
import { RuleSimulator } from './components/RuleSimulator';
import { GraphAnalyticsHUD } from './components/GraphAnalyticsHUD';
import { GraphBenchmarkComparison } from './components/GraphBenchmarkComparison';
import { GraphTestSuite } from './components/GraphTestSuite';
import { DatasetUploadModal } from './components/DatasetUploadModal';
import { CustomGraphEditorModal } from './components/CustomGraphEditorModal';
import { SARModal } from './components/SARModal';
import { KnowledgeBaseModal } from './components/KnowledgeBaseModal';
import { mockScenarios } from './data/mockScenarios';
import { Scenario, AccountNode, UserProfile } from './types';
import { soundFx } from './utils/audio';
import { AuthScreen } from './components/Auth/AuthScreen';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Auth State — reads saved session from localStorage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('aegis_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('aegis_user_session');
    setCurrentUser(null);
  };

  const [currentScenario, setCurrentScenario] = useState<Scenario>(mockScenarios[0]);
  const [selectedNode, setSelectedNode] = useState<AccountNode | null>(
    mockScenarios[0].nodes.find(n => n.role === 'mule_account') || mockScenarios[0].nodes[0]
  );
  const [frozenAccountIds, setFrozenAccountIds] = useState<string[]>([]);
  const [isSARModalOpen, setIsSARModalOpen] = useState<boolean>(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMainTab, setActiveMainTab] = useState<'COMMAND' | 'DATASET_TABLE' | 'ANALYTICS' | 'TEST_SUITE' | 'BENCHMARKS' | 'TRANSACTIONS' | 'RINGS' | 'SIMULATOR'>('COMMAND');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  // Sync html class for dark/light theme (defaults to clean light banking theme)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  const showToast = (text: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Switch scenario
  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    const firstCritical = scenario.nodes.find(n => n.riskScore > 90) || scenario.nodes[0];
    setSelectedNode(firstCritical);
    showToast(`Case File Loaded: ${scenario.title}`, 'success');
  };

  // Custom Dataset Upload Handler
  const handleApplyCustomScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setSelectedNode(scenario.nodes[0] || null);
    setActiveMainTab('COMMAND');
    showToast(`✓ Custom Dataset Loaded: ${scenario.nodes.length} Nodes & ${scenario.links.length} Transfers`, 'success');
  };

  // Update Graph from Node/Edge Editor
  const handleUpdateScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    showToast(`✓ Graph Topology Updated (${scenario.nodes.length} Nodes)`, 'success');
  };

  // Export JSON
  const handleExportJSON = () => {
    soundFx.playScanTick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentScenario, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `apex_bank_graph_${currentScenario.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`✓ Exported scenario "${currentScenario.title}" to JSON`, 'success');
  };

  // Node Selection Handlers
  const handleSelectNode = (node: AccountNode) => {
    setSelectedNode(node);
  };

  const handleSelectNodeFromTable = (node: AccountNode) => {
    setSelectedNode(node);
    setActiveMainTab('COMMAND');
    showToast(`Inspecting: ${node.name} (${node.accountNumber})`, 'success');
  };

  const handleSelectNodeById = (nodeId: string) => {
    const node = currentScenario.nodes.find(n => n.id === nodeId);
    if (node) {
      soundFx.playAlert();
      setSelectedNode(node);
      setActiveMainTab('COMMAND');
      showToast(`Selected Account: ${node.name} (${node.accountNumber})`, 'success');
    }
  };

  // Account Freeze / Unfreeze
  const handleFreezeAccount = (nodeId: string) => {
    if (!frozenAccountIds.includes(nodeId)) {
      setFrozenAccountIds(prev => [...prev, nodeId]);
      const node = currentScenario.nodes.find(n => n.id === nodeId);
      showToast(`⛔ Account ${node?.name || nodeId} FROZEN (Hold Placed).`, 'alert');
    }
  };

  const handleUnfreezeAccount = (nodeId: string) => {
    setFrozenAccountIds(prev => prev.filter(id => id !== nodeId));
    const node = currentScenario.nodes.find(n => n.id === nodeId);
    showToast(`✓ Account ${node?.name || nodeId} Hold Released.`, 'success');
  };

  const handleGenerateSARForNode = (node: AccountNode) => {
    soundFx.playScanTick();
    setSelectedNode(node);
    setIsSARModalOpen(true);
  };

  // Global Search Filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) return;
    const q = query.toLowerCase();
    const match = currentScenario.nodes.find(n => 
      n.name.toLowerCase().includes(q) ||
      n.accountNumber.toLowerCase().includes(q) ||
      n.bank.toLowerCase().includes(q) ||
      n.ip.toLowerCase().includes(q) ||
      n.deviceId.toLowerCase().includes(q)
    );
    if (match) {
      setSelectedNode(match);
      soundFx.playAlert();
    }
  };

  // ── Auth Gate ──────────────────────────────────────────────
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans transition-colors duration-200">
      
      {/* 1. Left Bank Navigation Sidebar */}
      <BankSidebar
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenSAR={() => setIsSARModalOpen(true)}
          onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenEditorModal={() => setIsEditorModalOpen(true)}
          onExportJSON={handleExportJSON}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />

        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="fixed top-14 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold shadow-xl backdrop-blur-md ${
              toastMessage.type === 'alert'
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              {toastMessage.type === 'alert' ? <AlertOctagon className="w-4 h-4 text-red-700" /> : <CheckCircle className="w-4 h-4 text-emerald-700" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Workspace Canvas Container */}
        <main className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
          
          {/* Top 4 Sleek Banking KPI Cards */}
          <MetricsOverview
            currentScenario={currentScenario}
            frozenAccountsCount={frozenAccountIds.length}
          />

          {/* Module 1: Investigator Workbench (Primary Workspace) */}
          {activeMainTab === 'COMMAND' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left 7/8 Columns: High-Tech Interactive Canvas */}
              <div className="lg:col-span-7 xl:col-span-8">
                <NetworkVisualizer
                  scenario={currentScenario}
                  selectedNode={selectedNode}
                  onSelectNode={handleSelectNode}
                  frozenAccountIds={frozenAccountIds}
                />
              </div>

              {/* Right 5/4 Columns: Bank Account Profile & XAI Inspector */}
              <div className="lg:col-span-5 xl:col-span-4">
                <AccountInspector
                  selectedNode={selectedNode}
                  scenario={currentScenario}
                  onFreezeAccount={handleFreezeAccount}
                  onUnfreezeAccount={handleUnfreezeAccount}
                  onGenerateSARForNode={handleGenerateSARForNode}
                  isFrozen={selectedNode ? frozenAccountIds.includes(selectedNode.id) : false}
                />
              </div>
            </div>
          )}

          {/* Module 2: Dataset Accounts Table View */}
          {activeMainTab === 'DATASET_TABLE' && (
            <DatasetTableView
              scenario={currentScenario}
              selectedNode={selectedNode}
              onSelectNode={handleSelectNodeFromTable}
              onFreezeAccount={handleFreezeAccount}
              onUnfreezeAccount={handleUnfreezeAccount}
              onGenerateSARForNode={handleGenerateSARForNode}
              frozenAccountIds={frozenAccountIds}
            />
          )}

          {/* Module 3: Graph Topology Analytics & Centrality HUD */}
          {activeMainTab === 'ANALYTICS' && (
            <GraphAnalyticsHUD
              scenario={currentScenario}
              selectedNode={selectedNode}
            />
          )}

          {/* Module 4: Graph Automated Testing Suite */}
          {activeMainTab === 'TEST_SUITE' && (
            <GraphTestSuite />
          )}

          {/* Module 5: Performance & Benchmarks vs Past ML */}
          {activeMainTab === 'BENCHMARKS' && (
            <GraphBenchmarkComparison />
          )}

          {/* Module 6: Live Streaming Transactions */}
          {activeMainTab === 'TRANSACTIONS' && (
            <LiveTransactions
              scenario={currentScenario}
              onSelectNodeById={handleSelectNodeById}
            />
          )}

          {/* Module 7: Mule Syndicates & Rings Matrix */}
          {activeMainTab === 'RINGS' && (
            <MuleRingsMatrix
              scenario={currentScenario}
              onOpenSAR={() => setIsSARModalOpen(true)}
              onSelectNodeById={handleSelectNodeById}
            />
          )}

          {/* Module 8: AML Policy & Rule Simulator */}
          {activeMainTab === 'SIMULATOR' && (
            <RuleSimulator />
          )}

        </main>

        {/* Bank Footer */}
        <footer className="border-t border-slate-200 py-3 px-6 text-xs text-slate-500 font-mono bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-slate-800">Apex Commercial Bank</span> • AML Mule Account Surveillance Intelligence Platform
          </div>
          <div className="text-[11px] text-slate-400">
            Enterprise Banking Tier • Confidential Regulatory Sandbox
          </div>
        </footer>

      </div>

      {/* Dataset CSV / JSON Upload Modal */}
      <DatasetUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onApplyCustomScenario={handleApplyCustomScenario}
      />

      {/* Custom Graph Node & Edge Editor Modal */}
      <CustomGraphEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        scenario={currentScenario}
        onUpdateScenario={handleUpdateScenario}
      />

      {/* Regulatory FinCEN SAR Modal */}
      <SARModal
        isOpen={isSARModalOpen}
        onClose={() => setIsSARModalOpen(false)}
        scenario={currentScenario}
        selectedNode={selectedNode}
      />

      {/* AML Typology & Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
      />

    </div>
  );
}

export default App;
