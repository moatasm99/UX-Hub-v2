import React, { useState } from 'react';
import { ChevronDown, Clock, Layers, Trophy, Loader2 } from 'lucide-react';
import ModuleAccordion from './ModuleAccordion';
import type { IntensiveCourseDTO } from '@/services/intensive-courses';
import { usePublishedCourseDays } from '@/hooks/use-public-courses';
import { CourseIcon } from '@/components/IconSelector';


interface CourseContainerProps {
    course: IntensiveCourseDTO;
}

const CourseContainer: React.FC<CourseContainerProps> = ({ course }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());

    // Fetch days only when expanded (lazy load)
    const { days, isLoading: daysLoading } = usePublishedCourseDays(isExpanded ? course.id : undefined);

    const toggleModuleComplete = (index: number) => {
        setCompletedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) newSet.delete(index); else newSet.add(index);
            return newSet;
        });
    };

    const dayCount = days.length;
    const progressPercent = dayCount > 0 ? (completedModules.size / dayCount) * 100 : 0;

    // Badge rendering logic
    const badgeLabel = course.badge_label;
    const badgeGradient = course.badge_color || "from-slate-500 to-slate-600";

    return (
        <div className={`rounded-3xl border-2 overflow-hidden transition-all duration-500 ${isExpanded
            ? 'dark:border-purple-500 dark:shadow-2xl dark:shadow-purple-500/20 border-purple-400 shadow-2xl shadow-purple-200'
            : 'dark:border-slate-700 dark:hover:border-slate-600 border-slate-200 hover:border-slate-300'
            } dark:bg-slate-900 bg-white`}>

            {/* Course Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); }
                }}
                className="cursor-pointer w-full p-5 dark:hover:bg-slate-800/50 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 rounded-3xl"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">

                    {/* LEFT: Icon & Main Info */}
                    <div className="flex items-start md:items-center gap-4 flex-1">
                        {course.icon_key ? (
                            <CourseIcon
                                iconKey={course.icon_key}
                                bgColor={course.icon_bg_color}
                                size={56}
                                className="shadow-md"
                            />
                        ) : (
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badgeGradient} flex items-center justify-center text-2xl shadow-md shrink-0 uppercase font-bold text-white/20`}>
                                {course.level?.[0] || '📚'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {badgeLabel && (
                                    <span className={`hidden md:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${badgeGradient} text-white shadow-sm`}>
                                        {badgeLabel}
                                    </span>
                                )}
                                {completedModules.size > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        <Trophy className="w-3 h-3" /> {Math.round(progressPercent)}%
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold truncate pr-2 dark:text-white text-slate-900">
                                {course.title}
                            </h3>
                            {course.short_description && (
                                <p className="text-sm line-clamp-1 md:line-clamp-1 dark:text-slate-400 text-slate-600">
                                    {course.short_description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Metadata & Chevron */}
                    <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-dashed border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-4 text-xs font-medium opacity-80">
                            {course.level && (
                                <span className="flex items-center gap-1 dark:text-slate-400 text-slate-600">
                                    <Clock className="w-3.5 h-3.5" />
                                    {course.level}
                                </span>
                            )}
                            {dayCount > 0 && (
                                <span className="flex items-center gap-1 dark:text-slate-400 text-slate-600">
                                    <Layers className="w-3.5 h-3.5" />
                                    {dayCount} Days
                                </span>
                            )}
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-purple-500 text-white rotate-180' : 'dark:bg-slate-800 dark:text-slate-400 dark:hover:text-purple-400 bg-slate-100 text-slate-600 hover:text-purple-600'}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {completedModules.size > 0 && (
                    <div className="mt-4 md:mt-0 absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t dark:border-slate-700 border-slate-200">
                    <div className="px-6 md:px-8 py-4 dark:bg-gradient-to-r dark:from-purple-900/30 dark:to-violet-900/30 bg-gradient-to-r from-purple-50 to-violet-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium dark:text-purple-300 text-purple-700">
                                📚 Course Modules ({dayCount} Days)
                            </p>
                            <p className="text-sm dark:text-slate-400 text-slate-600">
                                Each module follows the <span className="font-bold">V.A.T.</span> Model
                            </p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                        {daysLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                            </div>
                        ) : days.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">No modules available yet.</p>
                        ) : (
                            days.map((day, index) => (
                                <ModuleAccordion
                                    key={day.id}
                                    day={day}
                                    index={index}
                                    isCompleted={completedModules.has(index)}
                                    onToggleComplete={() => toggleModuleComplete(index)}
                                />
                            ))
                        )}
                    </div>

                    {dayCount > 0 && completedModules.size === dayCount && (
                        <div className="mx-6 md:mx-8 mb-6 md:mb-8 p-6 rounded-3xl text-center dark:bg-gradient-to-r dark:from-emerald-900/30 dark:to-green-900/30 dark:border dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                            <div className="text-4xl mb-2">🎉</div>
                            <h4 className="text-xl font-bold mb-1 dark:text-emerald-400 text-emerald-700">Course Complete!</h4>
                            <p className="text-sm dark:text-slate-400 text-slate-600">You've completed all modules. Ready for the next course?</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseContainer;
