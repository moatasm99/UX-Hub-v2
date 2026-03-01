import { MessageSquare, CheckCircle2, XCircle, ShieldAlert, Trash2, PlusCircle } from 'lucide-react';
import { ModerationStats } from '@/services/community-submissions';

interface ModerationStatsBarProps {
    stats: ModerationStats | null;
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function ModerationStatsBar({ stats, currentTab, onTabChange }: ModerationStatsBarProps) {
    if (!stats) return null;

    const tabs = [
        { id: 'pending', label: 'Pending', icon: MessageSquare, count: stats.pending, color: 'blue' },
        { id: 'approved', label: 'Approved', icon: CheckCircle2, count: stats.approved, color: 'emerald' },
        { id: 'rejected', label: 'Rejected', icon: XCircle, count: stats.rejected, color: 'red' },
        { id: 'added', label: 'Added', icon: PlusCircle, count: stats.added, color: 'indigo' },
        { id: 'spam', label: 'Spam', icon: ShieldAlert, count: stats.spam, color: 'amber' },
        { id: 'trash', label: 'Trash', icon: Trash2, count: stats.trash, color: 'slate' },
    ];

    const getColorClasses = (color: string, isActive: boolean) => {
        if (!isActive) return 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--accent-primary)]/30 hover:text-[var(--text-main)]';

        const colors: Record<string, string> = {
            blue: 'border-blue-500 bg-blue-500/10 text-blue-600 shadow-blue-500/10',
            emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-emerald-500/10',
            red: 'border-red-500 bg-red-500/10 text-red-600 shadow-red-500/10',
            indigo: 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-[var(--accent-primary)]/10',
            amber: 'border-amber-500 bg-amber-500/10 text-amber-600 shadow-amber-500/10',
            slate: 'border-[var(--border-strong)] bg-[var(--bg-muted)] text-[var(--text-main)] shadow-sm',
        };
        return colors[color] || colors.blue;
    };

    const getBadgeClasses = (color: string, isActive: boolean) => {
        if (!isActive) return 'bg-[var(--bg-muted)] text-[var(--text-muted)]';

        const colors: Record<string, string> = {
            blue: 'bg-blue-600 text-white',
            emerald: 'bg-emerald-600 text-white',
            red: 'bg-red-600 text-white',
            indigo: 'bg-[var(--accent-primary)] text-white',
            amber: 'bg-amber-600 text-white',
            slate: 'bg-[var(--text-muted)] text-[var(--bg-card)]',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition-all shadow-sm
                            ${getColorClasses(tab.color, isActive)}
                            ${isActive ? 'shadow-lg' : ''}
                        `}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
                        <span className={`
                            px-2 py-0.5 rounded-lg text-xs font-black
                            ${getBadgeClasses(tab.color, isActive)}
                        `}>
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
