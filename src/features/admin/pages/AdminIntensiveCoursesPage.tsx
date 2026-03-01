import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, CheckCircle2, XCircle,
    Loader2, ExternalLink, BookOpen, ChevronRight, Home,
} from 'lucide-react';
import { useIntensiveCourses } from '@/hooks/use-intensive-courses';
import { useCourseCategories } from '@/hooks/use-course-categories';
import type { IntensiveCourseDTO } from '@/services/intensive-courses';

// ─── Level Badge ──────────────────────────────────────
function LevelBadge({ level }: { level: string | null }) {
    if (!level) return <span className="text-[var(--text-muted)] text-sm">—</span>;
    const colors: Record<string, string> = {
        Beginner: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Intermediate: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        Advanced: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${colors[level] ?? 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-main)]'}`}>
            {level}
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────
export default function AdminIntensiveCoursesPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const { categories } = useCourseCategories();
    const { courses, isLoading, update, remove } = useIntensiveCourses(categoryId!);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<IntensiveCourseDTO | null>(null);

    const category = categories.find(c => c.id === categoryId);
    const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleConfirmDelete = async () => {
        if (!deleting) return;
        await remove.mutateAsync(deleting.id);
        setDeleting(null);
    };

    const handleTogglePublish = (c: IntensiveCourseDTO) => {
        update.mutate({ id: c.id, is_published: !c.is_published });
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] font-medium">
                <Link to="/admin" className="hover:text-[var(--text-main)] transition-colors"><Home className="w-4 h-4" /></Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                <Link to="/admin/courses" className="hover:text-[var(--text-main)] transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                <span className="text-[var(--text-secondary)] font-bold">{category?.title ?? 'Courses'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-[var(--accent-primary)]" />
                        {category?.title ?? 'Courses'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage courses in this category</p>
                </div>
                <Link
                    to={`/admin/courses/${categoryId}/new`}
                    className="px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Course
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search courses..."
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
                    {search ? 'No courses match your search.' : 'No courses yet. Create your first one!'}
                </div>
            ) : (
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-main)] bg-[var(--bg-muted)]/50 text-left">
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Pos</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)]">
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/admin/courses/${categoryId}/${c.id}`}
                                            className="text-[var(--text-main)] font-bold hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2"
                                        >
                                            {c.title}
                                            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                        </Link>
                                        {c.short_description && (
                                            <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate max-w-sm font-medium">{c.short_description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><LevelBadge level={c.level} /></td>
                                    <td className="px-6 py-4 text-center text-[var(--text-secondary)] font-bold tabular-nums">{c.position}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleTogglePublish(c)} className="inline-flex items-center gap-1.5 transition-colors">
                                            {c.is_published ? (
                                                <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-4 h-4" /> Published</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider"><XCircle className="w-4 h-4" /> Draft</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/courses/${categoryId}/edit/${c.id}`}
                                                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => setDeleting(c)} className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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

            {/* Delete Confirmation */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Delete Course</h3>
                        <p className="text-[var(--text-muted)] font-medium">
                            Delete <span className="text-[var(--text-main)] font-bold">"{deleting.title}"</span>?
                            All days, lessons, and tasks inside will also be deleted.
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
