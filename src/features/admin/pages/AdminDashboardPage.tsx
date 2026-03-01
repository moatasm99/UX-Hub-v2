import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminAnalytics } from '@/hooks/use-admin-analytics';
import { StatsCard } from '../components/analytics/StatsCard';
import { LevelDistributionChart, LessonTypeChart } from '../components/analytics/AnalyticsCharts';
import {
    BookOpen,
    Layers,
    FileText,
    CheckSquare,
    Map,
    Layout,
    Link as LinkIcon,
    Loader2,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const { user } = useAdminAuth();
    const { data: analytics, isLoading, isError, error } = useAdminAnalytics();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-12 h-12 text-[var(--accent-primary)] animate-spin" />
                <p className="text-[var(--text-muted)] font-medium">Loading Dashboard Analytics...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-red-500/5 border border-red-500/20 rounded-xl max-w-2xl mx-auto shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="text-center px-6">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">Failed to Load Analytics</h3>
                    <p className="text-red-400 mt-2 font-medium">{(error as Error)?.message}</p>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    const { totals, distributions } = analytics;

    return (
        <div className="text-[var(--text-main)] space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">System Overview</h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">
                        Welcome back, <span className="text-[var(--text-main)] font-bold">{user?.email}</span>. Live analytics for <span className="text-[var(--accent-primary)] font-bold">UX Design Hub</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Real-time Sync Active</span>
                </div>
            </header>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Courses"
                    value={totals.courses}
                    icon={BookOpen}
                    description={`${totals.publishedCourses} Published, ${totals.draftCourses} Draft`}
                    colorClass="text-[var(--accent-primary)] bg-[var(--accent-primary)]/10"
                />
                <StatsCard
                    title="Intensive Days"
                    value={totals.courseDays}
                    icon={Layout}
                    description="Structured learning units"
                    colorClass="text-purple-500 bg-purple-500/10"
                />
                <StatsCard
                    title="Total Lessons"
                    value={totals.lessons}
                    icon={FileText}
                    description="Across all courses"
                    colorClass="text-[var(--accent-pink)] bg-[var(--accent-pink)]/10"
                />
                <StatsCard
                    title="Total Tasks"
                    value={totals.tasks}
                    icon={CheckSquare}
                    description="Practical exercises"
                    colorClass="text-emerald-500 bg-emerald-500/10"
                />
            </section>

            {/* Roadmap Specifics */}
            <section className="bg-[var(--bg-card)] border border-[var(--border-main)] p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-[var(--text-main)]">
                    <Map className="w-6 h-6 text-[var(--accent-primary)]" />
                    Roadmap Ecosystem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-5 p-5 bg-[var(--bg-muted)]/50 border border-[var(--border-main)] rounded-2xl group hover:border-[var(--accent-primary)]/30 transition-all">
                        <div className="p-4 bg-amber-500/10 rounded-xl text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Tracks</p>
                            <p className="text-2xl font-black text-[var(--text-main)] tabular-nums">{totals.roadmapTracks}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-5 bg-[var(--bg-muted)]/50 border border-[var(--border-main)] rounded-2xl group hover:border-[var(--accent-primary)]/30 transition-all">
                        <div className="p-4 bg-cyan-500/10 rounded-xl text-cyan-600 shadow-sm group-hover:scale-110 transition-transform">
                            <Layout className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Topics</p>
                            <p className="text-2xl font-black text-[var(--text-main)] tabular-nums">{totals.roadmapTopics}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-5 bg-[var(--bg-muted)]/50 border border-[var(--border-main)] rounded-2xl group hover:border-[var(--accent-primary)]/30 transition-all">
                        <div className="p-4 bg-rose-500/10 rounded-xl text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                            <LinkIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">Resources</p>
                            <p className="text-2xl font-black text-[var(--text-main)] tabular-nums">{totals.roadmapResources}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visualizations */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LevelDistributionChart
                    data={distributions.levels}
                    title="Course Difficulty Distribution"
                />
                <LessonTypeChart
                    data={distributions.lessonTypes}
                    title="Lesson Content Breakdown"
                />
            </section>

            {/* Submissions Management */}
            <section className="bg-[var(--bg-card)] overflow-hidden border border-[var(--border-main)] rounded-2xl shadow-sm">
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-[var(--text-main)]">Community Submissions</h2>
                            <p className="text-[var(--text-muted)] font-medium max-w-xl">Review feedback, suggestions, and learning resources from users to improve the platform content.</p>
                        </div>
                    </div>
                    <Link
                        to="/admin/submissions"
                        className="px-8 py-3.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-[var(--accent-primary)]/20 whitespace-nowrap active:scale-95"
                    >
                        Review Submissions
                    </Link>
                </div>
            </section>
        </div>
    );
}
