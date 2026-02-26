import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft, Save, Loader2, Plus, Trash2,
    Calendar, PlayCircle, ClipboardList, Video, FileText,
} from 'lucide-react';
import { MarkdownEditorWithPreview } from '@/components/admin/MarkdownEditorWithPreview';
import { courseDaysService } from '@/services/course-days';
import { courseLessonsService } from '@/services/course-lessons';
import { courseTasksService } from '@/services/course-tasks';
import { detectResourceType } from '@/utils/resource-detection';
import { useIntensiveCourses } from '@/hooks/use-intensive-courses';
import { useCourseCategories } from '@/hooks/use-course-categories';
import type { CourseLessonDTO } from '@/services/course-lessons';

// ─── Types ────────────────────────────────────────────
interface LessonBlock {
    id: string; // temp client-side id for key
    title: string;
    url: string;
    type: 'Video' | 'Article' | null;
}

interface DayFormState {
    dayTitle: string;
    dayNumber: number;
    position: number;
    lessons: LessonBlock[];
    taskTitle: string;
    taskDescription: string;
}

const createEmptyLesson = (): LessonBlock => ({
    id: crypto.randomUUID(),
    title: '',
    url: '',
    type: null,
});

const INITIAL_STATE: DayFormState = {
    dayTitle: '',
    dayNumber: 1,
    position: 0,
    lessons: [createEmptyLesson()],
    taskTitle: '',
    taskDescription: '',
};

// ─── Shared Styles ────────────────────────────────────
const inputCls =
    'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all';
const labelCls = 'text-sm font-medium text-slate-400';
const sectionCls =
    'bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5';

