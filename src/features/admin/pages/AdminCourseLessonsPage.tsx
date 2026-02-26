import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Plus, Search, Edit2, Trash2, Loader2, X, Save,
    ExternalLink, PlayCircle, FileText, ChevronRight, Home, Video
} from 'lucide-react';
import { detectResourceType } from '@/utils/resource-detection';
import { useCourseLessons } from '@/hooks/use-course-lessons';
import { useCourseCategories } from '@/hooks/use-course-categories';
import { useIntensiveCourses } from '@/hooks/use-intensive-courses';
import { useCourseDays } from '@/hooks/use-course-days';
import type { CourseLessonDTO, CreateCourseLessonInput } from '@/services/course-lessons';

// ─── Form Modal ───────────────────────────────────────
function LessonFormModal({
    isOpen, onClose, onSubmit, initialData, dayId, isSubmitting = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: CourseLessonDTO | null;
    dayId: string;
    isSubmitting?: boolean;
}) {
    const [form, setForm] = useState({
        title: initialData?.title ?? '',
        url: initialData?.url ?? '',
        type: initialData ? initialData.type : null as 'Video' | 'Article' | null,
        duration: initialData?.duration ?? '',
        position: initialData?.position ?? 0,
    });
    const [error, setError] = useState<string | null>(null);

    useState(() => {
        setForm({
            title: initialData?.title ?? '',
            url: initialData?.url ?? '',
            type: initialData ? initialData.type : null,
            duration: initialData?.duration ?? '',
            position: initialData?.position ?? 0,
        });
        setError(null);
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.type) {
            setError('Please provide a valid URL to detect resource type or select one manually.');
            return;
        }

        const payload = { ...form, day_id: dayId, duration: form.duration || null };
        await onSubmit(initialData ? { ...payload, id: initialData.id } : payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Lesson' : 'Add Lesson'}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Title *</label>
                        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">URL *</label>
                        <input
                            value={form.url}
                            onChange={e => {
                                const value = e.target.value;
                                setForm(p => ({ ...p, url: value }));
                                const detected = detectResourceType(value);
                                if (detected) {
                                    setForm(p => ({ ...p, type: detected }));
                                }
                            }}
                            placeholder="https://..."
                            className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all ${error && !form.type ? 'border-red-500/50' : 'border-slate-800'}`}
                            required
                        />
                        {form.url && form.type && (
                            <p className="text-[11px] text-slate-500 font-medium px-1 flex items-center gap-1.5 opacity-70">
                                {form.type === 'Video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                Detected as {form.type}
                            </p>
                        )}
                        {error && (
                            <p className="text-xs text-red-400 px-1">{error}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Type *</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, type: 'Video' }))}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${form.type === 'Video'
                                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                        }`}
                                >
                                    <Video className="w-3.5 h-3.5" />
                                    Video
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, type: 'Article' }))}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${form.type === 'Article'
                                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                        }`}
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Article
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Duration</label>
                            <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 15:30" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
                        </div>
                    </div>

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

// ─── Type Badge ───────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
    if (type === 'Video') return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
            <PlayCircle className="w-3 h-3" /> Video
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-sky-500/10 text-sky-400 border-sky-500/20">
            <FileText className="w-3 h-3" /> Article
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────
export default function AdminCourseLessonsPage() {
    const { categoryId, courseId, dayId } = useParams<{ categoryId: string; courseId: string; dayId: string }>();
    const { categories } = useCourseCategories();
    const { courses } = useIntensiveCourses(categoryId!);
    const { days } = useCourseDays(courseId!);
    const { lessons, isLoading, create, update, remove } = useCourseLessons(dayId!);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CourseLessonDTO | null>(null);
    const [deleting, setDeleting] = useState<CourseLessonDTO | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const category = categories.find(c => c.id === categoryId);
    const course = courses.find(c => c.id === courseId);
    const day = days.find(d => d.id === dayId);
    const filtered = lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (data.id) await update.mutateAsync(data);
            else await create.mutateAsync(data as CreateCourseLessonInput);
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
                <span className="text-slate-300">{day?.title ?? 'Lessons'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <PlayCircle className="w-7 h-7 text-blue-400" />
                        {day?.title ?? 'Lessons'}
                    </h1>
                    <p className="text-slate-400 mt-1">Manage lessons for this day</p>
                </div>
                <button onClick={() => { setEditing(null); setModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add Lesson
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lessons..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-500">{search ? 'No lessons match.' : 'No lessons yet. Add the first one!'}</div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800 text-left">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Pos</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(lesson => (
                                <tr key={lesson.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link to={`/admin/courses/${categoryId}/${courseId}/${dayId}/${lesson.id}`}
                                            className="text-white font-medium hover:text-blue-400 transition-colors flex items-center gap-2">
                                            {lesson.title}
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                                        </Link>
                                        <a href={lesson.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:text-blue-400 truncate block max-w-xs mt-0.5">{lesson.url}</a>
                                    </td>
                                    <td className="px-6 py-4"><TypeBadge type={lesson.type} /></td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{lesson.duration || '—'}</td>
                                    <td className="px-6 py-4 text-center text-slate-400">{lesson.position}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setEditing(lesson); setModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => setDeleting(lesson)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <LessonFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editing} dayId={dayId!} isSubmitting={submitting} />

            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-4">
                        <h3 className="text-lg font-bold text-white">Delete Lesson</h3>
                        <p className="text-slate-400">Delete <span className="text-white font-medium">"{deleting.title}"</span>? All tasks inside will also be deleted.</p>
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
