import { useParams, Link } from 'react-router-dom'
import { useCoursesByCategory } from '@/hooks/use-courses'
import { CourseCard } from '@/components/ui/CourseCard'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export default function RoadmapDetailPage() {
    const { category } = useParams<{ category: string }>()
    const decodedCategory = decodeURIComponent(category ?? '')
    const { data: courses, isLoading, error } = useCoursesByCategory(decodedCategory)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton className="h-10 w-1/3 rounded-lg" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <LoadingSkeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                Failed to load roadmap. Please try again later.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to="/roadmap"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Back to roadmaps
                </Link>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">
                    {decodedCategory}
                </h1>
            </div>

            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p className="py-12 text-center text-gray-500">
                    No courses in this category yet.
                </p>
            )}
        </div>
    )
}
