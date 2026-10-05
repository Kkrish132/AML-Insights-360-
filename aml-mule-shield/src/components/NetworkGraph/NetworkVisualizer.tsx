import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Filter, 
  Eye, 
  Maximize2, 
  Minimize2,
  Zap,
  ShieldAlert,
  AlertTriangle,
  Info,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { AccountNode, TransactionLink, Scenario } from '../../types';
import { soundFx } from '../../utils/audio';

interface NetworkVisualizerProps {
  scenario: Scenario;
  selectedNode: AccountNode | null;
  onSelectNode: (node: AccountNode) => void;
  frozenAccountIds: string[];
}

interface Particle {
  linkId: string;
  sourceId: string;
  targetId: string;
  progress: number; // 0 to 1
  speed: number;
  amount: number;
  isCycle: boolean;
}

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({
  scenario,
  selectedNode,
  onSelectNode,
  frozenAccountIds
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [minAmountFilter, setMinAmountFilter] = useState<number>(0);
  const [highlightCycles, setHighlightCycles] = useState<boolean>(true);
  const [showGraphNumbers, setShowGraphNumbers] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<AccountNode | null>(null);

  // Pan & Zoom Transform State
  const [transform, setTransform] = useState<{ x: number; y: number; k: number }>({
    x: 0,
    y: 0,
    k: 1
  });

  // Node Positions (cached/dynamically positioned)
  const nodePositions = useRef<Map<string, { x: number; y: number; radius: number }>>(new Map());
  const isDragging = useRef<boolean>(false);
  const draggedNodeId = useRef<string | null>(null);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Initialize/Layout nodes in a high-tech topology
  const initializeLayout = useCallback((width: number, height: number) => {
    const nodes = scenario.nodes;
    const positions = new Map<string, { x: number; y: number; radius: number }>();
    const centerX = width / 2;
    const centerY = height / 2;

    if (scenario.id === 'hawala-circular-shell') {
      // Circular Layout for Loop Detection
      const circleNodes = nodes.filter(n => n.role === 'shell_company');
      const radius = Math.min(width, height) * 0.32;
      circleNodes.forEach((node, idx) => {
        const angle = (idx / circleNodes.length) * Math.PI * 2 - Math.PI / 2;
        positions.set(node.id, {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          radius: node.riskScore > 90 ? 32 : 26
        });
      });
    } else {
      // Multi-Tier Flow Layout (Origin Fund Left -> Mules Center -> Collectors & Off-ramp Right)
      const origins = nodes.filter(n => n.role === 'origin_fund');
      const mules = nodes.filter(n => n.role === 'mule_account' || n.role === 'smurf_sender');
      const collectors = nodes.filter(n => n.role === 'collector' || n.role === 'layering_hub');
      const offramps = nodes.filter(n => n.role === 'crypto_offramp' || n.role === 'legit_customer');

      const colWidth = width / 5;

      origins.forEach((node, i) => {
        const yOffset = centerY + (i - (origins.length - 1) / 2) * 120;
        positions.set(node.id, { x: colWidth * 0.9, y: yOffset, radius: 30 });
      });

      mules.forEach((node, i) => {
        const yOffset = centerY + (i - (mules.length - 1) / 2) * 85;
        positions.set(node.id, { x: colWidth * 2.2, y: yOffset, radius: 26 });
      });

      collectors.forEach((node, i) => {
        const yOffset = centerY + (i - (collectors.length - 1) / 2) * 120;
        positions.set(node.id, { x: colWidth * 3.5, y: yOffset, radius: 32 });
      });

      offramps.forEach((node, i) => {
        const yOffset = centerY + (i - (offramps.length - 1) / 2) * 110;
        positions.set(node.id, { x: colWidth * 4.3, y: yOffset, radius: 28 });
      });
    }

    // Default fallback for any unplaced node
    nodes.forEach((n, idx) => {
      if (!positions.has(n.id)) {
        positions.set(n.id, {
          x: centerX + (idx % 2 === 0 ? 1 : -1) * (idx * 40),
          y: centerY + (idx * 30),
          radius: 26
        });
      }
    });

    nodePositions.current = positions;

    // Initialize Particles
    const newParticles: Particle[] = [];
    scenario.links.forEach(link => {
      for (let p = 0; p < 3; p++) {
        newParticles.push({
          linkId: link.id,
          sourceId: link.source,
          targetId: link.target,
          progress: Math.random(),
          speed: (0.004 + Math.random() * 0.004),
          amount: link.amount,
          isCycle: !!link.isCyclePart
        });
      }
    });
    particles.current = newParticles;
  }, [scenario]);

  // Handle Resize and Canvas Setup
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
      initializeLayout(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeLayout]);

  // Reset View
  const handleResetView = () => {
    soundFx.playScanTick();
    setTransform({ x: 0, y: 0, k: 1 });
  };

  const handleZoom = (factor: number) => {
    soundFx.playScanTick();
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.4, Math.min(3, prev.k * factor))
    }));
  };

  // Node Color Helper
  const getNodeColor = (node: AccountNode, isFrozen: boolean) => {
    if (isFrozen) return { fill: '#ef4444', stroke: '#f87171', glow: 'rgba(239, 68, 68, 0.6)' };
    switch (node.riskTier) {
      case 'CRITICAL':
        return { fill: '#dc2626', stroke: '#f87171', glow: 'rgba(239, 68, 68, 0.5)' };
      case 'HIGH':
        return { fill: '#d97706', stroke: '#fbbf24', glow: 'rgba(245, 158, 11, 0.45)' };
      case 'MEDIUM':
        return { fill: '#0891b2', stroke: '#38bdf8', glow: 'rgba(6, 182, 212, 0.4)' };
      case 'LOW':
      default:
        return { fill: '#059669', stroke: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' };
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Apply Pan & Zoom
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw High-Tech Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const startX = -transform.x / transform.k - 100;
      const endX = (width - transform.x) / transform.k + 100;
      const startY = -transform.y / transform.k - 100;
      const endY = (height - transform.y) / transform.k + 100;

      for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }

      // Draw Links / Transaction Edges
      const filteredLinks = scenario.links.filter(l => l.amount >= minAmountFilter);

      filteredLinks.forEach(link => {
        const sourcePos = nodePositions.current.get(link.source);
        const targetPos = nodePositions.current.get(link.target);
        if (!sourcePos || !targetPos) return;

        const isCycle = highlightCycles && link.isCyclePart;
        const isConnectedToSelected = selectedNode && (link.source === selectedNode.id || link.target === selectedNode.id);

        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);

        // Curved or direct line
        let midX = (sourcePos.x + targetPos.x) / 2;
        let midY = (sourcePos.y + targetPos.y) / 2;

        if (isCycle) {
          // Curvature for circular cycle loops
          const dx = targetPos.x - sourcePos.x;
          const dy = targetPos.y - sourcePos.y;
          const normalX = -dy * 0.18;
          const normalY = dx * 0.18;
          midX += normalX;
          midY += normalY;
          ctx.quadraticCurveTo(midX, midY, targetPos.x, targetPos.y);
        } else {
          ctx.lineTo(targetPos.x, targetPos.y);
        }

        // Edge Style
        if (isCycle) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
          ctx.shadowBlur = 12;
        } else if (isConnectedToSelected) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
          ctx.shadowBlur = 10;
        } else if (link.riskLevel === 'CRITICAL') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
          ctx.shadowBlur = 6;
        } else {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 1.6;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Transaction Amount Label on Midpoint
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isCycle ? '#fbbf24' : '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(
          `$${(link.amount).toLocaleString()}`,
          midX,
          midY - 6
        );
      });

      // Update & Draw Flow Particles (Money Streams)
      if (isPlaying) {
        particles.current.forEach(p => {
          const sourcePos = nodePositions.current.get(p.sourceId);
          const targetPos = nodePositions.current.get(p.targetId);
          if (!sourcePos || !targetPos) return;

          p.progress += p.speed * speedMultiplier;
          if (p.progress > 1) p.progress = 0;

          const px = sourcePos.x + (targetPos.x - sourcePos.x) * p.progress;
          const py = sourcePos.y + (targetPos.y - sourcePos.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, p.isCycle ? 4 : 3, 0, Math.PI * 2);
          ctx.fillStyle = p.isCycle ? '#fbbf24' : '#34d399';
          ctx.shadowColor = p.isCycle ? 'rgba(251, 191, 36, 0.9)' : 'rgba(52, 211, 153, 0.9)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw Nodes
      scenario.nodes.forEach(node => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isFrozen = frozenAccountIds.includes(node.id);
        const colors = getNodeColor(node, isFrozen);

        // Node Glow Ring
        if (isSelected || isHovered || isFrozen) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pos.radius + (isSelected ? 9 : 6), 0, Math.PI * 2);
          ctx.fillStyle = colors.glow;
          ctx.fill();
        }

        // Base Node Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.strokeStyle = isSelected ? '#ffffff' : colors.stroke;
        ctx.stroke();

        // Node Role / Initials
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let label = node.name.slice(0, 3).toUpperCase();
        if (node.role === 'origin_fund') label = 'SRC';
        if (node.role === 'collector') label = 'HUB';
        if (node.role === 'crypto_offramp') label = 'DEX';
        if (node.role === 'shell_company') label = 'SHL';
        if (isFrozen) label = 'FRZ';

        ctx.fillText(label, pos.x, pos.y);

        // Node Label Underneath
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillStyle = isSelected ? '#0284c7' : '#0f172a';
        ctx.fillText(node.name, pos.x, pos.y + pos.radius + 14);

        // Risk Score Badge Pill Underneath
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = node.riskScore > 90 ? '#dc2626' : (node.riskScore > 75 ? '#d97706' : '#059669');
        ctx.fillText(
          isFrozen ? '⛔ FROZEN' : `RISK: ${node.riskScore}%`,
          pos.x,
          pos.y + pos.radius + 26
        );

        // Quantitative Graph Degree Numbers if enabled
        if (showGraphNumbers) {
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(
            `In:${node.inDegree || 0} Out:${node.outDegree || 0} | BC:${(node.betweennessCentrality || 0).toFixed(2)}`,
            pos.x,
            pos.y + pos.radius + 37
          );
        }
      });

      ctx.restore(); // Restore Transform
      ctx.restore(); // Restore Canvas Base

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isSubscribed = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [scenario, transform, isPlaying, speedMultiplier, minAmountFilter, highlightCycles, selectedNode, hoveredNode, frozenAccountIds]);

  // Pointer Interaction Handlers (Click, Drag, Pan)
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): { worldX: number; worldY: number; mouseX: number; mouseY: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { worldX: 0, worldY: 0, mouseX: 0, mouseY: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert screen mouse coords to graph world coords (accounting for transform)
    const worldX = (mouseX - transform.x) / transform.k;
    const worldY = (mouseY - transform.y) / transform.k;
    return { worldX, worldY, mouseX, mouseY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { worldX, worldY, mouseX, mouseY } = getCanvasCoords(e);
    
    // Check if a node was clicked
    let clickedNodeId: string | null = null;
    nodePositions.current.forEach((pos, id) => {
      const dist = Math.hypot(pos.x - worldX, pos.y - worldY);
      if (dist <= pos.radius) {
        clickedNodeId = id;
      }
    });

    if (clickedNodeId) {
      draggedNodeId.current = clickedNodeId;
      isDragging.current = true;
      const node = scenario.nodes.find(n => n.id === clickedNodeId);
      if (node) {
        soundFx.playAlert();
        onSelectNode(node);
      }
    } else {
      // Pan Graph
      isDragging.current = true;
      draggedNodeId.current = null;
      dragStart.current = { x: mouseX - transform.x, y: mouseY - transform.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { worldX, worldY, mouseX, mouseY } = getCanvasCoords(e);

    // Hover detection
    let foundHover: AccountNode | null = null;
    nodePositions.current.forEach((pos, id) => {
      const dist = Math.hypot(pos.x - worldX, pos.y - worldY);
      if (dist <= pos.radius) {
        foundHover = scenario.nodes.find(n => n.id === id) || null;
      }
    });
    setHoveredNode(foundHover);

    if (!isDragging.current) return;

    if (draggedNodeId.current) {
      // Move Node
      const currentPos = nodePositions.current.get(draggedNodeId.current);
      if (currentPos) {
        nodePositions.current.set(draggedNodeId.current, {
          ...currentPos,
          x: worldX,
          y: worldY
        });
      }
    } else {
      // Pan Canvas
      setTransform(prev => ({
        ...prev,
        x: mouseX - dragStart.current.x,
        y: mouseY - dragStart.current.y
      }));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    draggedNodeId.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.4, Math.min(3, prev.k * zoomFactor))
    }));
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-50 rounded-2xl relative overflow-hidden flex flex-col border border-slate-200 shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-white' : 'h-[540px] w-full'
      }`}
    >
      {/* Top HUD Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Badge Info */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-slate-800">
          <div className="flex items-center gap-1.5">
            <Network className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              {scenario.title}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            {scenario.nodes.length} Accounts / {scenario.links.length} Transfers
          </span>
          {highlightCycles && scenario.id === 'hawala-circular-shell' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-amber-600" /> Cycle Loop Detected
            </span>
          )}
        </div>

        {/* Right Floating Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
          
          {/* Play/Pause Money Flow */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-all"
            title={isPlaying ? 'Pause Money Stream' : 'Resume Money Stream'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
            className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-all"
            title="Adjust Particle Velocity"
          >
            {speedMultiplier}x
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5"></div>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(0.85)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom(1.15)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Reset Position */}
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-all"
            title="Reset Viewport"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5"></div>

          {/* Cycle Loop Toggle */}
          <button
            onClick={() => setHighlightCycles(!highlightCycles)}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              highlightCycles 
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Highlight Laundering Cycles / Smurfing Rings"
          >
            <Zap className="w-3.5 h-3.5 text-amber-700" />
          </button>

          {/* Graph Numbers Toggle */}
          <button
            onClick={() => setShowGraphNumbers(!showGraphNumbers)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
              showGraphNumbers 
                ? 'bg-blue-50 text-blue-800 border border-blue-300 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
            title="Toggle Graph Numbers (In/Out Degree & Centrality)"
          >
            # Graph Metrics
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Visualizer'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-slate-50 cyber-grid"
      />

      {/* Bottom HUD Overlay / Legend Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Risk Level Legend */}
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-[11px] font-mono pointer-events-auto text-slate-700">
          <span className="text-slate-500 text-[10px] font-bold">RISK TIERS:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="text-red-700 font-semibold">Critical (&gt;90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-amber-700 font-semibold">High (75-90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-emerald-700 font-semibold">Low (&lt;30)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-700 font-medium">Money Flow Particles</span>
          </div>
        </div>

        {/* Quick Hint */}
        <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-600 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm font-mono pointer-events-auto">
          <Info className="w-3.5 h-3.5 text-emerald-700" />
          <span>Click node to inspect Account Intelligence &amp; Freeze outflows</span>
        </div>

      </div>

    </div>
  );
};
