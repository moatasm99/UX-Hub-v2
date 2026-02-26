import type { Course } from '@/types/database'

interface CourseCardProps {
    course: Course
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
            <div className="flex items-start gap-3">
                {course.icon && (
                    <span className="text-2xl">{course.icon}</span>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                        {course.title}
                    </h3>
                    {course.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
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
        </div>
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
            ? 'bg-blue-50 text-blue-700'
            : 'bg-gray-100 text-gray-600'

    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
        >
            {label}
        </span>
    )
}
