import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    Loader2, X, Save, Palette, Hash, ExternalLink
} from 'lucide-react';
import { useRoadmapCategories } from '@/hooks/use-roadmap-categories';
import type { RoadmapCategoryDTO, CreateRoadmapCategoryInput } from '@/services/roadmap-categories';

// ─── Slug helper ──────────────────────────────────────
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ─── Category Form Modal ──────────────────────────────
interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: RoadmapCategoryDTO | null;
    isSubmitting?: boolean;
}

function CategoryFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting = false,
}: CategoryFormModalProps) {
    const [formData, setFormData] = useState<CreateRoadmapCategoryInput>({
        title: '',
        slug: '',
        color: '',
        icon: '',
        position: 0,
        is_published: false,
    });
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                slug: initialData.slug,
                color: initialData.color || '',
                icon: initialData.icon || '',
                position: initialData.position,
                is_published: initialData.is_published,
            });
            setSlugManuallyEdited(true);
        } else {
            setFormData({
                title: '',
                slug: '',
                color: '',
                icon: '',
                position: 0,
                is_published: false,
            });
            setSlugManuallyEdited(false);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'title' && !slugManuallyEdited) {
            setFormData(prev => ({ ...prev, title: value, slug: slugify(value) }));
        } else if (name === 'slug') {
            setSlugManuallyEdited(true);
            setFormData(prev => ({ ...prev, slug: value }));
        } else if (name === 'position') {
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
                        {initialData ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title + Slug */}
                    <div className="grid grid-cols-2 gap-6">
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Slug *</label>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="auto-generated-from-title"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Color + Icon */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5" /> Color (Tailwind classes)
                            </label>
                            <input
                                name="color"
                                value={formData.color || ''}
                                onChange={handleChange}
                                placeholder="from-amber-500 to-yellow-600"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Icon (emoji or name)</label>
                            <input
                                name="icon"
                                value={formData.icon || ''}
                                onChange={handleChange}
                                placeholder="🎯 or target"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            />
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
export default function AdminRoadmapPage() {
    const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useRoadmapCategories();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<RoadmapCategoryDTO | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<RoadmapCategoryDTO | null>(null);

    const filteredCategories = categories.filter(cat =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => { setEditingCategory(null); setIsModalOpen(true); };
    const handleEdit = (cat: RoadmapCategoryDTO) => { setEditingCategory(cat); setIsModalOpen(true); };
    const handleDeleteClick = (cat: RoadmapCategoryDTO) => { setCategoryToDelete(cat); setIsDeleteModalOpen(true); };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            await deleteCategory.mutateAsync(categoryToDelete.id);
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingCategory) {
                await updateCategory.mutateAsync(data);
            } else {
                await createCategory.mutateAsync(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleTogglePublish = async (cat: RoadmapCategoryDTO) => {
        await updateCategory.mutateAsync({ id: cat.id, is_published: !cat.is_published });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Roadmap Categories</h1>
                    <p className="text-slate-400 mt-1">Manage roadmap sections and their ordering</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search categories..."
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
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Color</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Icon</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pos</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        No categories found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="group hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <Link to={`/admin/roadmap/${cat.id}`} className="group/link">
                                                <p className="font-medium text-white group-hover/link:text-blue-400 transition-colors flex items-center gap-1.5">
                                                    {cat.title}
                                                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </p>
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <code className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{cat.slug}</code>
                                        </td>
                                        <td className="p-4">
                                            {cat.color ? (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded bg-gradient-to-r ${cat.color}`} />
                                                    <span className="text-xs text-slate-500 font-mono truncate max-w-[120px]">{cat.color}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 italic">None</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-lg">{cat.icon || <span className="text-slate-600 italic text-sm">—</span>}</td>
                                        <td className="p-4 text-slate-300 tabular-nums">{cat.position}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(cat)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${cat.is_published
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                                                    }`}
                                            >
                                                {cat.is_published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {cat.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
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
            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingCategory}
                isSubmitting={createCategory.isPending || updateCategory.isPending}
            />

            {/* Delete Confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Category?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">{categoryToDelete?.title}</span>?
                            All topics within this category will also be deleted.
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
                                disabled={deleteCategory.isPending}
                            >
                                {deleteCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
