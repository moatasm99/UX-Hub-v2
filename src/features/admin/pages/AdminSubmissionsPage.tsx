import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, XCircle, Plus, ExternalLink, MessageSquare, Lightbulb, Link2, Clock, ArrowLeft, Info } from 'lucide-react';
import { communitySubmissionsService, CommunitySubmissionDTO, SubmissionStatus } from '@/services/community-submissions';
import { usePublishedCategories, usePublishedCourses } from '@/hooks/use-public-courses';
import { courseDaysService, CourseDayDTO } from '@/services/course-days';
import { courseLessonsService } from '@/services/course-lessons';
import { roadmapTracksService } from '@/services/roadmap-tracks';
import { roadmapTopicsService, RoadmapTopicDTO } from '@/services/roadmap-topics';
import { roadmapResourcesService } from '@/services/roadmap-resources';
import { detectResourceType } from '@/utils/resource-detection';
import { Link } from 'react-router-dom';
import type { RoadmapTrackDTO } from '@/services/roadmap-tracks';

const STATUS_TABS: { value: SubmissionStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
    { value: 'approved', label: 'Approved', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'rejected', label: 'Rejected', icon: <XCircle className="w-4 h-4" /> },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
    feedback: <MessageSquare className="w-3.5 h-3.5" />,
    suggestion: <Lightbulb className="w-3.5 h-3.5" />,
    resource: <Link2 className="w-3.5 h-3.5" />,
};

