import React from 'react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Plus, Minus, Shuffle, Trash2 } from 'lucide-react';
import type { PriorityFormula } from './PriorityFormulaConfig';

interface HeapControlsProps {
  heapType: 'min' | 'max';
  onHeapTypeChange: (type: 'min' | 'max') => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  onInsert: (attributes: Record<string, number>) => void;
  onRemove: () => void;
  onGenerate: () => void;
  onClear: () => void;
  heapSize: number;
  formula: PriorityFormula;
}

export function HeapControls({
  heapType,
  onHeapTypeChange,
  animationSpeed,
  onAnimationSpeedChange,
  onInsert,
  onRemove,
  onGenerate,
  onClear,
  heapSize,
  formula
}: HeapControlsProps) {
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    initial['priorityScore'] = '50';
    initial['dispatchWindow'] = '5';
    initial['sizePenalty'] = '2';
    return initial;
  });

  const handleInsert = () => {
    const attributes: Record<string, number> = {};
    let isValid = true;
    
    formula.attributes.forEach(attr => {
      const value = parseFloat(attributeValues[attr.name] || '0');
      
      // Validação específica por atributo
      if (attr.name === 'priorityScore' && (isNaN(value) || value < 0 || value > 100)) {
        isValid = false;
      } else if (attr.name === 'dispatchWindow' && (isNaN(value) || value < 0 || value > 50)) {
        isValid = false;
      } else if (attr.name === 'sizePenalty' && (isNaN(value) || value < 0 || value > 10)) {
        isValid = false;
      }
      
      attributes[attr.name] = value;
    });
    
    if (isValid) {
      onInsert(attributes);
      // Reset values
      setAttributeValues({
        priorityScore: '50',
        dispatchWindow: '5',
        sizePenalty: '2'
      });
    }
  };

  const handleAttributeChange = (attrName: string, value: string) => {
    setAttributeValues(prev => ({
      ...prev,
      [attrName]: value
    }));
  };

  // Configuração de range e placeholder por atributo
  const getInputConfig = (attrName: string) => {
    switch(attrName) {
      case 'priorityScore':
        return { min: 0, max: 100, step: 1, placeholder: '0-100' };
      case 'dispatchWindow':
        return { min: 0, max: 50, step: 1, placeholder: '0-50' };
      case 'sizePenalty':
        return { min: 0, max: 10, step: 0.5, placeholder: '0-10' };
      default:
        return { min: 0, max: 10, step: 0.5, placeholder: '0-10' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tipo de Heap */}
        <div className="space-y-3">
          <Label className="text-slate-300">Tipo de Heap</Label>
          <div className="flex gap-2">
            <Button
              variant={heapType === 'max' ? 'default' : 'outline'}
              onClick={() => onHeapTypeChange('max')}
              className="flex-1"
            >
              Max-Heap
            </Button>
            {/* <Button
              variant={heapType === 'min' ? 'default' : 'outline'}
              onClick={() => onHeapTypeChange('min')}
              className="flex-1"
            >
              Min-Heap
            </Button> */}
          </div>
          <p className="text-xs text-slate-400">
            {heapType === 'max' ? 'Maior score na raiz' : 'Menor score na raiz'}
          </p>
        </div>

        {/* Inserir Item */}
        <div className="space-y-3">
          <Label className="text-slate-300">Inserir Item</Label>
            <div className="space-y-2">
              {formula.attributes.map((attr) => {
              const config = getInputConfig(attr.name);
                return (
                  <div key={attr.name} className="flex items-center gap-4">
                    <Label className="text-xs text-slate-400 min-w-[8rem] md:min-w-[10rem] max-w-[14rem] truncate" title={attr.label}>
                    {attr.label.split('(')[0].trim()}:
                    </Label>
                    <Input
                      type="number"
                      value={attributeValues[attr.name] || ''}
                      onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                      placeholder={config.placeholder}
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      className="h-8 text-sm flex-1"
                    />
                  </div>
                );
              })}
            </div>

          <Button
            onClick={handleInsert}
            size="sm"
            disabled={heapSize >= 15}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
         <p className="text-xs text-slate-400">Tamanho: {heapSize}/15</p>
        </div>

        {/* Operações */}
        <div className="space-y-3">
          <Label className="text-slate-300">Operações</Label>
          <div className="flex gap-2">
            <Button
              onClick={onRemove}
              disabled={heapSize === 0}
              variant="destructive"
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-2" />
              Remover Raiz
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={onGenerate} variant="secondary" className="flex-1">
              <Shuffle className="h-4 w-4 mr-2" />
              Gerar
            </Button>
            <Button onClick={onClear} variant="outline" disabled={heapSize === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Velocidade */}
        <div className="space-y-3">
          <Label className="text-slate-300">Velocidade da Animação</Label>
          <Slider
            value={[animationSpeed]}
            onValueChange={([value]) => onAnimationSpeedChange(value)}
            min={0.5}
            max={2}
            step={0.25}
            className="w-full"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400">{animationSpeed}x</p>
            <Badge variant="outline" className="text-xs">
              {animationSpeed === 0.5 ? 'Lento' : animationSpeed === 1 ? 'Normal' : 'Rápido'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Info sobre a estrutura */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg"
      >
        <p className="text-sm text-blue-200">
          <span className="font-semibold">Heap com Score Dinâmico:</span> Cada item é ordenado pelo score calculado pela fórmula.
          O {heapType === 'max' ? 'maior' : 'menor'} score fica na raiz para acesso O(1).
        </p>
      </motion.div>
    </motion.div>
  );
}