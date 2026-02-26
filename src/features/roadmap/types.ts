export interface RoadmapResource {
    type: 'Video' | 'Article' | 'Book';
    title: string;
    url: string;
    label?: string; // e.g. "SVPG", "Medium"
}

export interface RoadmapItem {
    id: string;
    category: 'Strategy' | 'Launch' | 'Analytics' | 'Research';
    topic: string;
    description: string;
    resources: RoadmapResource[];
}

export interface RoadmapCategoryMeta {
    color: string;
    icon: string;
    bgLight: string;
    bgDark: string;
}

export type RoadmapCategory = 'All' | 'Strategy' | 'Launch' | 'Analytics' | 'Research';
