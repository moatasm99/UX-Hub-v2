import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, Trash2, ShieldAlert, CheckCircle2, XCircle, MoreVertical, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communitySubmissionsService, CommunitySubmissionDTO, SubmissionStatus, SubmissionType, ModerationStats } from '@/services/community-submissions';
import { SubmissionCard } from './SubmissionCard';
import { ModerationStatsBar } from './ModerationStatsBar';

interface Props {
    type: SubmissionType;
    title: string;
    description: string;
    onAddResource?: (submission: CommunitySubmissionDTO) => void;
}

export function SubmissionPageTemplate({ type, title, description, onAddResource }: Props) {
    const [activeTab, setActiveTab] = useState<string>('pending');
    const [submissions, setSubmissions] = useState<CommunitySubmissionDTO[]>([]);
    const [stats, setStats] = useState<ModerationStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const loadStats = async () => {
        try {
            const data = await communitySubmissionsService.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const loadSubmissions = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            const lastItem = isLoadMore ? submissions[submissions.length - 1] : null;
            const data = await communitySubmissionsService.list({
                type,
                status: activeTab === 'trash' ? undefined : (activeTab as SubmissionStatus),
                isDeleted: activeTab === 'trash',
                lastCreatedAt: lastItem?.created_at,
                limit: 20
            });

            if (isLoadMore) {
                setSubmissions(prev => [...prev, ...data]);
            } else {
                setSubmissions(data);
            }

            setHasMore(data.length === 20);
        } catch (err) {
            console.error('Failed to load submissions:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeTab, type, submissions.length]);

    useEffect(() => {
        loadSubmissions();
        loadStats();
    }, [activeTab, type]);

    // --- Actions ---

    const handleStatusChange = async (id: string, status: SubmissionStatus) => {
        setActionLoading(id);
        try {
            await communitySubmissionsService.bulkUpdateStatus([id], status);
            setSubmissions(prev => prev.filter(s => s.id !== id));
            loadStats();
        } catch {
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSoftDelete = async (id: string) => {
        setActionLoading(id);
        try {
            await communitySubmissionsService.setDeleted([id], true);
            setSubmissions(prev => prev.filter(s => s.id !== id));
            loadStats();
        } finally {
            setActionLoading(null);
        }
    };

    const handleRestore = async (id: string) => {
        setActionLoading(id);
        try {
            await communitySubmissionsService.setDeleted([id], false);
            setSubmissions(prev => prev.filter(s => s.id !== id));
            loadStats();
        } finally {
            setActionLoading(null);
        }
    };

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('Are you sure? This is permanent.')) return;
        setActionLoading(id);
        try {
            await communitySubmissionsService.permanentlyDelete([id]);
            setSubmissions(prev => prev.filter(s => s.id !== id));
            loadStats();
        } finally {
            setActionLoading(null);
        }
    };

    // --- Bulk Actions ---

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleBulkStatus = async (status: SubmissionStatus) => {
        if (selectedIds.length === 0) return;
        try {
            await communitySubmissionsService.bulkUpdateStatus(selectedIds, status);
            setSubmissions(prev => prev.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            loadStats();
        } catch (err) {
            alert('Bulk update failed');
        }
    };

    const handleBulkTrash = async () => {
        if (selectedIds.length === 0) return;
        try {
            await communitySubmissionsService.setDeleted(selectedIds, activeTab !== 'trash');
            setSubmissions(prev => prev.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            loadStats();
        } catch (err) {
            alert('Bulk action failed');
        }
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
                        <p className="text-sm font-medium text-slate-500">{description}</p>
                    </div>
                </div>
            </div>

            {/* Stats & Tabs Navigation */}
            <ModerationStatsBar
                stats={stats}
                currentTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setSubmissions([]);
                    setSelectedIds([]);
                }}
            />

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse rounded-full" />
                    </div>
                    <p className="text-slate-400 font-bold animate-pulse">Fetching submissions...</p>
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-32 border-4 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[40px] bg-slate-50/30 dark:bg-slate-900/10">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <MoreVertical className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-slate-400 text-xl font-bold italic">No entries found in {activeTab}</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {submissions.map(sub => (
                            <SubmissionCard
                                key={sub.id}
                                submission={sub}
                                activeTab={activeTab}
                                actionLoading={actionLoading}
                                onStatusChange={handleStatusChange}
                                onAddResource={onAddResource}
                                onSoftDelete={handleSoftDelete}
                                onRestore={handleRestore}
                                onPermanentDelete={handlePermanentDelete}
                                isSelected={selectedIds.includes(sub.id)}
                                onSelect={toggleSelect}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {hasMore && (
                        <div className="flex justify-center pt-8">
                            <button
                                onClick={() => loadSubmissions(true)}
                                disabled={loadingMore}
                                className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 font-black text-slate-600 dark:text-slate-400 hover:border-purple-500 hover:text-purple-500 transition-all disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading...
                                    </div>
                                ) : 'Load More Submissions'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Bulk Actions Floating Toolbar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-[fadeInUp_0.3s_ease-out]">
                    <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col border-r border-slate-700 pr-4 mr-2">
                            <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Bulk Actions</span>
                            <span className="text-lg font-black text-white">{selectedIds.length} Selected</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {activeTab === 'trash' ? (
                                <>
                                    <button onClick={() => handleBulkTrash()} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all">
                                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleBulkStatus('approved')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                    </button>
                                    <button onClick={() => handleBulkStatus('rejected')} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600 transition-all">
                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                    </button>
                                    <button onClick={() => handleBulkStatus('spam')} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 transition-all">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Spam
                                    </button>
                                    <button onClick={() => handleBulkTrash()} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-500 transition-all">
                                        <Trash2 className="w-3.5 h-3.5" /> Trash
                                    </button>
                                </>
                            )}
                            <button onClick={() => setSelectedIds([])} className="ml-4 text-xs font-bold text-slate-400 hover:text-white transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
