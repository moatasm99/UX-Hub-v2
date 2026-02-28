import { CheckCircle, XCircle, Plus, ExternalLink, Info } from 'lucide-react';
import { CommunitySubmissionDTO, SubmissionStatus, SubmissionType } from '@/services/community-submissions';

interface SubmissionCardProps {
    submission: CommunitySubmissionDTO;
    activeTab: SubmissionStatus;
    actionLoading: string | null;
    onStatusChange: (id: string, status: SubmissionStatus) => void;
    onAddResource?: (submission: CommunitySubmissionDTO) => void;
}

const TYPE_ICONS: Record<SubmissionType, string> = {
    feedback: '💬',
    suggestion: '💡',
    resource: '📂',
};

const TYPE_COLORS: Record<SubmissionType, string> = {
    feedback: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    suggestion: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    resource: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export function SubmissionCard({
    submission,
    activeTab,
    actionLoading,
    onStatusChange,
    onAddResource
}: SubmissionCardProps) {
    return (
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-600">
            {/* Type badge + date */}
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${TYPE_COLORS[submission.type]}`}>
                    <span className="text-[10px]">{TYPE_ICONS[submission.type]}</span>
                    {submission.type}
                </span>
                <span className="text-xs text-slate-400">
                    {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-900 dark:text-white">{submission.title}</h3>

            {/* Message */}
            {submission.message && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {submission.message}
                </p>
            )}

            {/* URL */}
            {submission.url && (
                <a
                    href={submission.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400 hover:underline truncate max-w-full"
                >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-xs">{submission.url}</span>
                </a>
            )}

            {/* Context Origin */}
            {(submission.context_title || submission.context_url) && (
                <div className="pt-2 mt-1 border-t border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        <Info className="w-3 h-3" />
                        Originated from
                    </div>
                    {submission.context_url ? (
                        <a
                            href={submission.context_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-purple-500 hover:underline flex items-center gap-1 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            {submission.context_title || 'Link'}
                        </a>
                    ) : (
                        <span className="text-xs text-slate-500">{submission.context_title}</span>
                    )}
                </div>
            )}

            {/* Actions */}
            {activeTab === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={() => onStatusChange(submission.id, 'approved')}
                        disabled={actionLoading === submission.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                    </button>
                    <button
                        onClick={() => onStatusChange(submission.id, 'rejected')}
                        disabled={actionLoading === submission.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                    </button>
                    {submission.type === 'resource' && submission.url && onAddResource && (
                        <button
                            onClick={() => onAddResource(submission)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
