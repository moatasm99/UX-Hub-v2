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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
                    <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Task' : 'Add Task'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Title *</label>
                        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" required />
                    </div>

                    <MarkdownEditorWithPreview
                        value={form.description}
                        onChange={(val) => setForm(p => ({ ...p, description: val }))}
                        label="Task Description"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Position</label>
                        <input type="number" value={form.position} onChange={e => setForm(p => ({ ...p, position: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
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
            <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                <Link to="/admin" className="hover:text-white transition-colors"><Home className="w-4 h-4" /></Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/admin/courses" className="hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={`/admin/courses/${categoryId}`} className="hover:text-white transition-colors">{category?.title ?? '...'}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={`/admin/courses/${categoryId}/${courseId}`} className="hover:text-white transition-colors">{course?.title ?? '...'}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={`/admin/courses/${categoryId}/${courseId}/${dayId}`} className="hover:text-white transition-colors">{day?.title ?? '...'}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-300">{lesson?.title ?? 'Tasks'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ClipboardList className="w-7 h-7 text-blue-400" />
                        {lesson?.title ?? 'Tasks'}
                    </h1>
                    <p className="text-slate-400 mt-1">Manage tasks assigned to this lesson</p>
                </div>
                <button onClick={() => { setEditing(null); setModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add Task
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-500">{search ? 'No tasks match.' : 'No tasks yet. Add the first one!'}</div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Position</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(task => (
                                <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">{task.title}</span>
                                        {task.description && <p className="text-slate-500 text-sm mt-0.5 truncate max-w-md">{task.description}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-400">{task.position}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditing(task); setModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleting(task)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white">Delete Task</h3>
                        <p className="text-slate-400">Delete <span className="text-white font-medium">"{deleting.title}"</span>?</p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setDeleting(null)} className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
