import { usePublishedCategories, usePublishedCourses } from '@/hooks/use-public-courses'
import CourseContainer from '../components/CourseContainer'
import type { CourseCategoryDTO } from '@/services/course-categories'
import { CommunityFeedbackSection } from '@/features/community/components/CommunityFeedbackSection'
import { SafeQuery } from '@/components/common/SafeQuery';
import { IntensiveCourseDTO } from '@/services/intensive-courses';
import { CourseCardGridSkeleton } from '@/components/ui/skeletons';
import { motion } from 'framer-motion'
import { fadeInUp, staggerChildren } from '@/lib/motion'

const CATEGORY_ICONS = ['🧠', '🎨', '✍️', '💻', '📊', '🔍', '🚀', '📱'];
const CATEGORY_COLORS = [
    'bg-emerald-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
];

function CategoryBlock({ category, index }: { category: CourseCategoryDTO; index: number }) {
    const { courses, isLoading, isError } = usePublishedCourses(category.id);
    const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

    return (
        <div className="relative mb-12">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border-main)]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg text-2xl shrink-0 ${color}`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
                        {category.title}
                    </h2>
                    {category.description && (
                        <p className="text-sm md:text-base text-[var(--text-secondary)]">{category.description}</p>
                    )}
                </div>
            </div>

            <SafeQuery
                data={courses}
                isLoading={isLoading}
                error={isError ? new Error('Failed to load courses') : null}
                loadingFallback={
                    <CourseCardGridSkeleton count={2} />
                }
            >
                {(courses: IntensiveCourseDTO[]) => (
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
            </SafeQuery>
        </div>
    );
}

export default function CoursesListPage() {
    const { categories, isLoading, isError } = usePublishedCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <SafeQuery
                data={categories}
                isLoading={isLoading}
                error={isError ? new Error('Failed to load categories') : null}
                loadingFallback={
                    <div className="space-y-12">
                        {[1, 2].map(i => (
                            <div key={i} className="space-y-6">
                                <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-main)]">
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-muted)] animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-6 w-48 bg-[var(--bg-muted)] rounded animate-pulse" />
                                        <div className="h-4 w-64 bg-[var(--bg-muted)] rounded animate-pulse" />
                                    </div>
                                </div>
                                <CourseCardGridSkeleton count={2} />
                            </div>
                        ))}
                    </div>
                }
            >
                {(categories: CourseCategoryDTO[]) => (
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerChildren(0.1)}
                    >
                        {categories.map((category, index) => (
                            <motion.div key={category.id} variants={fadeInUp}>
                                <CategoryBlock category={category} index={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </SafeQuery>

            <div className="mt-16 border-t border-[var(--border-main)]">
                <CommunityFeedbackSection />
            </div>
        </div>
    )
}
