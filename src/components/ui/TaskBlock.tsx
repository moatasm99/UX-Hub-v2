import type { Task } from '@/types/database'
import { MarkdownRenderer } from './MarkdownRenderer'

interface TaskBlockProps {
    tasks: Task[]
}

export function TaskBlock({ tasks }: TaskBlockProps) {
    return (
        <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Deliverables
            </h4>
            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
                    >
                        <div className="text-sm font-medium text-amber-900">
                            <MarkdownRenderer content={task.description} />
                        </div>
                        {task.deliverable_hint && (
                            <div className="mt-1 text-xs text-amber-700">
                                💡 <MarkdownRenderer content={task.deliverable_hint} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
