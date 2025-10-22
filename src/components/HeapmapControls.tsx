import React from 'react';
import { motion } from 'motion/react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface HeatmapControlsProps {
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  colorScheme: 'default' | 'cool' | 'warm';
  onColorSchemeChange: (scheme: 'default' | 'cool' | 'warm') => void;
}

export function HeatmapControls({
  animationSpeed,
  onAnimationSpeedChange,
  showLabels,
  onShowLabelsChange,
  colorScheme,
  onColorSchemeChange
}: HeatmapControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Velocidade da Animação */}
        <div className="space-y-3">
          <Label className="text-slate-300">Velocidade da Animação</Label>
          <Slider
            value={[animationSpeed]}
            onValueChange={([value]) => onAnimationSpeedChange(value)}
            min={0.1}
            max={2}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-slate-400">{animationSpeed.toFixed(1)}x</p>
        </div>

        {/* Mostrar Labels */}
        <div className="space-y-3">
          <Label className="text-slate-300">Mostrar Valores</Label>
          <div className="flex items-center gap-3">
            <Switch
              checked={showLabels}
              onCheckedChange={onShowLabelsChange}
            />
            <span className="text-sm text-slate-400">
              {showLabels ? 'Ativado' : 'Desativado'}
            </span>
          </div>
        </div>

        {/* Esquema de Cores */}
        <div className="space-y-3">
          <Label className="text-slate-300">Esquema de Cores</Label>
          <div className="flex gap-2">
            <Button
              variant={colorScheme === 'default' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onColorSchemeChange('default')}
            >
              Padrão
            </Button>
            <Button
              variant={colorScheme === 'cool' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onColorSchemeChange('cool')}
            >
              Frio
            </Button>
            <Button
              variant={colorScheme === 'warm' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onColorSchemeChange('warm')}
            >
              Quente
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
