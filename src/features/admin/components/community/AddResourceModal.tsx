import { useState, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { CommunitySubmissionDTO, communitySubmissionsService } from '@/services/community-submissions';
import { usePublishedCategories, usePublishedCourses } from '@/hooks/use-public-courses';
import { courseDaysService, CourseDayDTO } from '@/services/course-days';
import { courseLessonsService } from '@/services/course-lessons';
import { roadmapTracksService } from '@/services/roadmap-tracks';
import { roadmapTopicsService, RoadmapTopicDTO } from '@/services/roadmap-topics';
import { roadmapResourcesService } from '@/services/roadmap-resources';
import { detectResourceType } from '@/utils/resource-detection';
import type { RoadmapTrackDTO } from '@/services/roadmap-tracks';

type DestinationType = 'course' | 'roadmap';

interface AddResourceModalProps {
    submission: CommunitySubmissionDTO;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddResourceModal({ submission, onClose, onSuccess }: AddResourceModalProps) {
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-3xl border-2 border-purple-200 dark:border-purple-500/30 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-b border-purple-100 dark:border-purple-500/20">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">➕ Add Resource to Platform</h2>
                    <p className="text-sm text-slate-500 mt-0.5">{submission.title}</p>
                    <div className="flex items-center gap-2 mt-3">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-purple-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                    </div>
                </div>

                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Destination Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => { setDestinationType('course'); setStep(2); }}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${destinationType === 'course' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                            >
                                <div className="text-lg mb-1">📚</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Intensive Course</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setDestinationType('roadmap'); setStep(2); }}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${destinationType === 'roadmap' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                            >
                                <div className="text-lg mb-1">🚀</div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Product Design Roadmap</div>
                            </button>
                        </div>
                    </div>

                    {destinationType === 'course' && (
                        <div className="space-y-4">
                            <SelectField
                                label="Category"
                                value={selectedCategoryId}
                                onChange={(v: string) => { setSelectedCategoryId(v); setStep(2); }}
                                options={categories.map(c => ({ value: c.id, label: c.title }))}
                            />
                            {selectedCategoryId && (
                                <SelectField
                                    label="Course"
                                    value={selectedCourseId}
                                    onChange={(v: string) => { setSelectedCourseId(v); setStep(2); }}
                                    options={courses.map(c => ({ value: c.id, label: c.title }))}
                                />
                            )}
                            {selectedCourseId && (
                                <SelectField
                                    label="Day"
                                    value={selectedDayId}
                                    onChange={(v: string) => { setSelectedDayId(v); setStep(3); }}
                                    options={days.map(d => ({ value: d.id, label: `Day ${d.position} – ${d.title}` }))}
                                    placeholder={daysLoading ? 'Loading days...' : 'Select day...'}
                                    disabled={daysLoading}
                                />
                            )}
                        </div>
                    )}

                    {destinationType === 'roadmap' && (
                        <div className="space-y-4">
                            <SelectField
                                label="Track"
                                value={selectedTrackId}
                                onChange={(v: string) => { setSelectedTrackId(v); setStep(2); }}
                                options={tracks.map(t => ({ value: t.id, label: t.title }))}
                                placeholder={tracksLoading ? 'Loading tracks...' : 'Select track...'}
                                disabled={tracksLoading}
                            />
                            {selectedTrackId && (
                                <SelectField
                                    label="Topic"
                                    value={selectedTopicId}
                                    onChange={(v: string) => { setSelectedTopicId(v); setStep(3); }}
                                    options={topics.map(t => ({ value: t.id, label: t.title }))}
                                    placeholder={topicsLoading ? 'Loading topics...' : 'Select topic...'}
                                    disabled={topicsLoading}
                                />
                            )}
                        </div>
                    )}

                    {canConfirm && (
                        <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-2">
                            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Preview</h4>
                            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                                <p><span className="font-medium">Title:</span> {submission.title}</p>
                                <p><span className="font-medium">URL:</span> <span className="text-purple-600 dark:text-purple-400">{submission.url}</span></p>
                                <p><span className="font-medium">Destination:</span> {getDestinationLabel()}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!canConfirm || submitting}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${canConfirm && !submitting ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/25' : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'}`}
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        {submitting ? 'Adding...' : 'Confirm & Add Resource'}
                    </button>
                </div>
            </div>
        </div>
    );
}

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
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 appearance-none"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
