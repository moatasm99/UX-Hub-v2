import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useRoadmapTracks } from '@/hooks/use-roadmap-tracks';
import type { RoadmapTrackDTO, CreateRoadmapTrackInput, UpdateRoadmapTrackInput } from '@/services/roadmap-tracks';
import AdminTrackModal from '@/features/admin/components/AdminTrackModal';

export default function AdminRoadmapTracksPage() {
    const { tracks, isLoading, isError, error, create, update, remove } = useRoadmapTracks();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<RoadmapTrackDTO | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<RoadmapTrackDTO | null>(null);
    const [search, setSearch] = useState('');

    const handleCreate = () => { setEditing(null); setModalOpen(true); };
    const handleEdit = (track: RoadmapTrackDTO) => { setEditing(track); setModalOpen(true); };
    const handleDeleteClick = (track: RoadmapTrackDTO) => setDeleteTarget(track);

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await remove.mutateAsync(deleteTarget.id);
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (data.id) {
                await update.mutateAsync(data as UpdateRoadmapTrackInput);
            } else {
                await create.mutateAsync(data as CreateRoadmapTrackInput);
            }
            setModalOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = tracks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Roadmap Tracks</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">{tracks.length} total tracks</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Track
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search tracks..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all placeholder:[var(--text-muted)] font-medium"
                />
            </div>

            {/* Loading / Error */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[var(--accent-primary)] animate-spin" />
                </div>
            )}
            {isError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm font-bold shadow-sm">
                    ⚠️ Failed to load tracks: {(error as any)?.message || 'Unknown error'}
                </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[var(--border-main)] bg-[var(--bg-muted)]/50 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-center">Position</th>
                                <th className="px-6 py-4 text-center">Published</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm font-medium">
                                        {search ? 'No tracks match your search.' : 'No tracks yet. Click "Add Track" to create one.'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(track => (
                                    <tr key={track.id} className="group hover:bg-[var(--bg-muted)]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                to={track.id}
                                                className="flex items-center gap-2 text-[var(--text-main)] font-bold hover:text-[var(--accent-primary)] transition-colors"
                                            >
                                                {track.icon && <span className="text-lg">{track.icon}</span>}
                                                {track.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-[var(--text-muted)]">{track.slug}</td>
                                        <td className="px-6 py-4 text-center text-[var(--text-secondary)] font-bold">{track.position}</td>
                                        <td className="px-6 py-4 text-center">
                                            {track.is_published ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-emerald)] bg-[var(--accent-emerald)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-emerald)]/20">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full border border-[var(--border-main)]">
                                                    <XCircle className="w-3 h-3" />
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(track)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(track)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Track Modal */}
            <AdminTrackModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editing}
                isSubmitting={submitting}
            />

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Delete Track</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">
                            Are you sure you want to delete <span className="font-bold text-[var(--text-main)]">"{deleteTarget.title}"</span>? This will also delete all topics and resources under it.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={remove.isPending}
                                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {remove.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
