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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-main)] bg-[var(--bg-muted)]/30">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">
                        {initialData ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-muted)] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">Title *</label>
                        <input
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-bold placeholder-[var(--text-muted)]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            rows={3}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all resize-none font-medium placeholder-[var(--text-muted)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">Position</label>
                        <input
                            type="number"
                            value={form.position}
                            onChange={e => setForm(p => ({ ...p, position: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-bold tabular-nums"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-[var(--border-main)]">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${form.is_published ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-main)]'}`}
                                onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${form.is_published ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                            </div>
                            <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                                {form.is_published ? 'Published' : 'Draft'}
                            </span>
                        </label>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
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
                    <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <FolderOpen className="w-7 h-7 text-[var(--accent-primary)]" />
                        Course Categories
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage intensive course categories</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-main)] placeholder:[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-medium"
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)] font-medium">
                    {search ? 'No categories match your search.' : 'No categories yet. Create your first one!'}
                </div>
            ) : (
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-main)] bg-[var(--bg-muted)]/50 text-left">
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Position</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)]">
                            {filtered.map(cat => (
                                <tr key={cat.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/admin/courses/${cat.id}`}
                                            className="text-[var(--text-main)] font-bold hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2"
                                        >
                                            {cat.title}
                                            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                        </Link>
                                        {cat.description && (
                                            <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate max-w-xs font-medium">{cat.description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold tabular-nums bg-[var(--bg-muted)] border border-[var(--border-main)] px-2.5 py-1 rounded-full uppercase tracking-wider">{cat.slug}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-[var(--text-secondary)] font-bold tabular-nums">{cat.position}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleTogglePublish(cat)} className="inline-flex items-center gap-1.5 transition-colors">
                                            {cat.is_published ? (
                                                <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-4 h-4" /> Published</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider"><XCircle className="w-4 h-4" /> Draft</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(cat)} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleting(cat)} className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Delete Category</h3>
                        <p className="text-[var(--text-muted)] font-medium">
                            Delete <span className="text-[var(--text-main)] font-bold">"{deleting.title}"</span>?
                            All courses, days, lessons, and tasks inside will also be deleted.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setDeleting(null)} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all active:scale-95">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
