import { Loader2 } from 'lucide-react'
import { usePublishedCategories, usePublishedCourses } from '@/hooks/use-public-courses'
import CourseContainer from '../components/CourseContainer'
import type { CourseCategoryDTO } from '@/services/course-categories'

const CATEGORY_ICONS = ['🧠', '🎨', '✍️', '💻', '📊', '🔍', '🚀', '📱'];
const CATEGORY_COLORS = [
    'bg-emerald-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
];

function CategoryBlock({ category, index }: { category: CourseCategoryDTO; index: number }) {
    const { courses, isLoading } = usePublishedCourses(category.id);
    const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

    return (
        <div className="relative mb-12">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b dark:border-slate-800 border-slate-200">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg text-2xl shrink-0 ${color}`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold dark:text-white text-slate-900">
                        {category.title}
                    </h2>
                    {category.description && (
                        <p className="text-sm md:text-base dark:text-slate-400 text-slate-600">{category.description}</p>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
            ) : courses.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No courses available yet.</p>
            ) : (
                <div className="flex flex-col space-y-4">
                    {courses.map((course, idx) => (
                        <div key={course.id} className="relative pl-0 md:pl-4 transition-all duration-300">
                            {idx !== courses.length - 1 && (
                                <div className="absolute left-[50%] md:left-[35px] top-full h-4 w-0.5 bg-emerald-500/20 hidden md:block" />
                            )}
                            <CourseContainer course={course} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CoursesListPage() {
    const { categories, isLoading } = usePublishedCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
            ) : categories.length === 0 ? (
                <p className="text-center text-slate-500 py-20">No courses available yet.</p>
            ) : (
                categories.map((category, index) => (
                    <CategoryBlock key={category.id} category={category} index={index} />
                ))
            )}
        </div>
    )
}
