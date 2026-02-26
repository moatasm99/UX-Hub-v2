/**
 * Central Query Key Factory
 *
 * All React Query keys are managed here to ensure consistency,
 * easy invalidation, and prevent key collisions.
 *
 * Pattern: [scope, ...filters]
 */

export const queryKeys = {
    // ─── Courses ──────────────────────────────────
    courses: {
        all: ['courses'] as const,
        lists: () => [...queryKeys.courses.all, 'list'] as const,
        list: (type: 'intensive' | 'roadmap') =>
            [...queryKeys.courses.lists(), type] as const,
        details: () => [...queryKeys.courses.all, 'detail'] as const,
        detail: (id: string) =>
            [...queryKeys.courses.details(), id] as const,
    },

    // ─── Modules ──────────────────────────────────
    modules: {
        all: ['modules'] as const,
        byCourse: (courseId: string) =>
            [...queryKeys.modules.all, 'byCourse', courseId] as const,
        detail: (id: string) =>
            [...queryKeys.modules.all, 'detail', id] as const,
    },

    // ─── Resources ────────────────────────────────
    resources: {
        all: ['resources'] as const,
        byModule: (moduleId: string) =>
            [...queryKeys.resources.all, 'byModule', moduleId] as const,
        detail: (id: string) =>
            [...queryKeys.resources.all, 'detail', id] as const,
    },

    // ─── Tasks ────────────────────────────────────
    tasks: {
        all: ['tasks'] as const,
        byModule: (moduleId: string) =>
            [...queryKeys.tasks.all, 'byModule', moduleId] as const,
    },

    // ─── Site Config ──────────────────────────────
    siteConfig: {
        all: ['siteConfig'] as const,
        byKey: (key: string) =>
            [...queryKeys.siteConfig.all, key] as const,
    },
} as const
