import type { Task } from '@/types/database'
import { MarkdownRenderer } from './MarkdownRenderer'

interface TaskBlockProps {
    tasks: Task[]
}

export function TaskBlock({ tasks }: TaskBlockProps) {
    return (
        <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Deliverables
            </h4>
            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2"
                    >
                        <div className="text-sm font-medium text-amber-700 dark:text-amber-200">
                            <MarkdownRenderer content={task.description} />
                        </div>
                        {task.deliverable_hint && (
                            <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                💡 <MarkdownRenderer content={task.deliverable_hint} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