// ─── Component ────────────────────────────────────────
export default function AdminDayBuilderPage() {
    const { categoryId, courseId, dayId } = useParams<{
        categoryId: string;
        courseId: string;
        dayId: string;
    }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = !!dayId && dayId !== 'new';

    // Breadcrumb data
    const { categories } = useCourseCategories();
    const { courses } = useIntensiveCourses(categoryId!);
    const category = categories.find((c) => c.id === categoryId);
    const course = courses.find((c) => c.id === courseId);

    const [form, setForm] = useState<DayFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // ── Load existing day data for editing ──────────────
    const loadDayData = useCallback(async () => {
        if (!isEditing || !dayId) return;
        setLoading(true);
        try {
            // 1. Get the day
            const allDays = await courseDaysService.getAll(courseId!);
            const day = allDays.find((d) => d.id === dayId);
            if (!day) {
                setError('Day not found.');
                setLoading(false);
                return;
            }

            // 2. Get lessons for this day
            const lessons = await courseLessonsService.getAll(dayId);

            // 3. Get tasks for each lesson (collect the first one found)
            let taskTitle = '';
            let taskDescription = '';
            for (const lesson of lessons) {
                const tasks = await courseTasksService.getAll(lesson.id);
                if (tasks.length > 0) {
                    taskTitle = tasks[0].title;
                    taskDescription = tasks[0].description ?? '';
                    break;
                }
            }

            // Parse day number from title (e.g. "Day 3 — ...") or fallback
            const dayNumMatch = day.title.match(/^Day\s+(\d+)/i);
            const dayNumber = dayNumMatch ? parseInt(dayNumMatch[1]) : day.position;

            setForm({
                dayTitle: day.title,
                dayNumber,
                position: day.position,
                lessons:
                    lessons.length > 0
                        ? lessons.map((l) => ({
                            id: l.id,
                            title: l.title,
                            url: l.url,
                            type: l.type,
                        }))
                        : [createEmptyLesson()],
                taskTitle,
                taskDescription,
            });
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load day data.');
        } finally {
            setLoading(false);
        }
    }, [isEditing, dayId, courseId]);

    useEffect(() => {
        loadDayData();
    }, [loadDayData]);

    // ── Lesson handlers ────────────────────────────────
    const addLesson = () => {
        setForm((p) => ({
            ...p,
            lessons: [...p.lessons, createEmptyLesson()],
        }));
    };

    const removeLesson = (id: string) => {
        setForm((p) => ({
            ...p,
            lessons: p.lessons.filter((l) => l.id !== id),
        }));
    };

    const updateLesson = (id: string, field: keyof LessonBlock, value: string) => {
        setForm((p) => ({
            ...p,
            lessons: p.lessons.map((l) => {
                if (l.id === id) {
                    const next = { ...l, [field]: value };

                    // Trigger detection on URL change
                    if (field === 'url') {
                        const detected = detectResourceType(value);
                        if (detected) {
                            next.type = detected;
                        }
                    }

                    return next;
                }
                return l;
            }),
        }));
    };

    // ── Validate ───────────────────────────────────────
    const validate = (): string | null => {
        if (form.lessons.length === 0) return 'Add at least one lesson.';
        for (let i = 0; i < form.lessons.length; i++) {
            if (!form.lessons[i].title.trim())
                return `Lesson ${i + 1}: Title is required.`;
            if (!form.lessons[i].url.trim())
                return `Lesson ${i + 1}: URL is required.`;
            if (!form.lessons[i].type)
                return `Lesson ${i + 1}: Please provide a valid URL to detect type or select one manually.`;
        }
        return null;
    };

    // ── Save handler ───────────────────────────────────
    const handleSave = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccessMsg(null);

        const dayTitle = form.dayTitle.trim() || `Day ${form.dayNumber}`;

        try {
            if (isEditing && dayId) {
                // ── EDIT MODE ──────────────────────────
                // 1) Update the day
                await courseDaysService.update({
                    id: dayId,
                    title: dayTitle,
                    position: form.position,
                });

                // 2) Delete all existing lessons (cascade deletes tasks)
                const existingLessons = await courseLessonsService.getAll(dayId);
                for (const lesson of existingLessons) {
                    await courseLessonsService.delete(lesson.id);
                }

                // 3) Re-insert lessons from state
                const insertedLessons: CourseLessonDTO[] = [];
                for (let i = 0; i < form.lessons.length; i++) {
                    const l = form.lessons[i];
                    const created = await courseLessonsService.create({
                        day_id: dayId,
                        title: l.title.trim(),
                        url: l.url.trim(),
                        type: l.type as any,
                        duration: null,
                        position: i,
                    });
                    insertedLessons.push(created);
                }

                // 4) Upsert task (attach to first lesson)
                if (form.taskTitle.trim() && insertedLessons.length > 0) {
                    await courseTasksService.create({
                        lesson_id: insertedLessons[0].id,
                        title: form.taskTitle.trim(),
                        description: form.taskDescription.trim() || null,
                        position: 0,
                    });
                }
            } else {
                // ── CREATE MODE ────────────────────────
                let createdDayId: string | null = null;

                try {
                    // 1) Insert day
                    const day = await courseDaysService.create({
                        course_id: courseId!,
                        title: dayTitle,
                        description: null,
                        position: form.position,
                    });
                    createdDayId = day.id;

                    // 2) Insert all lessons
                    const insertedLessons: CourseLessonDTO[] = [];
                    for (let i = 0; i < form.lessons.length; i++) {
                        const l = form.lessons[i];
                        const created = await courseLessonsService.create({
                            day_id: day.id,
                            title: l.title.trim(),
                            url: l.url.trim(),
                            type: l.type as any,
                            duration: null,
                            position: i,
                        });
                        insertedLessons.push(created);
                    }

                    // 3) Insert task (optional, attach to first lesson)
                    if (form.taskTitle.trim() && insertedLessons.length > 0) {
                        await courseTasksService.create({
                            lesson_id: insertedLessons[0].id,
                            title: form.taskTitle.trim(),
                            description: form.taskDescription.trim() || null,
                            position: 0,
                        });
                    }
                } catch (err) {
                    // Rollback: delete the day (cascade removes lessons+tasks)
                    if (createdDayId) {
                        try {
                            await courseDaysService.delete(createdDayId);
                        } catch {
                            // best-effort rollback
                        }
                    }
                    throw err;
                }
            }

            // ── On success ─────────────────────────────
            queryClient.invalidateQueries({ queryKey: ['course-days', courseId] });
            setSuccessMsg('Day saved successfully!');

            // Navigate back after short delay
            setTimeout(() => {
                navigate(`/admin/courses/${categoryId}/${courseId}`);
            }, 600);
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Loading state ──────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* ── Header ─────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/admin/courses/${categoryId}/${courseId}`}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <p className="text-sm text-slate-500">
                            {category?.title} → {course?.title}
                        </p>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-blue-400" />
                            {isEditing ? 'Edit Day' : 'Create New Day'}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Day
                </button>
            </div>

            {/* ── Error / Success Banners ─────────────── */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-200">
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm animate-in fade-in duration-200">
                    {successMsg}
                </div>
            )}

            {/* ═══ SECTION 1 — Day Settings ═══════════ */}
            <section className={sectionCls}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Day Settings
                </h2>

                <div className="space-y-2">
                    <label className={labelCls}>Day Title</label>
                    <input
                        value={form.dayTitle}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, dayTitle: e.target.value }))
                        }
                        placeholder={`Day ${form.dayNumber} (auto-generated if left empty)`}
                        className={inputCls}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className={labelCls}>Day Number *</label>
                        <input
                            type="number"
                            min={1}
                            value={form.dayNumber}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    dayNumber: parseInt(e.target.value) || 1,
                                }))
                            }
                            className={inputCls}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className={labelCls}>Position</label>
                        <input
                            type="number"
                            min={0}
                            value={form.position}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    position: parseInt(e.target.value) || 0,
                                }))
                            }
                            className={inputCls}
                        />
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 2 — Lessons Builder ════════ */}
            <section className={sectionCls}>
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <PlayCircle className="w-5 h-5 text-purple-400" />
                        Lessons
                        <span className="text-sm font-normal text-slate-500">
                            ({form.lessons.length})
                        </span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {form.lessons.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-4 relative group transition-all hover:border-slate-700"
                        >
                            {/* Lesson number badge */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Lesson {index + 1}
                                </span>
                                {form.lessons.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLesson(lesson.id)}
                                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete lesson"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className={labelCls}>Title *</label>
                                <input
                                    value={lesson.title}
                                    onChange={(e) =>
                                        updateLesson(lesson.id, 'title', e.target.value)
                                    }
                                    placeholder="e.g. What is UX Design?"
                                    className={inputCls}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelCls}>URL *</label>
                                <input
                                    value={lesson.url}
                                    onChange={(e) =>
                                        updateLesson(lesson.id, 'url', e.target.value)
                                    }
                                    placeholder="https://..."
                                    className={`${inputCls} ${error && !lesson.type && lesson.url ? 'border-red-500/50' : ''}`}
                                    required
                                />
                                {lesson.url && lesson.type && (
                                    <p className="text-[11px] text-slate-500 font-medium px-1 flex items-center gap-1.5 opacity-70">
                                        {lesson.type === 'Video' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                        Detected as {lesson.type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className={labelCls}>Type</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateLesson(lesson.id, 'type', 'Video')
                                        }
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${lesson.type === 'Video'
                                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                                            }`}
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        Video
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateLesson(lesson.id, 'type', 'Article')
                                        }
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all ${lesson.type === 'Article'
                                            ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                                            }`}
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        Article
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Lesson button */}
                <button
                    type="button"
                    onClick={addLesson}
                    className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-lg text-slate-400 hover:text-purple-300 font-medium flex items-center justify-center gap-2 transition-all hover:bg-purple-500/5"
                >
                    <Plus className="w-4 h-4" />
                    Add Lesson
                </button>
            </section>

            {/* ═══ SECTION 3 — Task ══════════════════ */}
            <section className={sectionCls}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <ClipboardList className="w-5 h-5 text-emerald-400" />
                    Task
                    <span className="text-xs font-normal text-slate-500">(optional)</span>
                </h2>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className={labelCls}>Task Title</label>
                        <input
                            value={form.taskTitle}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, taskTitle: e.target.value }))
                            }
                            placeholder="e.g. Analyze a competitor app"
                            className={inputCls}
                        />
                    </div>

                    <MarkdownEditorWithPreview
                        value={form.taskDescription}
                        onChange={(val) => setForm(p => ({ ...p, taskDescription: val }))}
                        label="Task Description"
                    />
                </div>
            </section>

            {/* ── Bottom Save Button ─────────────────── */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                    to={`/admin/courses/${categoryId}/${courseId}`}
                    className="px-5 py-2.5 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Day
                </button>
            </div>
        </div>
    );
}
