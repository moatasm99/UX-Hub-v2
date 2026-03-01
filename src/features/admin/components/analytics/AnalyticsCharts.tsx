import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DistributionProps {
    data: { name: string; value: number }[];
    title: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'];

export const LevelDistributionChart = memo(function LevelDistributionChart({ data, title }: DistributionProps) {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-xl h-[400px] flex flex-col shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-6">{title}</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="var(--text-muted)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-main)',
                                color: 'var(--text-main)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-main)',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'var(--accent-primary)' }}
                        />
                        <Bar dataKey="value" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export const LessonTypeChart = memo(function LessonTypeChart({ data, title }: DistributionProps) {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-xl h-[400px] flex flex-col shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-6">{title}</h3>
            <div className="flex-1 min-h-0">
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
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-main)',
                                color: 'var(--text-main)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-main)',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});
