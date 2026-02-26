// ============================================
// Course Types (Migrated from old project)
// ============================================

export interface Resource {
    type: 'Video' | 'Article';
    title: string;
    url: string;
    duration?: string;
    source?: string;
}

export interface Task {
    title: string;
    description: string;
    deliverable: string;
}

export interface Module {
    day: string;
    title: string;
    summary: string;
    duration: string;
    resources: Resource[];
    task: Task;
}

export interface Course {
    id: string;
    title: string;
    badge?: string;
    badgeColor?: string;
    totalHours?: string;
    totalDays?: number;
    description?: string;
    icon?: string;
    // Database fields (snake_case)
    category_id?: string;
    slug?: string;
    short_description?: string | null;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | null;
    badge_label?: string | null;
    badge_color?: string | null;
    icon_key?: string | null;
    icon_bg_color?: string | null;
    position?: number;
    is_published?: boolean;
    modules?: Module[];
}

export interface BadgeStyle {
    color: string;
    icon: string;
    text: string;
    bg: string;
}

export interface CategorySection {
    title: string;
    subtitle: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    courseIds: string[];
}
