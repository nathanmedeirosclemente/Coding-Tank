import { motion } from 'motion/react';
import React from 'react';
import { useState } from 'react';

interface HeatmapProps {
  animationSpeed: number;
  showLabels: boolean;
  colorScheme: 'default' | 'cool' | 'warm';
}

// Dados de exemplo - representando atividade semanal por hora
const generateHeatmapData = () => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const data = days.map((day, dayIndex) => ({
    day,
    values: hours.map((hour) => {
      // Simular padrões de atividade
      let base = Math.random() * 50;
      
      // Mais atividade durante o dia (8-22h)
      if (hour >= 8 && hour <= 22) {
        base += 30;
      }
      
      // Menos atividade nos finais de semana
      if (dayIndex === 0 || dayIndex === 6) {
        base *= 0.7;
      }
      
      // Pico na hora do almoço e noite
      if (hour >= 12 && hour <= 14) {
        base += 20;
      }
      if (hour >= 19 && hour <= 21) {
        base += 25;
      }
      
      return {
        hour,
        value: Math.min(100, Math.round(base))
      };
    })
  }));
  
  return data;
};

const getColorSchemes = (scheme: 'default' | 'cool' | 'warm') => {
  const schemes = {
    default: [
      'rgb(15, 23, 42)',    // 0-20%
      'rgb(30, 58, 138)',   // 20-40%
      'rgb(59, 130, 246)',  // 40-60%
      'rgb(147, 51, 234)',  // 60-80%
      'rgb(236, 72, 153)'   // 80-100%
    ],
    cool: [
      'rgb(15, 23, 42)',
      'rgb(21, 94, 117)',
      'rgb(6, 182, 212)',
      'rgb(103, 232, 249)',
      'rgb(224, 242, 254)'
    ],
    warm: [
      'rgb(23, 23, 23)',
      'rgb(124, 45, 18)',
      'rgb(234, 88, 12)',
      'rgb(251, 146, 60)',
      'rgb(254, 215, 170)'
    ]
  };
  
  return schemes[scheme];
};

const getColor = (value: number, scheme: 'default' | 'cool' | 'warm') => {
  const colors = getColorSchemes(scheme);
  
  if (value <= 20) return colors[0];
  if (value <= 40) return colors[1];
  if (value <= 60) return colors[2];
  if (value <= 80) return colors[3];
  return colors[4];
};

export function Heatmap({ animationSpeed, showLabels, colorScheme }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; value: number } | null>(null);
  const data = generateHeatmapData();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Cabeçalho com horas */}
          <div className="flex mb-2">
            <div className="w-16 flex-shrink-0" />
            {hours.map((hour) => (
              <div
                key={hour}
                className="w-12 flex-shrink-0 text-center text-slate-400"
              >
                {hour % 3 === 0 && <span className="text-xs">{hour}h</span>}
              </div>
            ))}
          </div>

          {/* Grid do heatmap */}
          {data.map((dayData, dayIndex) => (
            <div key={dayData.day} className="flex items-center mb-1">
              <div className="w-16 flex-shrink-0 text-slate-300 text-sm pr-4 text-right">
                {dayData.day}
              </div>
              <div className="flex gap-1">
                {dayData.values.map((cell, hourIndex) => (
                  <motion.div
                    key={`${dayIndex}-${hourIndex}`}
                    className="relative w-12 h-12 rounded cursor-pointer"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      backgroundColor: getColor(cell.value, colorScheme)
                    }}
                    transition={{
                      delay: (dayIndex * 24 + hourIndex) * 0.002 * animationSpeed,
                      duration: 0.3 * animationSpeed,
                      type: 'spring',
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.15,
                      zIndex: 10,
                      transition: { duration: 0.2 }
                    }}
                    onHoverStart={() => setHoveredCell({ 
                      day: dayData.day, 
                      hour: cell.hour, 
                      value: cell.value 
                    })}
                    onHoverEnd={() => setHoveredCell(null)}
                  >
                    {showLabels && cell.value > 70 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (dayIndex * 24 + hourIndex) * 0.002 * animationSpeed + 0.3 }}
                        className="absolute inset-0 flex items-center justify-center text-white text-xs"
                      >
                        {cell.value}
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <span className="text-slate-400 text-sm">Baixo</span>
        <div className="flex gap-1">
          {getColorSchemes(colorScheme).map((color, index) => (
            <motion.div
              key={index}
              className="w-12 h-6 rounded"
              style={{ backgroundColor: color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
        <span className="text-slate-400 text-sm">Alto</span>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center bg-slate-700/80 rounded-lg p-3 border border-slate-600"
        >
          <p className="text-white">
            {hoveredCell.day} às {hoveredCell.hour}h: <span className="text-purple-400">{hoveredCell.value}%</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
