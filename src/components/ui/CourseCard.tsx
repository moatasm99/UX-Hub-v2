import type { Course } from '@/types/database'
import { motion } from 'framer-motion'
import { hoverLift } from '@/lib/motion'

interface CourseCardProps {
    course: Course
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <motion.div
            variants={hoverLift}
            whileHover="hover"
            whileTap="tap"
            className="group cursor-pointer rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] p-6 shadow-sm transition-all hover:border-[var(--accent-primary)]/30 hover:shadow-md"
        >
            <div className="flex items-start gap-3">
                {course.icon && (
                    <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-2xl"
                    >
                        {course.icon}
                    </motion.span>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {course.title}
                    </h3>
                    {course.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">
                            {course.description}
                        </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                        <TagBadge label={course.type} />
                        {course.category && (
                            <TagBadge label={course.category} variant="secondary" />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Inline TagBadge for co-location ────────────────────
interface TagBadgeProps {
    label: string
    variant?: 'primary' | 'secondary'
}

function TagBadge({ label, variant = 'primary' }: TagBadgeProps) {
    const styles =
        variant === 'primary'
            ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
            : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]'

    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
        >
            {label}
        </span>
    )
}
