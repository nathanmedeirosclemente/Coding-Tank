import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calculator, Info } from 'lucide-react';
import { Separator } from './ui/separator';

export interface PriorityAttribute {
  name: string;
  weight: number;
  label: string;
}

export interface PriorityFormula {
  attributes: PriorityAttribute[];
  formula: string;
  description: string;
}

interface PriorityFormulaConfigProps {
  formula: PriorityFormula;
  onFormulaChange: (formula: PriorityFormula) => void;
}

// Atributos fixos baseados na fórmula: S = P1 × (priorityScore)/100 + P2 × 100/(dispatchWindow + 1) + P3 × (sizePenalty)
const fixedAttributes: PriorityAttribute[] = [
  { name: 'priorityScore', weight: 0.3, label: 'Priority Score (P1)' },
  { name: 'dispatchWindow', weight: 0.6, label: 'Dispatch Window (P2)' },
  { name: 'sizePenalty', weight: 0.1, label: 'Size Penalty (P3)' }
];

// Fórmula fixa
const fixedFormula = 'priorityScore * P1 / 100 + 100 * P2 / (dispatchWindow + 1) + sizePenalty * P3';

export function PriorityFormulaConfig({ formula, onFormulaChange }: PriorityFormulaConfigProps) {
  const updateWeight = (name: string, weight: number) => {
    onFormulaChange({
      ...formula,
      attributes: formula.attributes.map(attr =>
        attr.name === name ? { ...attr, weight } : attr
      )
    });
  };

  const resetToDefault = () => {
    onFormulaChange({
      attributes: fixedAttributes.map(attr => ({ ...attr })),
      formula: fixedFormula,
      description: 'Fórmula de prioridade baseada em score, janela de despacho e penalidade de tamanho'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/50 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Calculator className="w-2 h-2 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-white">Fórmula de Prioridade Dinâmica</h2>
            <p className="text-slate-400 text-sm">Configure os pesos (P1, P2, P3) para calcular o score do Max-Heap</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fórmula Fixa */}
          <div className="space-y-2">
            <div>
              <Label className="text-slate-300">Fórmula de Cálculo</Label>
              <p className="text-xs text-slate-500 mt-1">Fórmula matemática para priorização</p>
            </div>

            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-700">
              <div className="space-y-2">
                <p className="text-green-400 text-sm font-mono">S = P1 × (priorityScore)/100</p>
                <p className="text-green-400 text-sm font-mono ml-6">+ P2 × 100/(dispatchWindow + 1)</p>
                <p className="text-green-400 text-sm font-mono ml-6">+ P3 × (sizePenalty)</p>
              </div>
            </div>

            <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-800/50">
              <p className="text-blue-200 text-xs">
                <span className="font-semibold">Como funciona:</span> O score final (S) é calculado usando três componentes ponderados: 
                prioridade normalizada, urgência da janela de despacho e penalidade de tamanho.
              </p>
            </div>
          </div>

          {/* Pesos (P1, P2, P3) */}
          <div className="space-y-2">
            <div>
              <Label className="text-slate-300">Configuração de Pesos</Label>
              <p className="text-xs text-slate-500 mt-1">Ajuste a importância de cada componente</p>
            </div>

            <div className="space-y-3">
              {formula.attributes.map((attr) => (
                <motion.div
                  key={attr.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-white text-sm font-semibold">{attr.label}</span>
                      <Badge variant="outline" className="text-xs ml-2">
                        {attr.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-xs text-slate-400 w-12">Peso:</Label>
                    <Input
                      type="number"
                      value={attr.weight}
                      onChange={(e) => updateWeight(attr.name, parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-24 h-9"
                    />
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                        style={{ width: `${Math.min((attr.weight / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {attr.name === 'priorityScore' && 'Controla o impacto do score de prioridade (0-100)'}
                    {attr.name === 'dispatchWindow' && 'Controla a urgência baseada na janela de despacho'}
                    {attr.name === 'sizePenalty' && 'Controla o impacto da penalidade por tamanho'}
                  </p>
                </motion.div>
              ))}
            </div>

            <Button onClick={resetToDefault} variant="outline" className="w-full">
              Resetar para Padrão
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Componentes da Fórmula */}
        <div className="space-y-3">
          <Label className="text-slate-300">Componentes da Fórmula</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-purple-400 text-xs font-semibold mb-1">Priority Score</p>
              <code className="text-slate-300 text-xs">P1 × (priorityScore) / 100</code>
              <p className="text-slate-500 text-xs mt-1">Normaliza o score de prioridade</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-blue-400 text-xs font-semibold mb-1">Dispatch Window</p>
              <code className="text-slate-300 text-xs">P2 × 100 / (dispatchWindow + 1)</code>
              <p className="text-slate-500 text-xs mt-1">Menor janela = maior urgência</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-green-400 text-xs font-semibold mb-1">Size Penalty</p>
              <code className="text-slate-300 text-xs">P3 × (sizePenalty)</code>
              <p className="text-slate-500 text-xs mt-1">Penalização por tamanho do item</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
