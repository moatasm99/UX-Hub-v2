import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

// ─── Lazy-loaded pages (code splitting per route) ────────
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))
const RoadmapPage = lazy(() => import('@/features/roadmap/pages/RoadmapPage'))
const RoadmapDetailPage = lazy(() => import('@/features/roadmap/pages/RoadmapDetailPage'))
const UXDictionaryPage = lazy(() => import('@/features/dictionary/pages/UXDictionaryPage'))
const AdminLoginPage = lazy(() => import('@/features/admin/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'))
const AdminCourseCategoriesPage = lazy(() => import('@/features/admin/pages/AdminCourseCategoriesPage'))
const AdminIntensiveCoursesPage = lazy(() => import('@/features/admin/pages/AdminIntensiveCoursesPage'))
const AdminCourseBuilderPage = lazy(() => import('@/features/admin/pages/AdminCourseBuilderPage'))
const AdminCourseDaysPage = lazy(() => import('@/features/admin/pages/AdminCourseDaysPage'))
const AdminDayBuilderPage = lazy(() => import('@/features/admin/pages/AdminDayBuilderPage'))
const AdminCourseLessonsPage = lazy(() => import('@/features/admin/pages/AdminCourseLessonsPage'))
const AdminCourseTasksPage = lazy(() => import('@/features/admin/pages/AdminCourseTasksPage'))
const AdminRoadmapTracksPage = lazy(() => import('@/features/admin/pages/AdminRoadmapTracksPage'))
const AdminRoadmapTopicsPage = lazy(() => import('@/features/admin/pages/AdminRoadmapTopicsPage'))
const AdminTopicBuilderPage = lazy(() => import('@/features/admin/pages/AdminTopicBuilderPage'))
const AdminSiteSettingsPage = lazy(() => import('@/features/admin/pages/AdminSiteSettingsPage'))
const AdminSubmissionsPage = lazy(() => import('@/features/admin/pages/AdminSubmissionsPage'))
const AdminLayout = lazy(() => import('@/features/admin/components/AdminLayout'))
const AdminGuard = lazy(() => import('@/features/admin/components/AdminGuard'))
const NotFoundPage = lazy(() => import('@/app/not-found'))

// ─── Suspense wrapper ────────────────────────────────────
function PageLoader({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="space-y-4 py-8">
                    <LoadingSkeleton className="h-10 w-1/3 rounded-lg" />
                    <LoadingSkeleton className="h-6 w-2/3 rounded-lg" />
                    <LoadingSkeleton className="h-48 w-full rounded-xl" />
                </div>
            }
        >
            {children}
        </Suspense>
    )
}

// ─── Route Configuration ─────────────────────────────────
const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: (
            <ErrorBoundary>
                <div />
            </ErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: (
                    <PageLoader>
                        <LandingPage />
                    </PageLoader>
                ),
            },
            {
                path: 'roadmap',
                element: (
                    <PageLoader>
                        <RoadmapPage />
                    </PageLoader>
                ),
            },
            {
                path: 'roadmap/:category',
                element: (
                    <PageLoader>
                        <RoadmapDetailPage />
                    </PageLoader>
                ),
            },
            {
                path: 'dictionary',
                element: (
                    <PageLoader>
                        <UXDictionaryPage />
                    </PageLoader>
                ),
            },
            {
                path: '*',
                element: (
                    <PageLoader>
                        <NotFoundPage />
                    </PageLoader>
                ),
            },
        ],
    },
    {
        path: '/admin/login',
        element: (
            <PageLoader>
                <AdminLoginPage />
            </PageLoader>
        ),
    },
    {
        path: '/admin',
        element: (
            <AdminGuard>
                <AdminLayout />
            </AdminGuard>
        ),
        children: [
            {
                index: true,
                element: (
                    <PageLoader>
                        <AdminDashboardPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses',
                element: (
                    <PageLoader>
                        <AdminCourseCategoriesPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId',
                element: (
                    <PageLoader>
                        <AdminIntensiveCoursesPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/new',
                element: (
                    <PageLoader>
                        <AdminCourseBuilderPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/edit/:courseId',
                element: (
                    <PageLoader>
                        <AdminCourseBuilderPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/:courseId',
                element: (
                    <PageLoader>
                        <AdminCourseDaysPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/:courseId/days/new',
                element: (
                    <PageLoader>
                        <AdminDayBuilderPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/:courseId/days/:dayId',
                element: (
                    <PageLoader>
                        <AdminDayBuilderPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/:courseId/:dayId',
                element: (
                    <PageLoader>
                        <AdminCourseLessonsPage />
                    </PageLoader>
                ),
            },
            {
                path: 'courses/:categoryId/:courseId/:dayId/:lessonId',
                element: (
                    <PageLoader>
                        <AdminCourseTasksPage />
                    </PageLoader>
                ),
            },
            {
                path: 'roadmap',
                element: (
                    <PageLoader>
                        <AdminRoadmapTracksPage />
                    </PageLoader>
                ),
            },
            {
                path: 'roadmap/:trackId',
                element: (
                    <PageLoader>
                        <AdminRoadmapTopicsPage />
                    </PageLoader>
                ),
            },
            {
                path: 'roadmap/:trackId/new',
                element: (
                    <PageLoader>
                        <AdminTopicBuilderPage />
                    </PageLoader>
                ),
            },
            {
                path: 'roadmap/:trackId/:topicId',
                element: (
                    <PageLoader>
                        <AdminTopicBuilderPage />
                    </PageLoader>
                ),
            },
            {
                path: 'settings',
                element: (
                    <PageLoader>
                        <AdminSiteSettingsPage />
                    </PageLoader>
                ),
            },
            {
                path: 'submissions',
                element: (
                    <PageLoader>
                        <AdminSubmissionsPage />
                    </PageLoader>
                ),
            },
        ],
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}
