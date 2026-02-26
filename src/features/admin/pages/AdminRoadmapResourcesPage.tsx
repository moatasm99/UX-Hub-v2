import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    Loader2, X, Save, Hash, ChevronRight, ExternalLink
} from 'lucide-react';
import { useRoadmapResources } from '@/hooks/use-roadmap-resources';
import { useRoadmapTopics } from '@/hooks/use-roadmap-topics';
import { useRoadmapCategories } from '@/hooks/use-roadmap-categories';
import {
    RESOURCE_TYPES,
    type RoadmapResourceDTO,
    type CreateRoadmapResourceInput,
    type ResourceType,
} from '@/services/roadmap-resources';

// ─── Type badge colors ────────────────────────────────
const TYPE_COLORS: Record<ResourceType, string> = {
    Video: 'bg-red-500/10 text-red-400 border-red-500/20',
    Article: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Book: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Podcast: 'bg-green-500/10 text-green-400 border-green-500/20',
    Course: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Tool: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

// ─── Resource Form Modal ──────────────────────────────
interface ResourceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: RoadmapResourceDTO | null;
    isSubmitting?: boolean;
    topicId: string;
}

function ResourceFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting = false,
    topicId,
}: ResourceFormModalProps) {
    const [formData, setFormData] = useState<CreateRoadmapResourceInput>({
        topic_id: topicId,
        title: '',
        url: '',
        type: 'Video',
        position: 0,
        is_published: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                topic_id: topicId,
                title: initialData.title,
                url: initialData.url,
                type: initialData.type,
                position: initialData.position,
                is_published: initialData.is_published,
            });
        } else {
            setFormData({
                topic_id: topicId,
                title: '',
                url: '',
                type: 'Video',
                position: 0,
                is_published: false,
            });
        }
    }, [initialData, isOpen, topicId]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'position') {
            setFormData(prev => ({ ...prev, position: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">URL *</label>
                        <input
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Type + Label */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            >
                                {RESOURCE_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Position */}
                    <div className="max-w-[200px] space-y-2">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5" /> Position
                        </label>
                        <input
                            name="position"
                            type="number"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_published ? 'bg-blue-600' : 'bg-slate-700'}`}
                                onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-300">
                                {formData.is_published ? 'Published' : 'Draft'}
                            </span>
                        </label>

                        <div className="flex items-center gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {initialData ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────
export default function AdminRoadmapResourcesPage() {
    const { trackId, topicId } = useParams<{ trackId: string; topicId: string }>();
    const { categories, isLoading: catLoading } = useRoadmapCategories();
    const { topics, isLoading: topicLoading } = useRoadmapTopics(trackId!);
    const { resources, isLoading, createResource, updateResource, deleteResource } = useRoadmapResources(topicId!);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<RoadmapResourceDTO | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<RoadmapResourceDTO | null>(null);

    const category = categories.find(c => c.id === trackId);
    const topic = topics.find(t => t.id === topicId);

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => { setEditingResource(null); setIsModalOpen(true); };
    const handleEdit = (res: RoadmapResourceDTO) => { setEditingResource(res); setIsModalOpen(true); };
    const handleDeleteClick = (res: RoadmapResourceDTO) => { setResourceToDelete(res); setIsDeleteModalOpen(true); };

    const handleConfirmDelete = async () => {
        if (resourceToDelete) {
            await deleteResource.mutateAsync(resourceToDelete.id);
            setIsDeleteModalOpen(false);
            setResourceToDelete(null);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingResource) {
                await updateResource.mutateAsync(data);
            } else {
                await createResource.mutateAsync(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save resource:', error);
        }
    };

    const handleTogglePublish = async (res: RoadmapResourceDTO) => {
        await updateResource.mutateAsync({ id: res.id, is_published: !res.is_published });
    };

    if (isLoading || catLoading || topicLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                <Link to="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <Link to="/admin/roadmap" className="hover:text-slate-300 transition-colors">Roadmap</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <Link to={`/admin/roadmap/${trackId}`} className="hover:text-slate-300 transition-colors">
                    {category?.title || 'Category'}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="text-slate-300 font-medium">{topic?.title || 'Topic'}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {topic?.title || 'Resources'}
                    </h1>
                    <p className="text-slate-400 mt-1">Manage resources for this topic</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Resource
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search resources..."
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
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Label</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">URL</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pos</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        No resources found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredResources.map((res) => (
                                    <tr key={res.id} className="group hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-white max-w-[250px] truncate">{res.title}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TYPE_COLORS[res.type] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                                {res.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-slate-400 text-sm">—</span>
                                        </td>
                                        <td className="p-4">
                                            <a
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span className="text-xs font-mono truncate max-w-[150px]">
                                                    {res.url.replace(/^https?:\/\//, '').split('/')[0]}
                                                </span>
                                            </a>
                                        </td>
                                        <td className="p-4 text-slate-300 tabular-nums">{res.position}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(res)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${res.is_published
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                                                    }`}
                                            >
                                                {res.is_published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {res.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(res)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(res)}
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

            {/* Form Modal */}
            <ResourceFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingResource}
                isSubmitting={createResource.isPending || updateResource.isPending}
                topicId={topicId!}
            />

            {/* Delete Confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Resource?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">{resourceToDelete?.title}</span>?
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
                                disabled={deleteResource.isPending}
                            >
                                {deleteResource.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
