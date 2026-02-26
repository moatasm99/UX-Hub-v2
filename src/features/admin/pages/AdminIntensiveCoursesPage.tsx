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
    if (!level) return <span className="text-slate-600 text-sm">—</span>;
    const colors: Record<string, string> = {
        Beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
        Intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colors[level] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
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
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/admin" className="hover:text-white transition-colors"><Home className="w-4 h-4" /></Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/admin/courses" className="hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-300">{category?.title ?? 'Courses'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-blue-400" />
                        {category?.title ?? 'Courses'}
                    </h1>
                    <p className="text-slate-400 mt-1">Manage courses in this category</p>
                </div>
                <Link
                    to={`/admin/courses/${categoryId}/new`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Course
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search courses..."
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
                    {search ? 'No courses match your search.' : 'No courses yet. Create your first one!'}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Pos</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/admin/courses/${categoryId}/${c.id}`}
                                            className="text-white font-medium hover:text-blue-400 transition-colors flex items-center gap-2"
                                        >
                                            {c.title}
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                                        </Link>
                                        {c.short_description && (
                                            <p className="text-slate-500 text-sm mt-0.5 truncate max-w-sm">{c.short_description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><LevelBadge level={c.level} /></td>
                                    <td className="px-6 py-4 text-center text-slate-400">{c.position}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleTogglePublish(c)} className="inline-flex items-center gap-1.5 transition-colors">
                                            {c.is_published ? (
                                                <span className="flex items-center gap-1.5 text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Published</span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-slate-500 text-sm"><XCircle className="w-4 h-4" /> Draft</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/courses/${categoryId}/edit/${c.id}`}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => setDeleting(c)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white">Delete Course</h3>
                        <p className="text-slate-400">
                            Delete <span className="text-white font-medium">"{deleting.title}"</span>?
                            All days, lessons, and tasks inside will also be deleted.
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