const TYPE_COLORS: Record<string, string> = {
    feedback: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    suggestion: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    resource: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export default function AdminSubmissionsPage() {
    const [activeTab, setActiveTab] = useState<SubmissionStatus>('pending');
    const [submissions, setSubmissions] = useState<CommunitySubmissionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Add Resource modal
    const [modalSubmission, setModalSubmission] = useState<CommunitySubmissionDTO | null>(null);

    const loadSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await communitySubmissionsService.getByStatus(activeTab);
            setSubmissions(data);
        } catch {
            console.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

    const handleStatusChange = async (id: string, status: SubmissionStatus) => {
        setActionLoading(id);
        try {
            await communitySubmissionsService.updateStatus(id, status);
            setSubmissions(prev => prev.filter(s => s.id !== id));
        } catch {
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/admin" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            💬 Community Submissions
                        </h1>
                        <p className="text-sm text-slate-500">Review feedback, suggestions, and resource submissions</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 w-fit">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${activeTab === tab.value
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.value && !loading && (
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                                {submissions.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No {activeTab} submissions</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {submissions.map(sub => (
                        <div
                            key={sub.id}
                            className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                        >
                            {/* Type badge + date */}
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${TYPE_COLORS[sub.type]}`}>
                                    {TYPE_ICONS[sub.type]}
                                    {sub.type}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-slate-900 dark:text-white">{sub.title}</h3>

                            {/* Message */}
                            {sub.message && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                    {sub.message}
                                </p>
                            )}

                            {/* URL */}
                            {sub.url && (
                                <a
                                    href={sub.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400 hover:underline truncate max-w-full"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate text-xs">{sub.url}</span>
                                </a>
                            )}

                            {/* Context Origin */}
                            {(sub.context_title || sub.context_url) && (
                                <div className="pt-2 mt-1 border-t border-slate-50 dark:border-slate-800/50">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <Info className="w-3 h-3" />
                                        Originated from
                                    </div>
                                    {sub.context_url ? (
                                        <a
                                            href={sub.context_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-slate-500 hover:text-purple-500 hover:underline flex items-center gap-1 transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3 shrink-0" />
                                            {sub.context_title || 'Link'}
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-500">{sub.context_title}</span>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            {activeTab === 'pending' && (
                                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleStatusChange(sub.id, 'approved')}
                                        disabled={actionLoading === sub.id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(sub.id, 'rejected')}
                                        disabled={actionLoading === sub.id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                        <XCircle className="w-3.5 h-3.5" />
                                        Reject
                                    </button>
                                    {sub.type === 'resource' && sub.url && (
                                        <button
                                            onClick={() => setModalSubmission(sub)}
                                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40 transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Add
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Smart Add Resource Modal */}
            {modalSubmission && (
                <AddResourceModal
                    submission={modalSubmission}
                    onClose={() => setModalSubmission(null)}
                    onSuccess={() => {
                        setSubmissions(prev => prev.filter(s => s.id !== modalSubmission.id));
                        setModalSubmission(null);
                    }}
                />
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Smart Add Resource Modal
   ═══════════════════════════════════════════════════ */

type DestinationType = 'course' | 'roadmap';

interface AddResourceModalProps {
    submission: CommunitySubmissionDTO;
    onClose: () => void;
    onSuccess: () => void;
}

function AddResourceModal({ submission, onClose, onSuccess }: AddResourceModalProps) {
    const [step, setStep] = useState(1);
    const [destinationType, setDestinationType] = useState<DestinationType | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Course path
    const { categories } = usePublishedCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const { courses } = usePublishedCourses(selectedCategoryId || undefined);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [days, setDays] = useState<CourseDayDTO[]>([]);
    const [selectedDayId, setSelectedDayId] = useState('');
    const [daysLoading, setDaysLoading] = useState(false);

    // Roadmap path
    const [tracks, setTracks] = useState<RoadmapTrackDTO[]>([]);
    const [selectedTrackId, setSelectedTrackId] = useState('');
    const [topics, setTopics] = useState<RoadmapTopicDTO[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [tracksLoading, setTracksLoading] = useState(false);
    const [topicsLoading, setTopicsLoading] = useState(false);

    // Load tracks when roadmap selected
    useEffect(() => {
        if (destinationType === 'roadmap') {
            setTracksLoading(true);
            roadmapTracksService.getPublished().then(data => {
                setTracks(data);
                setTracksLoading(false);
            });
        }
    }, [destinationType]);

    // Load days when course selected
    useEffect(() => {
        if (selectedCourseId) {
            setDaysLoading(true);
            setSelectedDayId('');
            courseDaysService.getAll(selectedCourseId).then(data => {
                setDays(data);
                setDaysLoading(false);
            });
        }
    }, [selectedCourseId]);

    // Load topics when track selected
    useEffect(() => {
        if (selectedTrackId) {
            setTopicsLoading(true);
            setSelectedTopicId('');
            roadmapTopicsService.getPublishedByTrack(selectedTrackId).then(data => {
                setTopics(data);
                setTopicsLoading(false);
            });
        }
    }, [selectedTrackId]);

    // Reset downstream when category changes
    useEffect(() => {
        setSelectedCourseId('');
        setSelectedDayId('');
        setDays([]);
    }, [selectedCategoryId]);

    const resourceType = detectResourceType(submission.url || '') || 'Article';

    const canConfirm =
        destinationType === 'course'
            ? !!selectedDayId
            : destinationType === 'roadmap'
                ? !!selectedTopicId
                : false;

    // Build destination label for preview
    const getDestinationLabel = () => {
        if (destinationType === 'course') {
            const cat = categories.find(c => c.id === selectedCategoryId);
            const course = courses.find(c => c.id === selectedCourseId);
            const day = days.find(d => d.id === selectedDayId);
            return [cat?.title, course?.title, day?.title].filter(Boolean).join(' → ');
        }
        if (destinationType === 'roadmap') {
            const track = tracks.find(t => t.id === selectedTrackId);
            const topic = topics.find(t => t.id === selectedTopicId);
            return [track?.title, topic?.title].filter(Boolean).join(' → ');
        }
        return '';
    };

    const handleConfirm = async () => {
        if (!canConfirm || submitting) return;
        setSubmitting(true);

        try {
            if (destinationType === 'course' && selectedDayId) {
                // Get current lesson count for position
                const existing = await courseLessonsService.getAll(selectedDayId);
                await courseLessonsService.create({
                    day_id: selectedDayId,
                    title: submission.title,
                    url: submission.url!,
                    type: resourceType as 'Video' | 'Article',
                    duration: null,
                    position: existing.length + 1,
                });
            } else if (destinationType === 'roadmap' && selectedTopicId) {
                const existing = await roadmapResourcesService.getByTopic(selectedTopicId);
                await roadmapResourcesService.create({
                    topic_id: selectedTopicId,
                    title: submission.title,
                    url: submission.url!,
                    type: resourceType as any,
                    position: existing.length + 1,
                    is_published: true,
                });
            }

            // Mark as approved
            await communitySubmissionsService.updateStatus(submission.id, 'approved');
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to add resource. Check console.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg rounded-3xl border-2 border-purple-200 dark:border-purple-500/30 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-b border-purple-100 dark:border-purple-500/20">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        ➕ Add Resource to Platform
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {submission.title}
                    </p>
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-3">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-purple-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                    </div>
                </div>

                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Step 1: Choose destination type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Destination Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => { setDestinationType('course'); setStep(2); }}
                                className={`p-4 rounded-xl border-2 text-left transition-all
                                    ${destinationType === 'course'
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <div className="text-lg mb-1">📚</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Intensive Course</div>
                                <div className="text-xs text-slate-500">Add to a course day</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setDestinationType('roadmap'); setStep(2); }}
                                className={`p-4 rounded-xl border-2 text-left transition-all
                                    ${destinationType === 'roadmap'
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <div className="text-lg mb-1">🚀</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Product Design Roadmap</div>
                                <div className="text-xs text-slate-500">Add to a roadmap topic</div>
                            </button>
                        </div>
                    </div>

                    {/* Intensive Course Path */}
                    {destinationType === 'course' && (
                        <div className="space-y-4">
                            {/* Category */}
                            <SelectField
                                label="Category"
                                value={selectedCategoryId}
                                onChange={v => { setSelectedCategoryId(v); setStep(2); }}
                                options={categories.map(c => ({ value: c.id, label: c.title }))}
                                placeholder="Select category..."
                            />

                            {/* Course */}
                            {selectedCategoryId && (
                                <SelectField
                                    label="Course"
                                    value={selectedCourseId}
                                    onChange={v => { setSelectedCourseId(v); setStep(2); }}
                                    options={courses.map(c => ({ value: c.id, label: c.title }))}
                                    placeholder="Select course..."
                                />
                            )}

                            {/* Day */}
                            {selectedCourseId && (
                                <SelectField
                                    label="Day"
                                    value={selectedDayId}
                                    onChange={v => { setSelectedDayId(v); setStep(3); }}
                                    options={days.map(d => ({ value: d.id, label: `Day ${d.position} – ${d.title}` }))}
                                    placeholder={daysLoading ? 'Loading days...' : 'Select day...'}
                                    disabled={daysLoading}
                                />
                            )}
                        </div>
                    )}

                    {/* Roadmap Path */}
                    {destinationType === 'roadmap' && (
                        <div className="space-y-4">
                            {/* Track */}
                            <SelectField
                                label="Track"
                                value={selectedTrackId}
                                onChange={v => { setSelectedTrackId(v); setStep(2); }}
                                options={tracks.map(t => ({ value: t.id, label: t.title }))}
                                placeholder={tracksLoading ? 'Loading tracks...' : 'Select track...'}
                                disabled={tracksLoading}
                            />

                            {/* Topic */}
                            {selectedTrackId && (
                                <SelectField
                                    label="Topic"
                                    value={selectedTopicId}
                                    onChange={v => { setSelectedTopicId(v); setStep(3); }}
                                    options={topics.map(t => ({ value: t.id, label: t.title }))}
                                    placeholder={topicsLoading ? 'Loading topics...' : 'Select topic...'}
                                    disabled={topicsLoading}
                                />
                            )}
                        </div>
                    )}

                    {/* Preview Summary */}
                    {canConfirm && (
                        <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-2">
                            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Preview</h4>
                            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                <p><span className="font-medium">Title:</span> {submission.title}</p>
                                <p><span className="font-medium">URL:</span> <a href={submission.url!} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline truncate">{submission.url}</a></p>
                                <p><span className="font-medium">Type:</span> {resourceType}</p>
                                <p><span className="font-medium">Destination:</span> {getDestinationLabel()}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!canConfirm || submitting}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all
                            ${canConfirm && !submitting
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/25'
                                : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                            }`}
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        {submitting ? 'Adding...' : 'Confirm & Add Resource'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Reusable Select Field
   ═══════════════════════════════════════════════════ */

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
}

function SelectField({ label, value, onChange, options, placeholder = 'Select...', disabled }: SelectFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
                <option value="">{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
