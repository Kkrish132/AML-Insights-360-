import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building, 
  Copy, 
  Check, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Scenario, AccountNode } from '../types';
import { soundFx } from '../utils/audio';

interface SARModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  selectedNode: AccountNode | null;
}

export const SARModal: React.FC<SARModalProps> = ({
  isOpen,
  onClose,
  scenario,
  selectedNode
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'NARRATIVE' | 'XML_EXPORT' | 'REGULATORY_GRID'>('NARRATIVE');

  if (!isOpen) return null;

  const targetNode = selectedNode || scenario.nodes.find(n => n.riskScore > 90) || scenario.nodes[0];
  const filingId = `SAR-FINCEN-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const narrativeText = `SUSPICIOUS ACTIVITY REPORT (SAR) - FORM 111 COMPLIANCE DOSSIER
FILING INSTITUTION: Apex Commercial Bank N.A. (FDIC #49201)
FILING IDENTIFIER: ${filingId}
DATE OF FILING: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
PRIMARY TYPOLOGY CLASSIFICATION: ${targetNode.muleType} / Layered Rapid Pass-Through

SUBJECT IDENTITY & ACCOUNT INFORMATION:
- Primary Subject Name: ${targetNode.name}
- Account Identifier: ${targetNode.accountNumber} (${targetNode.bank}, ${targetNode.country})
- KYC Verification Status: ${targetNode.kycTier}
- Device Hardware Fingerprint: ${targetNode.deviceId}
- Origin IP Geolocation: ${targetNode.ip} (${targetNode.country})

FINANCIAL TRANSACTION PATTERN & GRAPH METRICS:
Between active monitoring windows, subject account displayed extreme velocity structuring with immediate outbound evacuation. 
Total Scenario Volume Tracked: $${scenario.summary.totalVolume.toLocaleString()} USD
Pass-Through Drain Latency: ${targetNode.drainLatencySeconds} seconds
Inflow-to-Outflow Ratio: ${(targetNode.inflowOutflowRatio * 100).toFixed(1)}% evacuation rate
Betweenness Centrality: ${targetNode.betweennessCentrality.toFixed(2)} (High Network Hub Score)

EXPLAINABLE AI RISK ASSESSMENT:
The AegisAML Graph Neural Network flagged subject account with a composite risk index of ${targetNode.riskScore}/100.
Key Diagnostic Features:
1. Rapid Turnover Velocity (+45 pts)
2. Fan-In Structuring Anomalies (+35 pts)
3. Subnet / Hardware Device Sharing (+20 pts)

INVESTIGATOR CONCLUSION & RECOMMENDATION:
Apex Commercial Bank Compliance Division has instituted an immediate restriction on all debit and wire transfer capabilities for Account ${targetNode.accountNumber}. Full transactional graph ledgers and hardware UUID correlation maps are preserved for regulatory submission to the Financial Crimes Enforcement Network (FinCEN) and relevant law enforcement task forces.`;

  const handleCopy = () => {
    soundFx.playScanTick();
    navigator.clipboard.writeText(narrativeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    soundFx.playScanTick();
    const blob = new Blob([narrativeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filingId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-300 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-slate-900 uppercase tracking-wider">
                  FinCEN / FIU Form 111 Regulatory SAR Dossier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-bold">
                  BSA Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Official Suspicious Activity Report with Graph Neural Net Forensic Narrative
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50/50 text-xs font-mono">
          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('NARRATIVE');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all ${
              activeTab === 'NARRATIVE'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Legal SAR Narrative
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('XML_EXPORT');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all ${
              activeTab === 'XML_EXPORT'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            FinCEN Electronic XML Spec
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('REGULATORY_GRID');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all ${
              activeTab === 'REGULATORY_GRID'
                ? 'border-blue-600 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Subject Vitals Summary
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
          {activeTab === 'NARRATIVE' && (
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed text-[11px] font-mono select-all">
                {narrativeText}
              </pre>
            </div>
          )}

          {activeTab === 'XML_EXPORT' && (
            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 whitespace-pre-wrap leading-relaxed text-[10px] font-mono overflow-x-auto">
{`<?xml version="1.0" encoding="UTF-8"?>
<FinCEN_SAR_Batch xmlns="http://www.fincen.gov/sar/v2.0">
  <FilingInstitution>
    <InstitutionName>Apex Commercial Bank N.A.</InstitutionName>
    <FDIC_CertificateNumber>49201</FDIC_CertificateNumber>
    <PrimaryContact>AML Surveillance Operations</PrimaryContact>
  </FilingInstitution>
  <SuspiciousActivityInformation>
    <FilingTrackingID>${filingId}</FilingTrackingID>
    <SuspiciousAmount Currency="USD">${scenario.summary.totalVolume}</SuspiciousAmount>
    <SuspiciousActivityType Code="ML_MULE">${targetNode.muleType}</SuspiciousActivityType>
    <GraphCycleDetected>true</GraphCycleDetected>
    <PassThroughSeconds>${targetNode.drainLatencySeconds}</PassThroughSeconds>
  </SuspiciousActivityInformation>
  <SubjectParty>
    <FullName>${targetNode.name}</FullName>
    <AccountNumber>${targetNode.accountNumber}</AccountNumber>
    <FinancialInstitution>${targetNode.bank}</FinancialInstitution>
    <RiskScore Score="${targetNode.riskScore}">CRITICAL</RiskScore>
    <DeviceHardwareID>${targetNode.deviceId}</DeviceHardwareID>
    <OriginIP>${targetNode.ip}</OriginIP>
  </SubjectParty>
</FinCEN_SAR_Batch>`}
            </pre>
          )}

          {activeTab === 'REGULATORY_GRID' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Subject Name &amp; Account</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">{targetNode.name}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{targetNode.accountNumber} ({targetNode.bank})</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Mule Classification</span>
                  <div className="text-sm font-bold text-red-800 mt-1">{targetNode.muleType}</div>
                  <div className="text-xs text-slate-600 mt-0.5">Composite Risk: {targetNode.riskScore}/100</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Regulatory SAR Reason Code</span>
                <div className="text-xs text-slate-800 mt-1 leading-relaxed">
                  FinCEN Typology 314(b) - Structuring, rapid fund layering, and suspicious pass-through transactions without evident economic or business purpose.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] font-mono text-slate-500">
            Filing Status: <strong className="text-amber-900">PENDING TRANSMISSION</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 shadow-2xs transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official SAR (.txt)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
