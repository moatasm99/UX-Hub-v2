import { useState } from 'react'
import type { Module } from '@/types/database'
import { useResourcesByModule } from '@/hooks/use-resources'
import { useTasksByModule } from '@/hooks/use-resources'
import { ResourceList } from './ResourceList'
import { TaskBlock } from './TaskBlock'
import { LoadingSkeleton } from './LoadingSkeleton'

interface ModuleAccordionProps {
    module: Module
}

export function ModuleAccordion({ module }: ModuleAccordionProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
            >
                <div className="flex items-center gap-3">
                    {module.day_number != null && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                            {module.day_number}
                        </span>
                    )}
                    <div>
                        <h3 className="font-medium text-gray-800">{module.title}</h3>
                        {module.description && (
                            <p className="mt-0.5 text-sm text-gray-500">
                                {module.description}
                            </p>
                        )}
                    </div>
                </div>
                <span
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                >
                    ▼
                </span>
            </button>

            {isOpen && <ModuleContent moduleId={module.id} />}
        </div>
    )
}

// ─── Inner content (only fetches when expanded) ──────────
function ModuleContent({ moduleId }: { moduleId: string }) {
    const { data: resources, isLoading: resLoading } = useResourcesByModule(moduleId)
    const { data: tasks, isLoading: tasksLoading } = useTasksByModule(moduleId)

    if (resLoading || tasksLoading) {
        return (
            <div className="space-y-3 border-t border-gray-100 px-5 py-4">
                <LoadingSkeleton className="h-6 w-1/3 rounded" />
                <LoadingSkeleton className="h-4 w-full rounded" />
                <LoadingSkeleton className="h-4 w-2/3 rounded" />
            </div>
        )
    }

    return (
        <div className="space-y-4 border-t border-gray-100 px-5 py-4">
            {resources && resources.length > 0 && (
                <ResourceList resources={resources} />
            )}
            {tasks && tasks.length > 0 && <TaskBlock tasks={tasks} />}
            {(!resources || resources.length === 0) &&
                (!tasks || tasks.length === 0) && (
                    <p className="text-sm text-gray-400">No content available yet.</p>
                )}
        </div>
    )
}
