import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft, Save, Loader2, Plus, Trash2,
    Settings, PlayCircle, ExternalLink, Video, FileText,
    CheckCircle2, XCircle, Hash
} from 'lucide-react';
import { MarkdownEditorWithPreview } from '@/components/admin/MarkdownEditorWithPreview';
import { roadmapTopicsService } from '@/services/roadmap-topics';
import { roadmapResourcesService } from '@/services/roadmap-resources';
import { detectResourceType } from '@/utils/resource-detection';
import { useRoadmapCategories } from '@/hooks/use-roadmap-categories';

// ─── Types ────────────────────────────────────────────
interface ResourceBlock {
    id: string; // temp client-side id for key or actual db id
    title: string;
    url: string;
    type: 'Video' | 'Article' | 'Book' | 'Podcast' | 'Course' | 'Tool';
    is_published: boolean;
}

interface TopicFormState {
    title: string;
    description: string;
    position: number;
    is_published: boolean;
    resources: ResourceBlock[];
}

const createEmptyResource = (): ResourceBlock => ({
    id: crypto.randomUUID(),
    title: '',
    url: '',
    type: 'Video',
    is_published: true,
});

const INITIAL_STATE: TopicFormState = {
    title: '',
    description: '',
    position: 0,
    is_published: true,
    resources: [createEmptyResource()],
};

// ─── Shared Styles ────────────────────────────────────
const inputCls =
    'w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] placeholder:[var(--text-muted)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all font-medium';
const labelCls = 'text-sm font-semibold text-[var(--text-secondary)]';
const sectionCls =
    'bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-6 space-y-5 shadow-sm';

