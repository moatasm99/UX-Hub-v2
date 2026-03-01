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
    pending: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    added: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20',
    spam: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    trash: 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-main)]',
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
            relative rounded-2xl border transition-all group shadow-sm
            ${isSelected
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 ring-4 ring-[var(--accent-primary)]/10'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
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
                    className="w-6 h-6 rounded-lg border-2 border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer shadow-md transition-transform active:scale-90"
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
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--text-main)] text-[var(--bg-card)]">
                                <Lock className="w-2.5 h-2.5" />
                                Locked
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-medium">
                        {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Submitter info */}
                {submission.email && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <User className="w-3 h-3" />
                        <span className="font-bold text-[var(--text-secondary)]">{submission.name || 'Anonymous'}</span>
                        <span className="opacity-60 truncate">({submission.email})</span>
                        {submission.contributor_count && (
                            <span className="ml-auto px-1.5 py-0.5 rounded-md bg-[var(--bg-muted)] text-[10px] font-bold">
                                {submission.contributor_count} total
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="font-bold text-[var(--text-main)] flex items-center gap-2">
                    {submission.title}
                    {submission.status === 'spam' && <ShieldAlert className="w-4 h-4 text-amber-500" />}
                </h3>

                {/* Message */}
                {submission.message && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed bg-[var(--bg-muted)]/50 p-3 rounded-xl border border-[var(--border-main)] italic">
                        "{submission.message}"
                    </p>
                )}

                {/* URL */}
                {submission.url && (
                    <a
                        href={submission.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-[var(--accent-primary)] hover:underline font-bold transition-all bg-[var(--accent-primary)]/10 px-3 py-1.5 rounded-lg border border-[var(--accent-primary)]/20"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{submission.url}</span>
                    </a>
                )}

                {/* Admin Notes */}
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Admin Notes</span>
                        {!isEditingNotes ? (
                            <button
                                onClick={() => setIsEditingNotes(true)}
                                className="text-[10px] font-bold text-[var(--accent-primary)] hover:underline"
                            >
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleSaveNotes} className="text-[10px] font-bold text-emerald-600 hover:underline">Save</button>
                                <button onClick={() => setIsEditingNotes(false)} className="text-[10px] font-bold text-[var(--text-muted)] hover:underline">Cancel</button>
                            </div>
                        )}
                    </div>
                    {isEditingNotes ? (
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-20 p-2 text-xs rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] focus:border-[var(--accent-primary)] outline-none transition-all text-[var(--text-main)]"
                            placeholder="Add internal notes..."
                        />
                    ) : (
                        <p className={`text-[11px] ${notes ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)] italic'}`}>
                            {notes || 'No admin notes yet.'}
                        </p>
                    )}
                </div>

                {/* Context Origin */}
                {(submission.context_title || submission.context_url) && (
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                        <Info className="w-3 h-3" />
                        <span>Source:</span>
                        {submission.context_url ? (
                            <a href={submission.context_url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline font-bold">
                                {submission.context_title || 'View Page'}
                            </a>
                        ) : (
                            <span className="font-bold">{submission.context_title}</span>
                        )}
                    </div>
                )}

                {/* Actions Footer */}
                <div className="flex gap-2 pt-4 border-t border-[var(--border-main)]">
                    {/* TRASH VIEW ACTIONS */}
                    {activeTab === 'trash' ? (
                        <>
                            <button
                                onClick={() => onRestore?.(submission.id)}
                                disabled={actionLoading === submission.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Restore
                            </button>
                            <button
                                onClick={() => onPermanentDelete?.(submission.id)}
                                disabled={actionLoading === submission.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all border border-red-500/20"
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
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Approve
                                        </button>
                                    )}
                                    {submission.status !== 'rejected' && (
                                        <button
                                            onClick={() => onStatusChange(submission.id, 'rejected')}
                                            disabled={actionLoading === submission.id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--border-main)] transition-all border border-[var(--border-main)]"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            Reject
                                        </button>
                                    )}
                                    {submission.status !== 'spam' && (
                                        <button
                                            onClick={() => onStatusChange(submission.id, 'spam')}
                                            disabled={actionLoading === submission.id}
                                            className="flex items-center justify-center p-2.5 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-all border border-amber-500/20"
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
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-black bg-[var(--accent-primary)] text-white hover:opacity-90 shadow-lg shadow-[var(--accent-primary)]/20 transition-all ml-auto hover:scale-105 active:scale-95"
                                >
                                    <Plus className="w-4 h-4" />
                                    Convert
                                </button>
                            )}

                            <button
                                onClick={() => onSoftDelete?.(submission.id)}
                                disabled={actionLoading === submission.id}
                                className="flex items-center justify-center p-2.5 rounded-xl bg-[var(--bg-muted)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-all border border-[var(--border-main)]"
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
