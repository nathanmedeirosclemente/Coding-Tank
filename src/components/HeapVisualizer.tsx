import React from 'react';
import { motion } from 'motion/react';
import type { HeapItem } from '../App';

interface HeapVisualizerProps {
  heap: number[];
  heapItems?: HeapItem[];
  heapType: 'min' | 'max';
  animationSpeed: number;
  highlightedIndices: number[];
  showDetails?: boolean;
}

interface NodePosition {
  x: number;
  y: number;
}

const calculateNodePositions = (heapSize: number): NodePosition[] => {
  const positions: NodePosition[] = [];
  
  if (heapSize === 0) return positions;
  
  const levels = Math.ceil(Math.log2(heapSize + 1));
  const baseWidth = Math.pow(2, levels - 1) * 100;
  
  for (let i = 0; i < heapSize; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const positionInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    
    const levelWidth = baseWidth / Math.pow(2, level);
    const x = (positionInLevel + 0.5) * levelWidth;
    const y = level * 120 + 80;
    
    positions.push({ x, y });
  }
  
  return positions;
};

export function HeapVisualizer({ heap, heapItems, heapType, animationSpeed, highlightedIndices, showDetails = false }: HeapVisualizerProps) {
  const positions = calculateNodePositions(heap.length);
  
  if (heap.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-12 border border-slate-700 mb-8">
        <div className="text-center">
          <p className="text-slate-400">O heap está vazio. Adicione valores para começar.</p>
        </div>
      </div>
    );
  }

  // Calcular dimensões do SVG
  const levels = Math.ceil(Math.log2(heap.length + 1));
  const svgWidth = Math.pow(2, levels - 1) * 100 + 100;
  const svgHeight = levels * 120 + 100;

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 mb-8">
      <div className="relative flex items-center justify-center overflow-x-auto pb-4">
        <svg 
          width={svgWidth} 
          height={svgHeight}
          className="block mx-auto"
          style={{ minWidth: '600px' }}
        >
          {/* Desenhar arestas */}
          {heap.map((_, index) => {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            return (
              <g key={`edges-${index}`}>
                {leftChild < heap.length && (
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 0.5 * animationSpeed, delay: index * 0.1 }}
                    x1={positions[index].x}
                    y1={positions[index].y}
                    x2={positions[leftChild].x}
                    y2={positions[leftChild].y}
                    stroke="rgb(148, 163, 184)"
                    strokeWidth="2"
                  />
                )}
                {rightChild < heap.length && (
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 0.5 * animationSpeed, delay: index * 0.1 }}
                    x1={positions[index].x}
                    y1={positions[index].y}
                    x2={positions[rightChild].x}
                    y2={positions[rightChild].y}
                    stroke="rgb(148, 163, 184)"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
          
          {/* Desenhar nós */}
          {heap.map((value, index) => {
            const isRoot = index === 0;
            const isHighlighted = highlightedIndices.includes(index);
            const position = positions[index];
            const item = heapItems?.[index];
            
            return (
              <g key={`node-${index}-${value}`}>
                {/* Círculo do nó */}
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5 * animationSpeed,
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 100
                  }}
                  cx={position.x}
                  cy={position.y}
                  r="32"
                  fill={
                    isRoot
                      ? 'url(#gradient-root)'
                      : isHighlighted
                      ? 'url(#gradient-highlight)'
                      : 'url(#gradient-normal)'
                  }
                  stroke={
                    isRoot
                      ? 'rgb(192, 132, 252)'
                      : isHighlighted
                      ? 'rgb(96, 165, 250)'
                      : 'rgb(100, 116, 139)'
                  }
                  strokeWidth="2"
                  style={{
                    filter: isHighlighted
                      ? 'drop-shadow(0 0 10px rgb(59, 130, 246))'
                      : isRoot
                      ? 'drop-shadow(0 0 10px rgb(168, 85, 247))'
                      : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
                  }}
                />
                
                {/* Valor do nó (Score) */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.05) + 0.2 }}
                  x={position.x}
                  y={position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  className="select-none"
                  style={{ fontSize: '18px', fontWeight: '700' }}
                >
                  {value}
                </motion.text>
                
                {/* Índice do nó */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index * 0.05) + 0.3 }}
                  x={position.x}
                  y={position.y - 48}
                  textAnchor="middle"
                  fill="rgb(148, 163, 184)"
                  className="select-none"
                  style={{ fontSize: '11px' }}
                >
                  [{index}]
                </motion.text>
                
                {/* ID do item */}
                {showDetails && item && (
                  <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (index * 0.05) + 0.4 }}
                    x={position.x}
                    y={position.y + 48}
                    textAnchor="middle"
                    fill="rgb(148, 163, 184)"
                    className="select-none"
                    style={{ fontSize: '10px' }}
                  >
                    ID: {item.id}
                  </motion.text>
                )}
                
                {/* Label para raiz */}
                {isRoot && (
                  <motion.text
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    x={position.x}
                    y={position.y + (showDetails ? 62 : 52)}
                    textAnchor="middle"
                    fill="rgb(192, 132, 252)"
                    className="select-none"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  >
                    Root
                  </motion.text>
                )}
              </g>
            );
          })}
          
          {/* Gradientes */}
          <defs>
            <linearGradient id="gradient-root" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" />
              <stop offset="100%" stopColor="rgb(126, 34, 206)" />
            </linearGradient>
            <linearGradient id="gradient-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" />
              <stop offset="100%" stopColor="rgb(29, 78, 216)" />
            </linearGradient>
            <linearGradient id="gradient-normal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(71, 85, 105)" />
              <stop offset="100%" stopColor="rgb(51, 65, 85)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Info e detalhes dos itens */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            {heapType === 'max' ? 'Max-Heap' : 'Min-Heap'}: 
            <span className="text-white ml-2">
              Raiz Score = {heap[0]} ({heapType === 'max' ? 'maior' : 'menor'} prioridade)
            </span>
          </p>
        </div>

        {/* Detalhes dos itens */}
        {showDetails && heapItems && heapItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
          >
            <p className="text-slate-300 text-sm mb-3">Detalhes dos Itens no Heap:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-36 overflow-y-auto">
              {heapItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-2 rounded text-xs ${
                    index === 0
                      ? 'bg-purple-500/20 border border-purple-500/50'
                      : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  <p className="text-white font-semibold mb-1">
                    [{index}] PEDIDO_ID:{item.id}
                  </p>
                  <p className="text-green-400">Score: {item.calculatedScore}</p>
                  {Object.entries(item.attributes).map(([key, val]) => (
                    <p key={key} className="text-slate-400">
                      {key}: {val}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}