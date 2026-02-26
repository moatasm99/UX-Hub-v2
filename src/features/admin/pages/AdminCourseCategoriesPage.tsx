import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    Loader2, X, Save, ExternalLink, FolderOpen
} from 'lucide-react';
import { useCourseCategories } from '@/hooks/use-course-categories';
import type { CourseCategoryDTO, CreateCourseCategoryInput } from '@/services/course-categories';

// ─── Form Modal ───────────────────────────────────────
function CategoryFormModal({
    isOpen, onClose, onSubmit, initialData, isSubmitting = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: CourseCategoryDTO | null;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        position: initialData?.position ?? 0,
        is_published: initialData?.is_published ?? false,
    });

    // Reset when modal opens
    useState(() => {
        setForm({
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            position: initialData?.position ?? 0,
            is_published: initialData?.is_published ?? false,
        });
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(initialData ? { ...form, id: initialData.id } : form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Title *</label>
                        <input
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Position</label>
                        <input
                            type="number"
                            value={form.position}
                            onChange={e => setForm(p => ({ ...p, position: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${form.is_published ? 'bg-blue-600' : 'bg-slate-700'}`}
                                onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${form.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-300">
                                {form.is_published ? 'Published' : 'Draft'}
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
export default function AdminCourseCategoriesPage() {
    const { categories, isLoading, create, update, remove } = useCourseCategories();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CourseCategoryDTO | null>(null);
    const [deleting, setDeleting] = useState<CourseCategoryDTO | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const filtered = categories.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => { setEditing(null); setModalOpen(true); };
    const handleEdit = (cat: CourseCategoryDTO) => { setEditing(cat); setModalOpen(true); };

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (data.id) {
                await update.mutateAsync(data);
            } else {
                await create.mutateAsync(data as CreateCourseCategoryInput);
            }
            setModalOpen(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleting) return;
        await remove.mutateAsync(deleting.id);
        setDeleting(null);
    };

    const handleTogglePublish = (cat: CourseCategoryDTO) => {
        update.mutate({ id: cat.id, is_published: !cat.is_published });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FolderOpen className="w-7 h-7 text-blue-400" />
                        Course Categories
                    </h1>
                    <p className="text-slate-400 mt-1">Manage intensive course categories</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    {search ? 'No categories match your search.' : 'No categories yet. Create your first one!'}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Position</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(cat => (
                                <tr key={cat.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/admin/courses/${cat.id}`}
                                            className="text-white font-medium hover:text-blue-400 transition-colors flex items-center gap-2"
                                        >
                                            {cat.title}
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                                        </Link>
                                        {cat.description && (
                                            <p className="text-slate-500 text-sm mt-0.5 truncate max-w-xs">{cat.description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded">{cat.slug}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-400">{cat.position}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleTogglePublish(cat)} className="inline-flex items-center gap-1.5 transition-colors">
                                            {cat.is_published ? (
                                                <span className="flex items-center gap-1.5 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Published</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-slate-500 text-sm"><XCircle className="w-4 h-4" /> Draft</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(cat)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleting(cat)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            <CategoryFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editing}
                isSubmitting={submitting}
            />

            {/* Delete Confirmation */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white">Delete Category</h3>
                        <p className="text-slate-400">
                            Delete <span className="text-white font-medium">"{deleting.title}"</span>?
                            All courses, days, lessons, and tasks inside will also be deleted.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setDeleting(null)} className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
