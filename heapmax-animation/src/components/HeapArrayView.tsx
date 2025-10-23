import React from 'react';
import { motion } from 'motion/react';
import type { HeapItem } from '../App';

interface HeapArrayViewProps {
  heap: number[];
  heapItems?: HeapItem[];
  heapType: 'min' | 'max';
  highlightedIndices: number[];
}

export function HeapArrayView({ heap, heapItems, heapType, highlightedIndices }: HeapArrayViewProps) {
  if (heap.length === 0) return null;

  const getParentIndex = (i: number) => i > 0 ? Math.floor((i - 1) / 2) : -1;
  const getLeftChild = (i: number) => 2 * i + 1;
  const getRightChild = (i: number) => 2 * i + 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700"
    >
      <h3 className="text-white mb-4">Representação em Array</h3>
      
      {/* Array visual */}
      <div className="overflow-x-auto mb-6">
        <div className="flex gap-2 pb-4 min-w-max">
          {heap.map((value, index) => {
            const isRoot = index === 0;
            const isHighlighted = highlightedIndices.includes(index);
            const item = heapItems?.[index];
            
            return (
              <motion.div
                key={`array-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative group"
              >
                <motion.div
                  animate={{
                    scale: isHighlighted ? [1, 1.1, 1] : 1,
                    borderColor: isHighlighted 
                      ? 'rgb(59, 130, 246)'
                      : isRoot
                      ? 'rgb(168, 85, 247)'
                      : 'rgb(71, 85, 105)'
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-20 h-20 flex flex-col items-center justify-center
                    border-2 rounded-lg relative
                    ${isRoot
                      ? 'bg-purple-500/20'
                      : isHighlighted
                      ? 'bg-blue-500/20'
                      : 'bg-slate-700/50'
                    }
                  `}
                >
                  <span className="text-white font-semibold">{value}</span>
                  <span className="text-slate-400 text-xs mt-1">[{index}]</span>
                  {item && (
                    <span className="text-slate-500 text-xs">ID:{item.id}</span>
                  )}
                </motion.div>
                
                {/* Setas para mostrar relações */}
                {index > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
                    ↑ {getParentIndex(index)}
                  </div>
                )}

                {/* Tooltip com detalhes */}
                {item && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-xs whitespace-nowrap shadow-lg">
                      <p className="text-white font-semibold mb-1">Item #{item.id}</p>
                      <p className="text-green-400">Score: {item.calculatedScore}</p>
                      {Object.entries(item.attributes).map(([key, val]) => (
                        <p key={key} className="text-slate-300">
                          {key}: {val}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fórmulas e relações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
          >
          <p className="text-slate-300 text-sm mb-2">Fóruma do Pai do índice i:</p>
          <code className="text-purple-400 text-xs">⌊(i - 1) / 2⌋</code>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
        >
          <p className="text-slate-300 text-sm mb-2">Fórmula Filho esquerdo de i:</p>
          <code className="text-blue-400 text-xs">2i + 1</code>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
        >
          <p className="text-slate-300 text-sm mb-2">Fórmula do Filho direito de i:</p>
          <code className="text-green-400 text-xs">2i + 2</code>
        </motion.div>
      </div>

      {/* Complexidades */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 p-4 bg-green-950/30 border border-green-900/50 rounded-lg"
      >
        <p className="text-sm text-green-200">
          <span className="font-semibold">Complexidade:</span>{' '}
          Inserção: O(log n) | Remoção: O(log n) | Busca max/min: O(1) | Espaço: O(n)
        </p>
      </motion.div>
    </motion.div>
  );
}