import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
    colorClass?: string;
}

export const StatsCard = memo(function StatsCard({ title, value, icon: Icon, description, colorClass = 'text-blue-400 bg-blue-500/10' }: StatsCardProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                    {value}
                </p>
                {description && (
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
});
