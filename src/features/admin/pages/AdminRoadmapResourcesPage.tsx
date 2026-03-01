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
    Video: 'bg-[var(--accent-rose)]/10 text-[var(--accent-rose)] border-[var(--accent-rose)]/20',
    Article: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20',
    Book: 'bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] border-[var(--accent-indigo)]/20',
    Podcast: 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border-[var(--accent-emerald)]/20',
    Course: 'bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border-[var(--accent-amber)]/20',
    Tool: 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-main)]">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">
                        {initialData ? 'Edit Resource' : 'Add New Resource'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-muted)] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">Title *</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-medium"
                            required
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">URL *</label>
                        <input
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] font-mono text-sm focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Type + Label */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--text-muted)]">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-bold"
                            >
                                {RESOURCE_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Position */}
                    <div className="max-w-[200px] space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5" /> Position
                        </label>
                        <input
                            name="position"
                            type="number"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-bold"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--border-main)]">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_published ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-strong)]'}`}
                                onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-bold text-[var(--text-secondary)]">
                                {formData.is_published ? 'Published' : 'Draft'}
                            </span>
                        </label>

                        <div className="flex items-center gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
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
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] flex-wrap font-medium">
                <Link to="/admin" className="hover:text-[var(--text-main)] transition-colors">Admin</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <Link to="/admin/roadmap" className="hover:text-[var(--text-main)] transition-colors">Roadmap</Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <Link to={`/admin/roadmap/${trackId}`} className="hover:text-[var(--text-main)] transition-colors">
                    {category?.title || 'Category'}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[var(--text-secondary)] font-bold">{topic?.title || 'Topic'}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">
                        {topic?.title || 'Resources'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage resources for this topic</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Resource
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                    type="text"
                    placeholder="Search resources..."
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
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Label</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">URL</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Pos</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)] text-sm">
                            {filteredResources.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                                        No resources found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredResources.map((res) => (
                                    <tr key={res.id} className="group hover:bg-[var(--bg-muted)]/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-[var(--text-main)] max-w-[250px] truncate">{res.title}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${TYPE_COLORS[res.type] || 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-main)]'}`}>
                                                {res.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[var(--text-disabled)] text-sm">—</span>
                                        </td>
                                        <td className="p-4">
                                            <a
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--accent-primary)] hover:opacity-80 transition-opacity inline-flex items-center gap-1 font-bold"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span className="text-xs font-mono truncate max-w-[150px]">
                                                    {res.url.replace(/^https?:\/\//, '').split('/')[0]}
                                                </span>
                                            </a>
                                        </td>
                                        <td className="p-4 text-[var(--text-secondary)] font-bold tabular-nums">{res.position}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(res)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${res.is_published
                                                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20'
                                                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-main)] hover:bg-[var(--bg-strong)] hover:text-[var(--text-main)]'
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
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(res)}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Delete Resource?</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6 font-medium">
                            Are you sure you want to delete <span className="text-[var(--text-main)] font-bold">{resourceToDelete?.title}</span>?
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
