import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CausaMuerte } from './GameCanvas';
import { memo } from 'react';

interface PieChartProps {
    data: CausaMuerte[];
}

const COLORS = ['oklch(80.8% 0.114 19.571)', 'oklch(83.7% 0.128 66.29)', 'oklch(80.9% 0.105 251.813)', 'oklch(87.1% 0.15 154.449)']; // Rojo, Naranja, Azul, Morado

 function MuertesPieChart({ data } : PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((_, index)=> (
                        <Cell key={'cell-'+index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} itemStyle={{color: '#f8fafc'}}/>
                <Legend wrapperStyle={{ fontSize:'12px', paddingTop:'10px'}}/>
            </PieChart>
        </ResponsiveContainer>

    );
} export default memo(MuertesPieChart);