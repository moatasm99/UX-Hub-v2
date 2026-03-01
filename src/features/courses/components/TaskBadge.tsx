import React from 'react';
import { ClipboardCheck, FileCheck } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

interface Task {
    title: string;
    description: string;
    deliverable: string;
}

interface TaskBadgeProps {
    task: Task;
}

const TaskBadge: React.FC<TaskBadgeProps> = ({ task }) => {
    return (
        <div className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all
            dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-500/40
            bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400`}>
            {/* Header Badge */}
            <div className="flex items-center gap-2 px-4 py-2 border-b dark:border-amber-500/20 dark:bg-amber-900/30 border-amber-200 bg-amber-100">
                <ClipboardCheck className="w-4 h-4 dark:text-amber-400 text-amber-600" />
                <span className="text-sm font-bold uppercase tracking-wider dark:text-amber-400 text-amber-700">
                    🛠️ Mandatory Task
                </span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium dark:bg-amber-500/20 dark:text-amber-300 bg-amber-200 text-amber-800">
                    Required
                </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h4 className="font-bold text-lg text-amber-900 dark:text-amber-300">
                    {task.title}
                </h4>
                <div className="text-sm border-none text-[var(--text-secondary)]">
                    <MarkdownRenderer content={task.description} />
                </div>

                {/* Deliverable */}
                <div className="flex items-center gap-2 pt-2 border-t border-amber-200 dark:border-amber-500/20">
                    <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                        Deliverable:
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {task.deliverable}
                    </span>
                </div>
            </div>

            {/* Corner Decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-2 right-[-20px] w-16 text-center text-xs font-bold py-1 transform rotate-45 dark:bg-amber-500 dark:text-amber-900 bg-amber-400 text-white">
                    DO IT
                </div>
            </div>
        </div>
    );
};

export default TaskBadge;
