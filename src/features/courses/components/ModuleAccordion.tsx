import React, { useState } from 'react';
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

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
    day,
    index,
    isCompleted = false,
    onToggleComplete
}) => {
    const [isExpanded, setIsExpanded] = useState(index === 0);

    // Fetch lessons for this day
    const { lessons, isLoading: lessonsLoading } = useCourseLessonsForDay(isExpanded ? day.id : undefined);

    // Get the first lesson id to fetch task (tasks are linked to lessons)
    const firstLessonId = lessons.length > 0 ? lessons[0].id : undefined;
    const { tasks } = useCourseTasksForLesson(isExpanded && firstLessonId ? firstLessonId : undefined);
    const task = tasks.length > 0 ? tasks[0] : null;

    return (
        <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isExpanded
            ? 'dark:border-purple-500/50 dark:shadow-lg dark:shadow-purple-500/10 border-purple-300 shadow-lg shadow-purple-100'
            : 'dark:border-slate-700 dark:hover:border-slate-600 border-slate-200 hover:border-slate-300'
            } dark:bg-slate-800/30 bg-white`}>

            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 rounded-3xl dark:hover:bg-slate-800/50 hover:bg-slate-50"
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
                        <h4 className="font-bold text-lg dark:text-white text-slate-900">{day.title}</h4>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                    </div>
                    {day.description && (
                        <p className="text-sm line-clamp-1 dark:text-slate-400 text-slate-600">{day.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {lessons.length > 0 && (
                        <span className="hidden md:flex items-center gap-1 text-sm dark:text-slate-500 text-slate-600">
                            <Clock className="w-4 h-4" />
                            {lessons.length} items
                        </span>
                    )}
                    <div className="p-2 rounded-xl dark:bg-slate-700 bg-slate-100">
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 dark:text-slate-300 text-slate-600" />
                        ) : (
                            <ChevronDown className="w-5 h-5 dark:text-slate-300 text-slate-600" />
                        )}
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t dark:border-slate-700 border-slate-100">
                    <div className="p-4 md:p-6 space-y-6">
                        {/* V.A.T. Labels */}
                        <div className="flex items-center gap-2 text-xs font-medium dark:text-slate-500 text-slate-600">
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
                            <p className="text-center text-slate-500 py-4">No resources yet.</p>
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
                                ? 'dark:bg-emerald-900/30 dark:text-emerald-400 dark:border dark:border-emerald-500/30 bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 bg-slate-100 text-slate-600 hover:bg-slate-200'
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
};

export default ModuleAccordion;
