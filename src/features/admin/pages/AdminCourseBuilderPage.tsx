import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Save, Loader2, ArrowLeft, BookOpen, Tag, Image, Home, ChevronRight,
} from 'lucide-react';
import { useIntensiveCourses, useCourseById } from '@/hooks/use-intensive-courses';
import { useCourseCategories } from '@/hooks/use-course-categories';
import { IconSelector } from '@/components/IconSelector';

// ─── Badge Color Presets ──────────────────────────────
const BADGE_PRESETS = [
    { name: 'Emerald', value: 'from-emerald-500 to-teal-600' },
    { name: 'Violet', value: 'from-violet-500 to-purple-600' },
    { name: 'Blue', value: 'from-blue-600 to-indigo-700' },
    { name: 'Amber', value: 'from-amber-600 to-orange-700' },
    { name: 'Cyan', value: 'from-cyan-500 to-blue-600' },
    { name: 'Pink', value: 'from-pink-500 to-rose-600' },
    { name: 'Fuchsia', value: 'from-fuchsia-500 to-purple-600' },
    { name: 'Lime', value: 'from-lime-500 to-green-600' },
    { name: 'Rose', value: 'from-rose-500 to-pink-600' },
    { name: 'Sky', value: 'from-sky-500 to-blue-500' },
];

// ─── Shared styles ─────────────────────────────────────
const inputCls =
    'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all';
const labelCls = 'text-sm font-medium text-slate-400';

// ────────────────────────────────────────────────────────
export default function AdminCourseBuilderPage() {
    const { categoryId, courseId } = useParams<{ categoryId: string; courseId?: string }>();
    const navigate = useNavigate();
    const isEdit = !!courseId;

    const { categories } = useCourseCategories();
    const { create, update } = useIntensiveCourses(categoryId!);
    const { course: existingCourse, isLoading: loadingCourse } = useCourseById(courseId);

    const category = categories.find(c => c.id === categoryId);

    const [form, setForm] = useState({
        title: '',
        short_description: '',
        level: '',
        position: 0,
        is_published: false,
        badge_label: '',
        badge_color: '',
        icon_key: '',
        icon_bg_color: '#F5F5F5',
    });
    const [submitting, setSubmitting] = useState(false);
    const [prefilled, setPrefilled] = useState(false);

    // ── Pre-fill form when editing ──
    useEffect(() => {
        if (isEdit && existingCourse && !prefilled) {
            setForm({
                title: existingCourse.title ?? '',
                short_description: existingCourse.short_description ?? '',
                level: existingCourse.level ?? '',
                position: existingCourse.position ?? 0,
                is_published: existingCourse.is_published ?? false,
                badge_label: existingCourse.badge_label ?? '',
                badge_color: existingCourse.badge_color ?? '',
                icon_key: existingCourse.icon_key ?? '',
                icon_bg_color: existingCourse.icon_bg_color ?? '#F5F5F5',
            });
            setPrefilled(true);
        }
    }, [existingCourse, isEdit, prefilled]);

    // ── Submit ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: Record<string, any> = {
                title: form.title,
                short_description: form.short_description || null,
                category_id: categoryId,
                level: form.level || null,
                position: form.position,
                is_published: form.is_published,
            };
            if (form.badge_label.trim()) payload.badge_label = form.badge_label.trim();
            if (form.badge_color.trim()) payload.badge_color = form.badge_color.trim();
            if (form.icon_key.trim()) payload.icon_key = form.icon_key.trim();
            if (form.icon_bg_color) payload.icon_bg_color = form.icon_bg_color;

            if (isEdit && courseId) {
                await update.mutateAsync({ ...payload, id: courseId });
            } else {
                await create.mutateAsync(payload as any);
            }
            navigate(`/admin/courses/${categoryId}`);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Loading guard (edit mode) ──
    if (isEdit && loadingCourse) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/admin" className="hover:text-white transition-colors"><Home className="w-4 h-4" /></Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to="/admin/courses" className="hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link to={`/admin/courses/${categoryId}`} className="hover:text-white transition-colors">
                    {category?.title ?? 'Courses'}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-300">{isEdit ? 'Edit Course' : 'New Course'}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to={`/admin/courses/${categoryId}`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-blue-400" />
                        {isEdit ? 'Edit Course' : 'New Course'}
                    </h1>
                    <p className="text-slate-400 mt-0.5 text-sm">
                        {isEdit ? `Editing "${existingCourse?.title}"` : `Adding to ${category?.title ?? 'category'}`}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ═══ Section 1: Basic Info ═══ */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        Basic Information
                    </h2>

                    <div className="space-y-2">
                        <label className={labelCls}>Title *</label>
                        <input
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className={inputCls}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className={labelCls}>Short Description</label>
                        <textarea
                            value={form.short_description}
                            onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))}
                            rows={3}
                            className={`${inputCls} resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelCls}>Level</label>
                            <select
                                value={form.level}
                                onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                                className={inputCls}
                            >
                                <option value="">— None —</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className={labelCls}>Position</label>
                            <input
                                type="number"
                                value={form.position}
                                onChange={e => setForm(p => ({ ...p, position: parseInt(e.target.value) || 0 }))}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Publish toggle */}
                    <div className="flex items-center gap-3 pt-2">
                        <div
                            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${form.is_published ? 'bg-blue-600' : 'bg-slate-700'}`}
                            onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${form.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-sm font-medium text-slate-300">
                            {form.is_published ? 'Published' : 'Draft'}
                        </span>
                    </div>
                </section>

                {/* ═══ Section 2: Icon & Visual ═══ */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Image className="w-5 h-5 text-purple-400" />
                        Icon & Visual
                    </h2>

                    <IconSelector
                        value={form.icon_key}
                        onChange={key => setForm(p => ({ ...p, icon_key: key }))}
                        bgColor={form.icon_bg_color}
                        onBgColorChange={color => setForm(p => ({ ...p, icon_bg_color: color }))}
                    />

                    {/* Badge section */}
                    <div className="border-t border-slate-800 pt-5 space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                            <Tag className="w-4 h-4 text-purple-400" />
                            Badge / Tag
                        </h3>
                        <div className="space-y-2">
                            <label className={labelCls}>Badge Label</label>
                            <input
                                value={form.badge_label}
                                onChange={e => setForm(p => ({ ...p, badge_label: e.target.value }))}
                                placeholder="e.g. Foundation, Expert, Deep Dive"
                                className={inputCls}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={labelCls}>Badge Color</label>
                            <input
                                value={form.badge_color}
                                onChange={e => setForm(p => ({ ...p, badge_color: e.target.value }))}
                                placeholder="e.g. from-emerald-500 to-teal-600"
                                className={inputCls}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {BADGE_PRESETS.map(preset => (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, badge_color: preset.value }))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${preset.value} transition-all ${form.badge_color === preset.value
                                                ? 'ring-2 ring-white/60 scale-105'
                                                : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ Actions ═══ */}
                <div className="flex items-center justify-between">
                    <Link
                        to={`/admin/courses/${categoryId}`}
                        className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Update Course' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
}
