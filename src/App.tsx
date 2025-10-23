import React from 'react';
import { useState, useEffect } from 'react';
import { HeapVisualizer } from './components/HeapVisualizer';
import { HeapControls } from './components/HeapControls';
import { HeapArrayView } from './components/HeapArrayView';
import { PriorityFormulaConfig, type PriorityFormula, type PriorityAttribute } from './components/PriorityFormulaConfig';

export interface HeapItem {
  id: number;
  attributes: Record<string, number>;
  calculatedScore: number;
}

const defaultFormula: PriorityFormula = {
  attributes: [
    { name: 'priorityScore', weight: 1, label: 'Priority Score (P1)' },
    { name: 'dispatchWindow', weight: 1, label: 'Dispatch Window (P2)' },
    { name: 'sizePenalty', weight: 1, label: 'Size Penalty (P3)' }
  ],
  formula: 'priorityScore * P1 / 100 + 100 * P2 / (dispatchWindow + 1) + sizePenalty * P3',
  description: 'Fórmula de prioridade baseada em score, janela de despacho e penalidade de tamanho'
};

export default function App() {
  const [heapItems, setHeapItems] = useState<HeapItem[]>([
    { id: 1, attributes: { priorityScore: 85, dispatchWindow: 5, sizePenalty: 3 }, calculatedScore: 0 },
    { id: 2, attributes: { priorityScore: 60, dispatchWindow: 10, sizePenalty: 2 }, calculatedScore: 0 },
    { id: 3, attributes: { priorityScore: 90, dispatchWindow: 2, sizePenalty: 4 }, calculatedScore: 0 },
    { id: 4, attributes: { priorityScore: 45, dispatchWindow: 15, sizePenalty: 1 }, calculatedScore: 0 },
    { id: 5, attributes: { priorityScore: 70, dispatchWindow: 8, sizePenalty: 2 }, calculatedScore: 0 },
  ]);
  const [formula, setFormula] = useState<PriorityFormula>(defaultFormula);
  const [heapType, setHeapType] = useState<'min' | 'max'>('max');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [nextId, setNextId] = useState(6);

  // Calcular score usando a fórmula
  const calculateScore = (attributes: Record<string, number>, formulaObj: PriorityFormula): number => {
    try {
      const { priorityScore = 0, dispatchWindow = 0, sizePenalty = 0 } = attributes;
      
      // Encontrar os pesos P1, P2, P3
      const P1 = formulaObj.attributes.find(a => a.name === 'priorityScore')?.weight || 1;
      const P2 = formulaObj.attributes.find(a => a.name === 'dispatchWindow')?.weight || 1;
      const P3 = formulaObj.attributes.find(a => a.name === 'sizePenalty')?.weight || 1;
      
      // Fórmula: S = P1 × (priorityScore)/100 + P2 × 100/(dispatchWindow + 1) + P3 × (sizePenalty)
      const score = (P1 * priorityScore / 100) + (P2 * 100 / (dispatchWindow + 1)) + (P3 * sizePenalty);
      
      return Number.isFinite(score) ? Math.round(score * 100) / 100 : 0;
    } catch (error) {
      console.error('Erro ao calcular fórmula:', error);
      return 0;
    }
  };

  // Recalcular scores quando a fórmula mudar
  const recalculateScores = (items: HeapItem[], newFormula: PriorityFormula): HeapItem[] => {
    return items.map(item => ({
      ...item,
      calculatedScore: calculateScore(item.attributes, newFormula)
    }));
  };

  // Funções de heap modificadas para trabalhar com HeapItem[]
  const heapifyArray = (items: HeapItem[], isMax: boolean): HeapItem[] => {
    const arr = [...items];
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapifyDown(arr, i, isMax);
    }
    return arr;
  };

  const heapifyUp = (arr: HeapItem[], index: number, isMax: boolean) => {
    let currentIndex = index;
    
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      const shouldSwap = isMax 
        ? arr[currentIndex].calculatedScore > arr[parentIndex].calculatedScore
        : arr[currentIndex].calculatedScore < arr[parentIndex].calculatedScore;
      
      if (shouldSwap) {
        [arr[currentIndex], arr[parentIndex]] = [arr[parentIndex], arr[currentIndex]];
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  };

  const heapifyDown = (arr: HeapItem[], index: number, isMax: boolean) => {
    const length = arr.length;
    let currentIndex = index;
    
    while (true) {
      const leftChild = 2 * currentIndex + 1;
      const rightChild = 2 * currentIndex + 2;
      let targetIndex = currentIndex;
      
      if (leftChild < length) {
        const shouldSwapLeft = isMax
          ? arr[leftChild].calculatedScore > arr[targetIndex].calculatedScore
          : arr[leftChild].calculatedScore < arr[targetIndex].calculatedScore;
        if (shouldSwapLeft) {
          targetIndex = leftChild;
        }
      }
      
      if (rightChild < length) {
        const shouldSwapRight = isMax
          ? arr[rightChild].calculatedScore > arr[targetIndex].calculatedScore
          : arr[rightChild].calculatedScore < arr[targetIndex].calculatedScore;
        if (shouldSwapRight) {
          targetIndex = rightChild;
        }
      }
      
      if (targetIndex !== currentIndex) {
        [arr[currentIndex], arr[targetIndex]] = [arr[targetIndex], arr[currentIndex]];
        currentIndex = targetIndex;
      } else {
        break;
      }
    }
  };

  const insertItem = (attributes: Record<string, number>) => {
    const newItem: HeapItem = {
      id: nextId,
      attributes,
      calculatedScore: calculateScore(attributes, formula)
    };
    
    const newHeap = [...heapItems, newItem];
    heapifyUp(newHeap, newHeap.length - 1, heapType === 'max');
    
    setHighlightedIndices([newHeap.length - 1]);
    setHeapItems(newHeap);
    setNextId(nextId + 1);
    
    setTimeout(() => setHighlightedIndices([]), 1000 / animationSpeed);
  };

  const removeRoot = () => {
    if (heapItems.length === 0) return;
    
    if (heapItems.length === 1) {
      setHeapItems([]);
      return;
    }
    
    const newHeap = [...heapItems];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    
    heapifyDown(newHeap, 0, heapType === 'max');
    
    setHighlightedIndices([0]);
    setHeapItems(newHeap);
    
    setTimeout(() => setHighlightedIndices([]), 1000 / animationSpeed);
  };

  const convertHeap = (type: 'min' | 'max') => {
    setHeapType(type);
    setHeapItems(heapifyArray(heapItems, type === 'max'));
  };

  const generateRandomHeap = () => {
    const size = Math.floor(Math.random() * 6) + 4;
    const items: HeapItem[] = [];
    
    for (let i = 0; i < size; i++) {
      const attributes: Record<string, number> = {
        priorityScore: Math.floor(Math.random() * 100) + 1,      // 1-100
        dispatchWindow: Math.floor(Math.random() * 40) + 1,       // 1-40
        sizePenalty: Math.floor(Math.random() * 8) + 1            // 1-8
      };
      
      items.push({
        id: nextId + i,
        attributes,
        calculatedScore: calculateScore(attributes, formula)
      });
    }
    
    setHeapItems(heapifyArray(items, heapType === 'max'));
    setNextId(nextId + size);
  };

  const clearHeap = () => {
    setHeapItems([]);
  };

  // Converter HeapItem[] para formato de exibição
  const heapScores = heapItems.map(item => item.calculatedScore);

  // Inicializar scores ao carregar
  useEffect(() => {
    const itemsWithScores = recalculateScores(heapItems, formula);
    const heapified = heapifyArray(itemsWithScores, heapType === 'max');
    setHeapItems(heapified);
  }, []); // Executar apenas uma vez no mount

  // Atualizar fórmula e recalcular heap
  const handleFormulaChange = (newFormula: PriorityFormula) => {
    setFormula(newFormula);
    const updatedItems = recalculateScores(heapItems, newFormula);
    setHeapItems(heapifyArray(updatedItems, heapType === 'max'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-white mb-2">Heap Tree - Fila de Prioridade Dinâmica</h1>
          <p className="text-slate-300">Score calculado por fórmula customizável</p>
        </div>

        <div className="mb-8">
          <PriorityFormulaConfig
            formula={formula}
            onFormulaChange={handleFormulaChange}
          />
        </div>

        <HeapControls
          heapType={heapType}
          onHeapTypeChange={convertHeap}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={setAnimationSpeed}
          onInsert={insertItem}
          onRemove={removeRoot}
          onGenerate={generateRandomHeap}
          onClear={clearHeap}
          heapSize={heapItems.length}
          formula={formula}
        />

        <HeapVisualizer
          heap={heapScores}
          heapItems={heapItems}
          heapType={heapType}
          animationSpeed={animationSpeed}
          highlightedIndices={highlightedIndices}
          showDetails={true}
        />

        <HeapArrayView
          heap={heapScores}
          heapItems={heapItems}
          heapType={heapType}
          highlightedIndices={highlightedIndices}
        />
      </div>
    </div>
  );
}