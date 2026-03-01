import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    Loader2, ChevronRight, ExternalLink
} from 'lucide-react';
import { useRoadmapTopics } from '@/hooks/use-roadmap-topics';
import { useRoadmapCategories } from '@/hooks/use-roadmap-categories';
import type { RoadmapTopicDTO } from '@/services/roadmap-topics';

// ─── Main Page ────────────────────────────────────────
export default function AdminRoadmapTopicsPage() {
    const { trackId } = useParams<{ trackId: string }>();
    const navigate = useNavigate();
    const { categories, isLoading: catLoading } = useRoadmapCategories();
    const { topics, isLoading, updateTopic, deleteTopic } = useRoadmapTopics(trackId!);

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<RoadmapTopicDTO | null>(null);

    const category = categories.find(c => c.id === trackId);

    const filteredTopics = topics.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => { navigate(`/admin/roadmap/${trackId}/new`); };
    const handleEdit = (topic: RoadmapTopicDTO) => { navigate(`/admin/roadmap/${trackId}/${topic.id}`); };
    const handleDeleteClick = (topic: RoadmapTopicDTO) => {
        setTopicToDelete(topic); setIsDeleteModalOpen(false); // Wait, I need a delete modal or something. The old one was fine.
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (topicToDelete) {
            await deleteTopic.mutateAsync(topicToDelete.id);
            setIsDeleteModalOpen(false);
            setTopicToDelete(null);
        }
    };

    const handleTogglePublish = async (topic: RoadmapTopicDTO) => {
        await updateTopic.mutateAsync({ id: topic.id, is_published: !topic.is_published });
    };

    if (isLoading || catLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-medium">
                <Link to="/admin" className="hover:text-[var(--text-main)] transition-colors">Admin</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/admin/roadmap" className="hover:text-[var(--text-main)] transition-colors">Roadmap</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[var(--text-secondary)] font-bold">{category?.title || 'Category'}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">
                        {category?.title || 'Topics'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage topics for this roadmap category</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Topic
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all placeholder-[var(--text-muted)] font-medium"
                />
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-muted)]/50 border-b border-[var(--border-main)]">
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Description</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Pos</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)] text-sm">
                            {filteredTopics.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                                        No topics found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredTopics.map((topic) => (
                                    <tr key={topic.id} className="group hover:bg-[var(--bg-muted)]/50 transition-colors">
                                        <td className="p-4">
                                            <Link to={`/admin/roadmap/${trackId}/${topic.id}`} className="group/link">
                                                <p className="font-bold text-[var(--text-main)] group-hover/link:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5">
                                                    {topic.title}
                                                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-[var(--text-muted)] text-sm truncate max-w-[300px]">
                                                {topic.description || <span className="italic text-[var(--text-disabled)] font-normal">No description</span>}
                                            </p>
                                        </td>
                                        <td className="p-4 text-[var(--text-secondary)] font-bold tabular-nums">{topic.position}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(topic)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${topic.is_published
                                                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20'
                                                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-main)] hover:bg-[var(--bg-strong)] hover:text-[var(--text-main)]'
                                                    }`}
                                            >
                                                {topic.is_published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {topic.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(topic)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(topic)}
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
            </div>

            {/* Delete Confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Delete Topic?</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6 font-medium">
                            Are you sure you want to delete <span className="text-[var(--text-main)] font-bold">{topicToDelete?.title}</span>?
                            All resources within this topic will also be deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95"
                                disabled={deleteTopic.isPending}
                            >
                                {deleteTopic.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
