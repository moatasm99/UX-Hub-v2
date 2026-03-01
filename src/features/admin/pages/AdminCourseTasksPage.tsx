import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, Loader2, X, Save,
    ClipboardList, ChevronRight, Home
} from 'lucide-react';
import { MarkdownEditorWithPreview } from '@/components/admin/MarkdownEditorWithPreview';
import { useCourseTasks } from '@/hooks/use-course-tasks';
import { useCourseCategories } from '@/hooks/use-course-categories';
import { useIntensiveCourses } from '@/hooks/use-intensive-courses';
import { useCourseDays } from '@/hooks/use-course-days';
import { useCourseLessons } from '@/hooks/use-course-lessons';
import type { CourseTaskDTO, CreateCourseTaskInput } from '@/services/course-tasks';

// ─── Form Modal ───────────────────────────────────────
function TaskFormModal({
    isOpen, onClose, onSubmit, initialData, lessonId, isSubmitting = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: CourseTaskDTO | null;
    lessonId: string;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        position: initialData?.position ?? 0,
    });

    useState(() => {
        setForm({
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            position: initialData?.position ?? 0,
        });
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form, lesson_id: lessonId };
        await onSubmit(initialData ? { ...payload, id: initialData.id } : payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-main)] shrink-0">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">{initialData ? 'Edit Task' : 'Add Task'}</h2>
                    <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-muted)] transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">Title *</label>
                        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-medium" required />
                    </div>

                    <MarkdownEditorWithPreview
                        value={form.description}
                        onChange={(val) => setForm(p => ({ ...p, description: val }))}
                        label="Task Description"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[var(--text-muted)]">Position</label>
                        <input type="number" value={form.position} onChange={e => setForm(p => ({ ...p, position: parseInt(e.target.value) || 0 }))} className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-bold" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border-main)]">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────
export default function AdminCourseTasksPage() {
    const { categoryId, courseId, dayId, lessonId } = useParams<{
        categoryId: string; courseId: string; dayId: string; lessonId: string
    }>();
    const { categories } = useCourseCategories();
    const { courses } = useIntensiveCourses(categoryId!);
    const { days } = useCourseDays(courseId!);
    const { lessons } = useCourseLessons(dayId!);
    const { tasks, isLoading, create, update, remove } = useCourseTasks(lessonId!);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CourseTaskDTO | null>(null);
    const [deleting, setDeleting] = useState<CourseTaskDTO | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const category = categories.find(c => c.id === categoryId);
    const course = courses.find(c => c.id === courseId);
    const day = days.find(d => d.id === dayId);
    const lesson = lessons.find(l => l.id === lessonId);
    const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (data.id) await update.mutateAsync(data);
            else await create.mutateAsync(data as CreateCourseTaskInput);
            setModalOpen(false);
        } finally { setSubmitting(false); }
    };

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
                <Link to={`/admin/courses/${categoryId}/${courseId}`} className="hover:text-[var(--text-main)] transition-colors">{course?.title ?? '...'}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={`/admin/courses/${categoryId}/${courseId}/${dayId}`} className="hover:text-[var(--text-main)] transition-colors">{day?.title ?? '...'}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[var(--text-secondary)] font-bold">{lesson?.title ?? 'Tasks'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                        <ClipboardList className="w-7 h-7 text-[var(--accent-primary)]" />
                        {lesson?.title ?? 'Tasks'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage tasks assigned to this lesson</p>
                </div>
                <button onClick={() => { setEditing(null); setModalOpen(true); }} className="px-4 py-2 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Add Task
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
                    className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-main)] placeholder:[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-medium" />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-muted)] font-medium">{search ? 'No tasks match.' : 'No tasks yet. Add the first one!'}</div>
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
                            {filtered.map(task => (
                                <tr key={task.id} className="hover:bg-[var(--bg-muted)]/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-[var(--text-main)] font-bold">{task.title}</span>
                                        {task.description && <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate max-w-md font-medium">{task.description}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-[var(--text-secondary)] font-bold tabular-nums">{task.position}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditing(task); setModalOpen(true); }} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleting(task)} className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <TaskFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editing} lessonId={lessonId!} isSubmitting={submitting} />

            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Delete Task</h3>
                        <p className="text-[var(--text-muted)] font-medium">Delete <span className="text-[var(--text-main)] font-bold">"{deleting.title}"</span>?</p>
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
