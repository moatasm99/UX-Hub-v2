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
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/admin/roadmap" className="hover:text-slate-300 transition-colors">Roadmap</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-300 font-medium">{category?.title || 'Category'}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {category?.title || 'Topics'}
                    </h1>
                    <p className="text-slate-400 mt-1">Manage topics for this roadmap category</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Topic
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                />
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800">
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pos</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {filteredTopics.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No topics found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredTopics.map((topic) => (
                                    <tr key={topic.id} className="group hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <Link to={`/admin/roadmap/${trackId}/${topic.id}`} className="group/link">
                                                <p className="font-medium text-white group-hover/link:text-blue-400 transition-colors flex items-center gap-1.5">
                                                    {topic.title}
                                                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-400 text-sm truncate max-w-[300px]">
                                                {topic.description || <span className="italic text-slate-600">No description</span>}
                                            </p>
                                        </td>
                                        <td className="p-4 text-slate-300 tabular-nums">{topic.position}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(topic)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${topic.is_published
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
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
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(topic)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Topic?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">{topicToDelete?.title}</span>?
                            All resources within this topic will also be deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
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
