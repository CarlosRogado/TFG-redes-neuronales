import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CausaMuerte } from './GameCanvas';

interface PieChartProps {
    data: CausaMuerte[];
}

const COLORS = ['#3b82f6', '#ef4444', '#facc15', '#10b981', '#8b5cf6'];

export default function MuertesPieChart({ data } : PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
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
                        <Cell key={'cell-${index}'} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} itemStyle={{color: '#f8fafc'}}/>
                <Legend wrapperStyle={{ fontSize:'12px', paddingTop:'10px'}}/>
            </PieChart>
        </ResponsiveContainer>

    );
}