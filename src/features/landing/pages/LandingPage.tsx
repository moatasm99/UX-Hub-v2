import { BookMarked, Loader2 } from 'lucide-react'
import { CreatorSection } from '@/components/ui/CreatorSection'
import { usePublishedCategories, usePublishedCourses } from '@/hooks/use-public-courses'
import CourseContainer from '../../courses/components/CourseContainer'
import type { CourseCategoryDTO } from '@/services/course-categories'
import CommunitySubmissionForm from '@/features/community/components/CommunitySubmissionForm'

// ─── Category Section (dynamic) ───────────────────
const CATEGORY_ICONS = ['🧠', '🎨', '✍️', '💻', '📊', '🔍', '🚀', '📱'];
const CATEGORY_COLORS = [
    'bg-emerald-500', 'bg-violet-500', 'bg-pink-500', 'bg-blue-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
];

function CategorySection({ category, index }: { category: CourseCategoryDTO; index: number }) {
    const { courses, isLoading } = usePublishedCourses(category.id);
    const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b dark:border-slate-800 border-slate-200">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg text-2xl shrink-0 ${color}`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold dark:text-white text-slate-900">
                        {category.title}
                    </h2>
                    {category.description && (
                        <p className="text-sm md:text-base dark:text-slate-400 text-slate-600">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Course List */}
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

// ─── Main Landing Page ────────────────────────────
export default function LandingPage() {
    const { categories, isLoading } = usePublishedCategories();

    return (
        <>
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6">
                        <BookMarked className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            4-Month ITI Professional Diploma
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            📚 Intensive Courses
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-slate-600 dark:text-slate-400">
                        Deep-dive courses with Video lectures, Articles, and Mandatory Tasks (V.A.T. Model).
                    </p>
                </div>
            </section>

            {/* Personal Introduction */}
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
                <CreatorSection />
            </div>

            {/* Dynamic Category Sections */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
            ) : (
                categories.map((category, index) => (
                    <div key={category.id} id={index === 0 ? 'courses' : undefined} className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto scroll-mt-24">
                        <CategorySection category={category} index={index} />
                    </div>
                ))
            )}

            {/* Community Contribution Section */}
            <section id="community" className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            🤝 Grow Together
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Know a great resource or have ideas to make the platform better? We'd love to hear from you!
                        </p>
                    </div>
                    <CommunitySubmissionForm />
                </div>
            </section>
        </>
    )
}