// ─── Component ────────────────────────────────────────
export default function AdminTopicBuilderPage() {
    const { trackId, topicId } = useParams<{
        trackId: string;
        topicId: string;
    }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = !!topicId && topicId !== 'new';

    // Breadcrumb data
    const { categories } = useRoadmapCategories();
    const track = categories.find((c) => c.id === trackId);

    const [form, setForm] = useState<TopicFormState>(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditing);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // ── Load existing topic data for editing ──────────────
    const loadTopicData = useCallback(async () => {
        if (!isEditing || !topicId) return;
        setLoading(true);
        try {
            // 1. Get the topic
            const allTopics = await roadmapTopicsService.getByTrack(trackId!);
            const topic = allTopics.find((t) => t.id === topicId);
            if (!topic) {
                setError('Topic not found.');
                setLoading(false);
                return;
            }

            // 2. Get resources for this topic
            const resources = await roadmapResourcesService.getByTopic(topicId);

            setForm({
                title: topic.title,
                description: topic.description ?? '',
                position: topic.position,
                is_published: topic.is_published,
                resources:
                    resources.length > 0
                        ? resources.map((r) => ({
                            id: r.id,
                            title: r.title,
                            url: r.url,
                            type: r.type,
                            is_published: r.is_published,
                        }))
                        : [createEmptyResource()],
            });
        } catch (err: any) {
            setError(err?.message ?? 'Failed to load topic data.');
        } finally {
            setLoading(false);
        }
    }, [isEditing, topicId, trackId]);

    useEffect(() => {
        loadTopicData();
    }, [loadTopicData]);

    // ── Resource handlers ────────────────────────────────
    const addResource = () => {
        setForm((p) => ({
            ...p,
            resources: [...p.resources, createEmptyResource()],
        }));
    };

    const removeResource = (id: string) => {
        setForm((p) => ({
            ...p,
            resources: p.resources.filter((r) => r.id !== id),
        }));
    };

    const updateResource = (id: string, field: keyof ResourceBlock, value: any) => {
        setForm((p) => ({
            ...p,
            resources: p.resources.map((r) => {
                if (r.id === id) {
                    const next = { ...r, [field]: value };

                    // Trigger detection on URL change
                    if (field === 'url') {
                        const detected = detectResourceType(value);
                        if (detected) {
                            next.type = detected;
                        }
                    }

                    return next;
                }
                return r;
            }),
        }));
    };

    // ── Validate ───────────────────────────────────────
    const validate = (): string | null => {
        if (!form.title.trim()) return 'Topic title is required.';
        if (form.resources.length === 0) return 'Add at least one resource.';
        for (let i = 0; i < form.resources.length; i++) {
            if (!form.resources[i].title.trim())
                return `Resource ${i + 1}: Title is required.`;
            if (!form.resources[i].url.trim())
                return `Resource ${i + 1}: URL is required.`;
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

        try {
            let currentTopicId = topicId;

            if (isEditing && topicId) {
                // 1) Update the topic
                await roadmapTopicsService.update({
                    id: topicId,
                    title: form.title.trim(),
                    description: form.description.trim() || null,
                    position: form.position,
                    is_published: form.is_published,
                });

                // 2) Simple strategy: delete existing resources and re-insert
                // (This matches the CourseDayBuilder's strategy)
                const existingResources = await roadmapResourcesService.getByTopic(topicId);
                for (const res of existingResources) {
                    await roadmapResourcesService.delete(res.id);
                }
            } else {
                // CREATE MODE
                const created = await roadmapTopicsService.create({
                    track_id: trackId!,
                    title: form.title.trim(),
                    description: form.description.trim() || null,
                    position: form.position,
                    is_published: form.is_published,
                });
                currentTopicId = created.id;
            }

            // Insert all resources
            for (let i = 0; i < form.resources.length; i++) {
                const r = form.resources[i];
                await roadmapResourcesService.create({
                    topic_id: currentTopicId!,
                    title: r.title.trim(),
                    url: r.url.trim(),
                    type: r.type as any,
                    position: i,
                    is_published: r.is_published,
                });
            }

            // ── On success ─────────────────────────────
            queryClient.invalidateQueries({ queryKey: ['roadmap-topics', trackId] });
            queryClient.invalidateQueries({ queryKey: ['roadmap-resources', currentTopicId] });
            setSuccessMsg('Topic saved successfully!');

            // Navigate back after short delay
            setTimeout(() => {
                navigate(`/admin/roadmap/${trackId}`);
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
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* ── Header ─────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/admin/roadmap/${trackId}`}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <p className="text-sm text-[var(--text-muted)] font-medium">
                            Roadmap → {track?.title || 'Track'}
                        </p>
                        <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                            <Settings className="w-6 h-6 text-[var(--accent-primary)]" />
                            {isEditing ? 'Edit Topic' : 'Create New Topic'}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Topic
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

            {/* ═══ SECTION 1 — Topic Settings ═══════════ */}
            <section className={sectionCls}>
                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-main)]">
                    <Settings className="w-5 h-5 text-[var(--accent-primary)]" />
                    Topic Settings
                </h2>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className={labelCls}>Title *</label>
                        <input
                            value={form.title}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, title: e.target.value }))
                            }
                            placeholder="e.g. UX Psychology Principles"
                            className={inputCls}
                            required
                        />
                    </div>

                    <MarkdownEditorWithPreview
                        value={form.description}
                        onChange={(val) => setForm(p => ({ ...p, description: val }))}
                        label="Description"
                    />

                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className={labelCls}>Position</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="number"
                                    value={form.position}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, position: parseInt(e.target.value) || 0 }))
                                    }
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer p-2.5 bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg w-full group">
                                <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
                                    className={`w-10 h-5 rounded-full p-1 transition-colors relative ${form.is_published ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-main)]'}`}
                                >
                                    <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${form.is_published ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                                </button>
                                <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                                    {form.is_published ? 'Published' : 'Draft'}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECTION 2 — Resources Builder ════════ */}
            <section className={sectionCls}>
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-main)]">
                        <PlayCircle className="w-5 h-5 text-[var(--accent-pink)]" />
                        Resources
                        <span className="text-sm font-normal text-[var(--text-muted)]">
                            ({form.resources.length})
                        </span>
                    </h2>
                </div>

                <div className="space-y-6">
                    {form.resources.map((res, index) => (
                        <div
                            key={res.id}
                            className="bg-[var(--bg-muted)]/30 border border-[var(--border-main)] rounded-lg p-5 space-y-4 relative group transition-all hover:border-[var(--accent-primary)]/30 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                    Resource {index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => updateResource(res.id, 'is_published', !res.is_published)}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${res.is_published ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'}`}
                                    >
                                        {res.is_published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {res.is_published ? 'Live' : 'Hidden'}
                                    </button>
                                    {form.resources.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeResource(res.id)}
                                            className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={labelCls}>Resource Title *</label>
                                    <input
                                        value={res.title}
                                        onChange={(e) => updateResource(res.id, 'title', e.target.value)}
                                        placeholder="e.g. Laws of UX"
                                        className={inputCls}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={labelCls}>URL *</label>
                                <div className="relative">
                                    <input
                                        value={res.url}
                                        onChange={(e) => updateResource(res.id, 'url', e.target.value)}
                                        placeholder="https://..."
                                        className={`${inputCls} font-mono text-sm`}
                                        required
                                    />
                                    {res.url && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded border border-[var(--accent-primary)]/20">
                                                {res.type}
                                            </span>
                                            <a href={res.url} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:opacity-80">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {['Video', 'Article', 'Book', 'Podcast', 'Course', 'Tool'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => updateResource(res.id, 'type', type)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${res.type === type
                                            ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/50 text-[var(--accent-primary)]'
                                            : 'bg-[var(--bg-muted)] border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent-primary)]/30'
                                            }`}
                                    >
                                        {type === 'Video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addResource}
                    className="w-full py-4 border-2 border-dashed border-[var(--border-main)] hover:border-[var(--accent-primary)]/50 rounded-xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] font-bold flex items-center justify-center gap-2 transition-all hover:bg-[var(--accent-primary)]/5 mt-4"
                >
                    <Plus className="w-5 h-5" />
                    Add Resource
                </button>
            </section>

            {/* ── Bottom Actions ───────────────────── */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border-main)]">
                <Link
                    to={`/admin/roadmap/${trackId}`}
                    className="px-5 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="px-8 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Topic
                </button>
            </div>
        </div>
    );
}
