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
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium">Loading Dashboard Analytics...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white">Failed to Load Analytics</h3>
                    <p className="text-red-400 mt-2">{(error as Error)?.message}</p>
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    const { totals, distributions } = analytics;

    return (
        <div className="text-white space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
                    <p className="text-slate-400 mt-1">
                        Welcome back, <span className="text-white font-medium">{user?.email}</span>. Live analytics for <span className="text-blue-400 font-medium">UX Design Hub</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-300">Real-time Sync Active</span>
                </div>
            </header>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Courses"
                    value={totals.courses}
                    icon={BookOpen}
                    description={`${totals.publishedCourses} Published, ${totals.draftCourses} Draft`}
                    colorClass="text-blue-400 bg-blue-500/10"
                />
                <StatsCard
                    title="Intensive Days"
                    value={totals.courseDays}
                    icon={Layout}
                    description="Structured learning units"
                    colorClass="text-purple-400 bg-purple-500/10"
                />
                <StatsCard
                    title="Total Lessons"
                    value={totals.lessons}
                    icon={FileText}
                    description="Across all courses"
                    colorClass="text-pink-400 bg-pink-500/10"
                />
                <StatsCard
                    title="Total Tasks"
                    value={totals.tasks}
                    icon={CheckSquare}
                    description="Practical exercises"
                    colorClass="text-emerald-400 bg-emerald-500/10"
                />
            </section>

            {/* Roadmap Specifics */}
            <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-400" />
                    Roadmap Ecosystem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Tracks</p>
                            <p className="text-xl font-bold text-white">{totals.roadmapTracks}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-500">
                            <Layout className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Topics</p>
                            <p className="text-xl font-bold text-white">{totals.roadmapTopics}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="p-3 bg-rose-500/10 rounded-lg text-rose-500">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Resources</p>
                            <p className="text-xl font-bold text-white">{totals.roadmapResources}</p>
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
            <section className="bg-slate-900 overflow-hidden border border-slate-800 rounded-2xl">
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Community Submissions</h2>
                            <p className="text-slate-400 mt-1">Review feedback, suggestions, and learning resources from users.</p>
                        </div>
                    </div>
                    <Link
                        to="/admin/submissions"
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 whitespace-nowrap"
                    >
                        Review Submissions
                    </Link>
                </div>
            </section>
        </div>
    );
}
