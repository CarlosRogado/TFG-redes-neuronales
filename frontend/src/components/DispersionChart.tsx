import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {memo} from 'react';

export type DispersionData = {
  id: string;
  pesoX: number;
  pesoY: number;
  isCloned?: boolean;
};

interface DispersionChartProps {
  data: DispersionData[];
}

function DispersionChart({ data }: DispersionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250} minHeight={250}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        
        {/* Eje X y Y con dominio automático para que se autoajuste */}
        <XAxis type="number" dataKey="pesoX" name="Capa 1" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis type="number" dataKey="pesoY" name="Capa 2" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }} 
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
        />
        
        <Scatter name="Cohetes" data={data}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isCloned ? '#10b981' : '#8b5cf6'} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
} export default memo(DispersionChart);