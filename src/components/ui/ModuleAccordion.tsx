import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { accordionVariants } from '@/lib/motion'
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
        <div className="rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] shadow-sm overflow-hidden flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[var(--bg-muted)]"
            >
                <div className="flex items-center gap-3">
                    {module.day_number != null && (
                        <motion.span
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-primary)]/10 text-sm font-semibold text-[var(--accent-primary)]"
                        >
                            {module.day_number}
                        </motion.span>
                    )}
                    <div>
                        <h3 className="font-medium text-[var(--text-main)]">{module.title}</h3>
                        {module.description && (
                            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                                {module.description}
                            </p>
                        )}
                    </div>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[var(--text-tertiary)]"
                >
                    ▼
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={accordionVariants}
                    >
                        <ModuleContent moduleId={module.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Inner content (only fetches when expanded) ──────────
function ModuleContent({ moduleId }: { moduleId: string }) {
    const { data: resources, isLoading: resLoading } = useResourcesByModule(moduleId)
    const { data: tasks, isLoading: tasksLoading } = useTasksByModule(moduleId)

    if (resLoading || tasksLoading) {
        return (
            <div className="space-y-3 border-t border-[var(--border-main)] px-5 py-4">
                <LoadingSkeleton className="h-6 w-1/3 rounded" />
                <LoadingSkeleton className="h-4 w-full rounded" />
                <LoadingSkeleton className="h-4 w-2/3 rounded" />
            </div>
        )
    }

    return (
        <div className="space-y-4 border-t border-[var(--border-main)] px-5 py-4">
            {resources && resources.length > 0 && (
                <ResourceList resources={resources} />
            )}
            {tasks && tasks.length > 0 && <TaskBlock tasks={tasks} />}
            {(!resources || resources.length === 0) &&
                (!tasks || tasks.length === 0) && (
                    <p className="text-sm text-[var(--text-tertiary)]">No content available yet.</p>
                )}
        </div>
    )
}
