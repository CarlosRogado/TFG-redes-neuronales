import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { memo } from 'react';

interface SurvivalData {
    id: string;
    segundos: number;
}

interface BarcharProps {
    data: SurvivalData[];
}

function Barchar({ data }: BarcharProps) {
    return (
        <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                    dataKey="id"
                    stroke="#94a3b8"
                    tick={false}
                    axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="segundos" radius={[4,4,0,0]}>
                    {data.map((entry, index) => (
                        <Cell
                        key={`cell-`+index}
                        fill={entry.segundos > 0 ? '#3b82f6' : '#ef4444'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
export default memo(Barchar);