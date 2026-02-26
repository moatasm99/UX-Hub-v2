import { useParams, Link } from 'react-router-dom'
import { useCourse } from '@/hooks/use-courses'
import { useModulesByCourse } from '@/hooks/use-modules'
import { ModuleAccordion } from '@/components/ui/ModuleAccordion'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export default function CourseDetailPage() {
    const { courseId } = useParams<{ courseId: string }>()
    const { data: course, isLoading: courseLoading } = useCourse(courseId ?? '')
    const { data: modules, isLoading: modulesLoading } = useModulesByCourse(courseId ?? '')

    if (courseLoading || modulesLoading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton className="h-10 w-1/3 rounded-lg" />
                <LoadingSkeleton className="h-6 w-2/3 rounded-lg" />
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <LoadingSkeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-500">Course not found.</p>
                <Link to="/intensive" className="mt-4 inline-block text-blue-600 hover:underline">
                    ← Back to courses
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* ─── Header ─── */}
            <div>
                <Link
                    to="/intensive"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to courses
                </Link>
                <div className="mt-4 flex items-center gap-3">
                    {course.icon && <span className="text-3xl">{course.icon}</span>}
                    <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                </div>
                {course.description && (
                    <p className="mt-2 max-w-2xl text-gray-600">{course.description}</p>
                )}
            </div>

            {/* ─── Modules ─── */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Modules ({modules?.length ?? 0})
                </h2>
                {modules && modules.length > 0 ? (
                    <div className="space-y-3">
                        {modules.map((module) => (
                            <ModuleAccordion key={module.id} module={module} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No modules available yet.</p>
                )}
            </section>
        </div>
    )
}
