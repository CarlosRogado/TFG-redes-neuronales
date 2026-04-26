import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { memo } from 'react';

interface EvolutionData {
    generacion: number;
    maxSegundos: number;
    mediaSegundos: number;
}

interface LineChartProps {
    data: EvolutionData[];
}

 function EvolutionLineChart({ data }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false}/>
                <XAxis
                    dataKey="generacion"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12}}
                />
                <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 12}}
                    tickMargin={10}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor:'#475569', color: '#f8fafc' }}
                    itemStyle={{ color:'#f8fafc'}}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                    type="monotone"
                    dataKey="maxSegundos"
                    name="Mejor tiempo"
                    stroke="#10b981"
                    dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                    activeDot={{ r:5}}
                />
                <Line
                    type="monotone"
                    dataKey="mediaSegundos"
                    name="Tiempo medio"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 2, fill: '#3b82f6', strokeWidth: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
} export default memo(EvolutionLineChart);