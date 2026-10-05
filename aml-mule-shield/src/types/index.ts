export type RiskTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'UNDER_REVIEW' | 'SAR_FILED';

export type AccountRole = 
  | 'origin_fund' 
  | 'smurf_sender' 
  | 'mule_account' 
  | 'collector' 
  | 'layering_hub' 
  | 'crypto_offramp' 
  | 'shell_company' 
  | 'legit_customer';

export type MuleType = 
  | 'Complicit Mule' 
  | 'Deceived (Job/Romance Scam)' 
  | 'Stolen Identity' 
  | 'Master Organizer' 
  | 'Shell Entity' 
  | 'None';

export interface ShapFactor {
  feature: string;
  impact: number; // positive = pushes risk higher, negative = lowers risk
  description: string;
}

export interface AccountNode {
  id: string;
  accountNumber: string;
  name: string;
  role: AccountRole;
  muleType: MuleType;
  riskScore: number; // 0 - 100
  riskTier: RiskTier;
  status: AccountStatus;
  balance: number;
  currency: string;
  bank: string;
  country: string;
  ip: string;
  deviceId: string;
  velocityScore: number;
  drainLatencySeconds: number; // e.g. 38s
  inflowOutflowRatio: number;
  dormantDaysPriorToBurst: number;
  kycTier: 'TIER_1_BASIC' | 'TIER_2_VERIFIED' | 'TIER_3_ENHANCED';
  shapFactors: ShapFactor[];
  ringId?: string;
  
  // Graph Network Metrics
  inDegree: number;
  outDegree: number;
  pageRank: number;
  betweennessCentrality: number;
  eigenvectorCentrality: number;
  clusteringCoefficient: number;
  communityCluster: string;

  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export type TransactionType = 'WIRE' | 'CRYPTO_P2P' | 'FASTER_PAYMENT' | 'ACH' | 'ATM_BURST' | 'CARD_SPLIT';

export interface TransactionLink {
  id: string;
  source: string; // AccountNode id
  target: string; // AccountNode id
  amount: number;
  currency: string;
  timestamp: string;
  type: TransactionType;
  flags: string[];
  riskLevel: RiskTier;
  latencySecs: number;
  isCyclePart?: boolean;
}

export interface MuleRing {
  id: string;
  name: string;
  typology: string;
  totalLaundered: number;
  nodeCount: number;
  ringRiskScore: number;
  status: 'ACTIVE_SYNDICATE' | 'INTERCEPTED' | 'MONITORED';
  keyOrganizerId: string;
  funnelAccountId: string;
  description: string;
  sarFiled: boolean;
  graphDensity: number;
  modularityScore: number;
}

export interface GraphTopologyMetrics {
  totalNodes: number;
  totalEdges: number;
  graphDensity: number;
  avgDegree: number;
  diameter: number;
  avgShortestPath: number;
  clusteringCoefficient: number;
  louvainModularity: number;
  stronglyConnectedComponents: number;
  detectedCycleCount: number;
  inferenceLatencyMs: number;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  difficulty: 'Sophisticated' | 'Moderate' | 'High Velocity';
  nodes: AccountNode[];
  links: TransactionLink[];
  muleRings: MuleRing[];
  graphMetrics: GraphTopologyMetrics;
  summary: {
    totalVolume: number;
    flaggedVolume: number;
    suspiciousAccounts: number;
    avgDrainTime: string;
    criticalRings: number;
  };
}

export interface SARData {
  reportId: string;
  generatedAt: string;
  filingInstitution: string;
  primarySubject: AccountNode;
  linkedMules: AccountNode[];
  totalSuspiciousAmount: number;
  narrative: string;
  typologyTags: string[];
  recommendedActions: string[];
}

export interface TypologyRule {
  id: string;
  name: string;
  category: 'Velocity' | 'Structuring' | 'Device Cluster' | 'Dormancy Burst';
  description: string;
  paramKey: string;
  currentValue: number;
  defaultValue: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  active: boolean;
}

// Graph Benchmark & Comparison Types
export interface ModelBenchmark {
  modelName: string;
  tag: string;
  type: 'CURRENT_GNN' | 'PAST_ML_BASELINE' | 'LEGACY_RULE_BASED';
  f1Score: number;
  precision: number;
  recall: number;
  aucRoc: number;
  falsePositiveRate: number;
  detectionLatency: string;
  latencyMs: number;
  muleInterceptionRate: number;
  graphCycleDetectionRate: number;
  capitalLossPrevented: number;
  falseAlertsCostPerMonth: number;
}

export interface HistoricalQuarterComparison {
  quarter: string;
  systemType: string;
  falsePositiveRate: number;
  detectionTimeSeconds: number;
  mulesIdentified: number;
  preventedLossUSD: number;
  f1Score: number;
}

// Graph Automated Test Types
export interface GraphTestCase {
  id: string;
  name: string;
  category: 'Topological' | 'Velocity' | 'Device Cluster' | 'Cycle Loop' | 'CTR Threshold';
  targetScenario: string;
  description: string;
  assertion: string;
  expectedResult: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  executionTimeMs: number;
  nodesEvaluated: number;
  edgesTraversed: number;
  details: string;
}

// User Authentication & Session Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Senior AML Officer (L3)' | 'Compliance Director' | 'Fintech Risk Analyst' | 'Guest Investigator';
  badgeNumber: string;
  avatar?: string;
  department: string;
  loginMethod: 'EMAIL' | 'GOOGLE' | 'DEMO';
  lastLogin: string;
}
