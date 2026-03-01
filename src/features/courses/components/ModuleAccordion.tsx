import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import ResourceItem from './ResourceItem';
import TaskBadge from './TaskBadge';
import type { CourseDayDTO } from '@/services/course-days';
import { useCourseLessonsForDay, useCourseTasksForLesson } from '@/hooks/use-public-courses';

interface ModuleAccordionProps {
    day: CourseDayDTO;
    index: number;
    isCompleted?: boolean;
    onToggleComplete?: () => void;
}

const ModuleAccordion = memo(({
    day,
    index,
    isCompleted = false,
    onToggleComplete
}: ModuleAccordionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Fetch lessons for this day (Immediately for instant expansion)
    const { lessons, isLoading: lessonsLoading } = useCourseLessonsForDay(day.id);

    // Get the first lesson id to fetch task (tasks are linked to lessons)
    const firstLessonId = lessons.length > 0 ? lessons[0].id : undefined;
    const { tasks } = useCourseTasksForLesson(firstLessonId);
    const task = tasks.length > 0 ? tasks[0] : null;

    return (
        <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isExpanded
            ? 'border-[var(--accent-primary)]/50 dark:shadow-lg dark:shadow-purple-500/10 shadow-lg shadow-purple-100'
            : 'border-[var(--border-main)] hover:border-[var(--border-strong)]'
            } bg-[var(--bg-card)]`}>

            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent-primary)] rounded-3xl hover:bg-[var(--bg-secondary)]"
            >
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${isCompleted
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                    : 'bg-gradient-to-br from-purple-500 to-violet-600'
                    } text-white`}>
                    <span className="text-xs font-medium opacity-80">Day</span>
                    <span className="text-xl font-bold">{day.position || index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-[var(--text-main)]">{day.title}</h4>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                    </div>
                    {day.description && (
                        <p className="text-sm line-clamp-1 text-[var(--text-secondary)]">{day.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {lessons.length > 0 && (
                        <span className="hidden md:flex items-center gap-1 text-sm text-[var(--text-muted)]">
                            <Clock className="w-4 h-4" />
                            {lessons.length} items
                        </span>
                    )}
                    <div className="p-2 rounded-xl bg-[var(--bg-muted)]">
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                        )}
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-[var(--border-main)]">
                    <div className="p-4 md:p-6 space-y-6">
                        {/* V.A.T. Labels */}
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                            <span className="px-2 py-1 rounded-lg bg-red-500/10 text-red-500">📺 Video</span>
                            <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500">📄 Article</span>
                            <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500">🛠️ Task</span>
                            <span className="ml-auto">V.A.T. Model</span>
                        </div>

                        {/* Resources */}
                        {lessonsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                            </div>
                        ) : lessons.length === 0 ? (
                            <p className="text-center text-[var(--text-muted)] py-4">No resources yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {lessons.map(lesson => (
                                    <ResourceItem
                                        key={lesson.id}
                                        resource={{
                                            type: lesson.type,
                                            title: lesson.title,
                                            url: lesson.url,
                                            duration: lesson.duration ?? undefined,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Task */}
                        {task && (
                            <TaskBadge task={{
                                title: task.title,
                                description: task.description ?? '',
                                deliverable: 'Complete the task',
                            }} />
                        )}

                        {/* Mark Complete */}
                        <button
                            onClick={onToggleComplete}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-3xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isCompleted
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                }`}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {isCompleted ? 'Completed! ✓' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

ModuleAccordion.displayName = 'ModuleAccordion';

export default ModuleAccordion;
