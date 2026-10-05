# 🛡️ AegisAML | Intelligent Anti-Money Laundering & Mule Account Detection Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

An enterprise-grade, graph-first Anti-Money Laundering (AML) and Money Mule Detection intelligence platform developed for **Major Academic Project Evaluations, Fintech Hackathons, and Enterprise Threat Intelligence**.

---

## 🌟 Key Highlights & Capabilities

- 🌐 **Interactive Graph Network Visualizer**: Force-directed multi-hop canvas with animated money-flow particle trails, cycle loop highlight, zoom/pan, and node drag-and-drop.
- 🔬 **Quantitative Graph Numbers & Centrality HUD**: Real-time computation of Graph Density ($\rho$), Brandes Betweenness Centrality, PageRank vectors, Eigenvector Centrality, and Louvain Community Modularity.
- 🧪 **Automated Graph Testing Suite (8 Test Cases)**: Test harness verifying Smurfing fan-in, Hawala cycle DFS traversal, sub-60s rapid pass-through drain, device collision clusters, and batch graph inference stress tests with live millisecond latency timers.
- 📊 **Model Benchmarks & Past System Comparison**: Direct quantitative comparison matrix comparing Temporal Graph Neural Networks against Past ML Baselines (XGBoost/Random Forest) and Legacy SQL Rule Engines, including a 7-quarter historical evolution timeline and interactive Confusion Matrix.
- 🔍 **Explainable AI (XAI) Suspect Account Inspector**: SHAP feature importance breakdown, 99.4% fund evacuation timelines, device hardware UUID clustering, and one-click account freezing actions.
- 📄 **FinCEN / FIU Regulatory SAR Generator**: Automated Form 111 Suspicious Activity Report generator with compliance narrative generation, electronic XML export, and printable dossier.
- ⚡ **Live Real-time Streaming Transaction Monitor**: Influx wire simulator with rule violation badges and one-click graph node location.
- 🎨 **Luminous Money-Themed UI/UX**: Emerald Green (`#10B981`), Mint Glow, Currency Gold (`#F59E0B`), and Platinum Glassmorphism with instant **Luminous Light** and **Tactical Cyber Dark** mode toggle.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [npm](https://www.npmjs.com/) (version 9.0 or higher)

### Installation

```bash
# 1. Clone repository or unzip project folder
git clone https://github.com/your-username/aegis-aml-mule-shield.git
cd aegis-aml-mule-shield

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🛠️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The output will be generated inside the `dist/` directory, ready to deploy to any static hosting provider.

---

## ☁️ Deployment Instructions

### Deploy to Vercel (Recommended - 1 Click)
1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

### Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com/).
2. Drag and drop the `dist/` folder or link your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy Site**.

### Deploy to GitHub Pages
1. In `vite.config.ts`, set `base: '/<repository-name>/'`.
2. Build and push `dist` branch or configure GitHub Actions workflow.

---

## 📂 Project Architecture

```
aml-mule-shield/
├── src/
│   ├── components/
│   │   ├── Header.tsx                     # Top navigation, sound FX, search, and theme switcher
│   │   ├── MetricsOverview.tsx            # Live financial KPI metrics strip
│   │   ├── ScenarioSelector.tsx           # 4 switchable AML evaluation scenarios
│   │   ├── GraphAnalyticsHUD.tsx          # Quantitative graph theory & centrality numbers
│   │   ├── GraphBenchmarkComparison.tsx   # Past vs. present benchmarks & confusion matrix
│   │   ├── GraphTestSuite.tsx             # 8-case automated graph verification harness
│   │   ├── LiveTransactions.tsx           # Real-time streaming transaction feed
│   │   ├── AccountInspector.tsx           # SHAP explainable AI & suspect account inspector
│   │   ├── MuleRingsMatrix.tsx            # Money mule syndicate topology matrix
│   │   ├── RuleSimulator.tsx              # Dynamic AML threshold calibration lab
│   │   ├── SARModal.tsx                   # FinCEN / FIU Form 111 SAR generator
│   │   ├── KnowledgeBaseModal.tsx         # AML typology handbook & viva reference
│   │   └── NetworkGraph/
│   │       └── NetworkVisualizer.tsx      # Canvas force-directed particle flow visualizer
│   ├── data/
│   │   └── mockScenarios.ts               # Scenario topologies, benchmark datasets, test cases
│   ├── types/
│   │   └── index.ts                       # Domain TypeScript interfaces and types
│   ├── utils/
│   │   └── audio.ts                       # Web Audio API sound synthesizer
│   ├── App.tsx                            # Root application component
│   ├── index.css                          # Custom styles, cyber grid, and glow utilities
│   └── main.tsx                           # Application entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚖️ License
This project is licensed under the MIT License.
