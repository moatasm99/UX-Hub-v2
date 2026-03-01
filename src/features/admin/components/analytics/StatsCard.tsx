import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
    colorClass?: string;
}

export const StatsCard = memo(function StatsCard({ title, value, icon: Icon, description, colorClass = 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' }: StatsCardProps) {
    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-xl hover:border-[var(--border-strong)] transition-all group shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <h3 className="text-[var(--text-muted)] text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-[var(--text-main)] mt-1 group-hover:text-[var(--accent-primary)] transition-colors">
                    {value}
                </p>
                {description && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
                )}
            </div>
        </div>
    );
});
