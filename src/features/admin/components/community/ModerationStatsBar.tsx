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
        { id: 'added', label: 'Added', icon: PlusCircle, count: stats.added, color: 'purple' },
        { id: 'spam', label: 'Spam', icon: ShieldAlert, count: stats.spam, color: 'amber' },
        { id: 'trash', label: 'Trash', icon: Trash2, count: stats.trash, color: 'slate' },
    ];

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
                            flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition-all
                            ${isActive
                                ? `border-${tab.color}-500 bg-${tab.color}-50 dark:bg-${tab.color}-900/10 text-${tab.color}-700 dark:text-${tab.color}-400 shadow-lg shadow-${tab.color}-500/10`
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                            }
                        `}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
                        <span className={`
                            px-2 py-0.5 rounded-lg text-xs font-black
                            ${isActive
                                ? `bg-${tab.color}-500 text-white`
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }
                        `}>
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
