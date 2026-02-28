import { CheckCircle, XCircle, Plus, ExternalLink, Info, Trash2, ShieldAlert, Lock, RotateCcw, User } from 'lucide-react';
import { CommunitySubmissionDTO, SubmissionStatus, SubmissionType, communitySubmissionsService } from '@/services/community-submissions';
import { useState } from 'react';

interface SubmissionCardProps {
    submission: CommunitySubmissionDTO;
    activeTab: string;
    actionLoading: string | null;
    onStatusChange: (id: string, status: SubmissionStatus) => void;
    onAddResource?: (submission: CommunitySubmissionDTO) => void;
    onSoftDelete?: (id: string) => void;
    onRestore?: (id: string) => void;
    onPermanentDelete?: (id: string) => void;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

const TYPE_ICONS: Record<SubmissionType, string> = {
    feedback: '💬',
    suggestion: '💡',
    resource: '📂',
};

const MODE_COLORS: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50',
    added: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
    spam: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    trash: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800',
};

export function SubmissionCard({
    submission,
    activeTab,
    actionLoading,
    onStatusChange,
    onAddResource,
    onSoftDelete,
    onRestore,
    onPermanentDelete,
    isSelected,
    onSelect
}: SubmissionCardProps) {
    const [notes, setNotes] = useState(submission.admin_notes || '');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const isLocked = submission.status === 'added';
    const isTopContributor = (submission.contributor_count || 0) >= 5;

    const handleSaveNotes = async () => {
        try {
            await communitySubmissionsService.updateNotes(submission.id, notes);
            setIsEditingNotes(false);
        } catch (err) {
            console.error('Failed to save notes', err);
        }
    };

    return (
        <div className={`
            relative rounded-2xl border-2 transition-all group
            ${isSelected
                ? 'border-purple-500 bg-purple-50/30 dark:bg-purple-900/5 ring-4 ring-purple-500/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
            }
            ${isLocked ? 'opacity-90' : ''}
        `}>
            {/* Selection Checkbox (Visible on hover or if selected) */}
            <div className={`
                absolute top-4 -left-3 z-10 transition-opacity
                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect?.(submission.id)}
                    className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-purple-600 focus:ring-purple-500 cursor-pointer shadow-sm transition-transform active:scale-90"
                />
            </div>

            <div className="p-5 space-y-3">
                {/* Type badge + contributor + date */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${MODE_COLORS[submission.status]}`}>
                            <span className="text-xs">{TYPE_ICONS[submission.type]}</span>
                            {submission.type}
                        </span>

                        {isTopContributor && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white animate-pulse">
                                <Plus className="w-2.5 h-2.5" />
                                Top Contributor
                            </span>
                        )}

                        {isLocked && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900 text-white">
                                <Lock className="w-2.5 h-2.5" />
                                Locked
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                        {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Submitter info */}
                {submission.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span className="font-bold">{submission.name || 'Anonymous'}</span>
                        <span className="opacity-60 truncate">({submission.email})</span>
                        {submission.contributor_count && (
                            <span className="ml-auto px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                                {submission.contributor_count} total
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {submission.title}
                    {submission.status === 'spam' && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                </h3>

                {/* Message */}
                {submission.message && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 italic">
                        "{submission.message}"
                    </p>
                )}

                {/* URL */}
                {submission.url && (
                    <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 hover:underline font-bold transition-all bg-purple-50 dark:bg-purple-900/10 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-900/20"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{submission.url}</span>
                    </a>
                )}

                {/* Admin Notes */}
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Admin Notes</span>
                        {!isEditingNotes ? (
                            <button
                                onClick={() => setIsEditingNotes(true)}
                                className="text-[10px] font-bold text-purple-600 hover:underline"
                            >
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleSaveNotes} className="text-[10px] font-bold text-emerald-600 hover:underline">Save</button>
                                <button onClick={() => setIsEditingNotes(false)} className="text-[10px] font-bold text-slate-400 hover:underline">Cancel</button>
                            </div>
                        )}
                    </div>
                    {isEditingNotes ? (
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-20 p-2 text-xs rounded-lg border-2 border-purple-200 dark:border-purple-900/30 bg-white dark:bg-slate-900 focus:border-purple-500 outline-none transition-all"
                            placeholder="Add internal notes..."
                        />
                    ) : (
                        <p className={`text-[11px] ${notes ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 italic'}`}>
                            {notes || 'No admin notes yet.'}
                        </p>
                    )}
                </div>

                {/* Context Origin */}
                {(submission.context_title || submission.context_url) && (
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400">
                        <Info className="w-3 h-3" />
                        <span>Source:</span>
                        {submission.context_url ? (
                            <a href={submission.context_url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline font-bold">
                                {submission.context_title || 'View Page'}
                            </a>
                        ) : (
                            <span className="font-bold">{submission.context_title}</span>
                        )}
                    </div>
                )}

                {/* Actions Footer */}
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                    {/* TRASH VIEW ACTIONS */}
                    {activeTab === 'trash' ? (
                        <>
                            <button
                                onClick={() => onRestore?.(submission.id)}
                                disabled={actionLoading === submission.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 transition-all border border-emerald-100 dark:border-emerald-900/30"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Restore
                            </button>
                            <button
                                onClick={() => onPermanentDelete?.(submission.id)}
                                disabled={actionLoading === submission.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-all border border-red-100 dark:border-red-900/30"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Forever
                            </button>
                        </>
                    ) : (
                        <>
                            {/* STANDARD VIEW ACTIONS */}
                            {!isLocked && (
                                <>
                                    {submission.status !== 'approved' && (
                                        <button
                                            onClick={() => onStatusChange(submission.id, 'approved')}
                                            disabled={actionLoading === submission.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 transition-all border border-emerald-100 dark:border-emerald-900/30"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Approve
                                        </button>
                                    )}
                                    {submission.status !== 'rejected' && (
                                        <button
                                            onClick={() => onStatusChange(submission.id, 'rejected')}
                                            disabled={actionLoading === submission.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400 transition-all border border-slate-100 dark:border-slate-800"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            Reject
                                        </button>
                                    )}
                                    {submission.status !== 'spam' && (
                                        <button
                                            onClick={() => onStatusChange(submission.id, 'spam')}
                                            disabled={actionLoading === submission.id}
                                            className="flex items-center justify-center p-2.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 transition-all border border-amber-100 dark:border-amber-900/30"
                                            title="Mark as Spam"
                                        >
                                            <ShieldAlert className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            )}

                            {submission.type === 'resource' && submission.url && !isLocked && onAddResource && (
                                <button
                                    onClick={() => onAddResource(submission)}
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Convert
                                </button>
                            )}

                            <button
                                onClick={() => onSoftDelete?.(submission.id)}
                                disabled={actionLoading === submission.id}
                                className="flex items-center justify-center p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:bg-slate-900/40 dark:hover:bg-red-900/20 transition-all border border-slate-100 dark:border-slate-800"
                                title="Move to Trash"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
