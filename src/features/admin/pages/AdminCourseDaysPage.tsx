import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, Loader2,
    ExternalLink, Calendar, ChevronRight, Home
} from 'lucide-react';
import { useCourseDays } from '@/hooks/use-course-days';
import { useCourseCategories } from '@/hooks/use-course-categories';
import { useIntensiveCourses } from '@/hooks/use-intensive-courses';
import type { CourseDayDTO } from '@/services/course-days';

// ─── Main Page ────────────────────────────────────────
export default function AdminCourseDaysPage() {
    const { categoryId, courseId } = useParams<{ categoryId: string; courseId: string }>();
    const navigate = useNavigate();
    const { categories } = useCourseCategories();
    const { courses } = useIntensiveCourses(categoryId!);
    const { days, isLoading, remove } = useCourseDays(courseId!);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<CourseDayDTO | null>(null);

    const category = categories.find(c => c.id === categoryId);
    const course = courses.find(c => c.id === courseId);
    const filtered = days.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

    const handleConfirmDelete = async () => {
        if (!deleting) return;
        await remove.mutateAsync(deleting.id);
        setDeleting(null);
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] flex-wrap font-medium">
                <Link to="/admin" className="hover:text-[var(--text-main)] transition-colors"><Home className="w-4 h-4" /></Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/admin/courses" className="hover:text-[var(--text-main)] transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={`/admin/courses/${categoryId}`} className="hover:text-[var(--text-main)] transition-colors">{category?.title ?? '...'}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[var(--text-secondary)] font-bold">{course?.title ?? 'Days'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <Calendar className="w-7 h-7 text-[var(--accent-primary)]" />
                        {course?.title ?? 'Course Days'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage daily content structure</p>
                </div>
                <Link
                    to={`/admin/courses/${categoryId}/${courseId}/days/new`}
                    className="px-4 py-2 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Day
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search days..."
                    className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-main)] placeholder:[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-medium" />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)] font-medium">{search ? 'No days match.' : 'No days yet. Add the first one!'}</div>
            ) : (
                <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-main)] bg-[var(--bg-muted)]/50 text-left">
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Position</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)]">
                            {filtered.map(day => (
                                <tr key={day.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link to={`/admin/courses/${categoryId}/${courseId}/days/${day.id}`}
                                            className="text-[var(--text-main)] font-bold hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2">
                                            {day.title}
                                            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-disabled)]" />
                                        </Link>
                                        {day.description && <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate max-w-sm font-medium">{day.description}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-[var(--text-secondary)] font-bold">{day.position}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/courses/${categoryId}/${courseId}/days/${day.id}`)}
                                                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                                title="Edit day"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setDeleting(day)} className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Delete Day</h3>
                        <p className="text-[var(--text-muted)] font-medium">Delete <span className="text-[var(--text-main)] font-bold">"{deleting.title}"</span>? All lessons and tasks inside will also be deleted.</p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setDeleting(null)} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all active:scale-95">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
