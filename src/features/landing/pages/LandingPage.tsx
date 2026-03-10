import { CreatorSection } from '@/components/ui/CreatorSection'
import { usePublishedCategories, usePublishedCourses } from '@/hooks/use-public-courses'
import CourseContainer from '../../courses/components/CourseContainer'
import type { CourseCategoryDTO } from '@/services/course-categories'
import { CommunityFeedbackSection } from '@/features/community/components/CommunityFeedbackSection'
import { CourseCardGridSkeleton, LoadingSkeleton } from '@/components/ui/skeletons'
import { motion } from 'framer-motion'
import { fadeInUp, staggerChildren } from '@/lib/motion'

// ─── Category Section (dynamic) ───────────────────
const CATEGORY_ICONS = ['🧠', '🎨', '✍️', '💻', '📊', '🔍', '🚀', '📱'];
const CATEGORY_COLORS = [
    'bg-[var(--accent-emerald)]', 'bg-[var(--accent-violet)]', 'bg-[var(--accent-pink)]', 'bg-[var(--accent-primary)]',
    'bg-[var(--accent-amber)]', 'bg-[var(--accent-cyan)]', 'bg-[var(--accent-rose)]', 'bg-[var(--accent-indigo)]'
];

function CategorySection({ category, index }: { category: CourseCategoryDTO; index: number }) {
    const { courses, isLoading } = usePublishedCourses(category.id);
    const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[var(--border-main)]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg text-2xl shrink-0 ${color}`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
                        {category.title}
                    </h2>
                    {category.description && (
                        <p className="text-sm md:text-base text-[var(--text-secondary)]">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Course List */}
            {isLoading ? (
                <CourseCardGridSkeleton count={2} />
            ) : courses.length === 0 ? (
                <p className="text-center text-[var(--text-muted)] py-8">No courses available yet.</p>
            ) : (
                <div className="flex flex-col space-y-4">
                    {courses.map((course) => (
                        <CourseContainer key={course.id} course={course} />
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
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={staggerChildren(0.1)}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/20 mb-6 font-display">
                        <span className="text-sm font-bold text-[var(--accent-emerald)] uppercase tracking-wider">
                            4-Month ITI Professional Diploma
                        </span>
                    </motion.div>

                    <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-4 font-display">
                        <span className="bg-gradient-to-r from-[var(--accent-emerald)] via-[var(--accent-cyan)] to-[var(--accent-primary)] bg-clip-text text-transparent">
                            📚 Intensive Courses
                        </span>
                    </motion.h2>

                    <motion.p variants={fadeInUp} className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-[var(--text-secondary)]">
                        Deep-dive courses with Video lectures, Articles, and Mandatory Tasks (V.A.T. Model).
                    </motion.p>
                </motion.div>
            </section>

            {/* Personal Introduction */}
            <div className="px-4 sm:px-6 lg:px-8 pb-16">
                <CreatorSection />
            </div>

            {/* Dynamic Category Sections */}
            {isLoading ? (
                <div className="space-y-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {[1, 2].map(i => (
                        <div key={i} className="space-y-8">
                            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-main)]">
                                <LoadingSkeleton className="h-14 w-14 rounded-2xl" />
                                <div className="space-y-2">
                                    <LoadingSkeleton className="h-6 w-48 rounded" />
                                    <LoadingSkeleton className="h-4 w-64 rounded" />
                                </div>
                            </div>
                            <CourseCardGridSkeleton count={2} />
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerChildren(0.15)}
                >
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            id={index === 0 ? 'courses' : undefined}
                            variants={fadeInUp}
                            className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto scroll-mt-24"
                        >
                            <CategorySection category={category} index={index} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Community Contribution Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-[var(--border-main)] mt-12">
                <CommunityFeedbackSection />
            </div>
        </>
    )
}
