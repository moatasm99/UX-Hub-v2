// ============================================
// Course Icon Constants
// Each value maps to an SVG file at:
//   /assets/course-icons/{value}.svg
// ============================================

export interface CourseIconOption {
    label: string;
    value: string;
}

export const COURSE_ICONS: CourseIconOption[] = [
    { label: 'Research', value: 'research' },
    { label: 'Persona', value: 'persona' },
    { label: 'Wireframe', value: 'wireframe' },
    { label: 'Testing', value: 'testing' },
    { label: 'Design System', value: 'design-system' },
    { label: 'Figma', value: 'figma' },
    { label: 'Roadmap', value: 'roadmap' },
    { label: 'Strategy', value: 'strategy' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Growth', value: 'growth' },
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Web', value: 'web' },
    { label: 'Certificate', value: 'certificate' },
    { label: 'Rocket', value: 'rocket' },
    { label: 'Users', value: 'users' },
    { label: 'Interview', value: 'interview' },
    { label: 'Experiment', value: 'experiment' },
    { label: 'Sprint', value: 'sprint' },
    { label: 'Backlog', value: 'backlog' },
];

/**
 * Build the public URL for a course icon SVG.
 * Returns null if iconKey is falsy.
 */
export function getCourseIconUrl(iconKey: string | null | undefined): string | null {
    if (!iconKey) return null;
    return `/assets/course-icons/${iconKey}.svg`;
}

/** Default icon background color */
export const DEFAULT_ICON_BG = '#F5F5F5';
