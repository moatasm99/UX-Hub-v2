import { memo } from 'react';
import { ChevronDown, Video, FileText, BookOpen, ExternalLink } from 'lucide-react';
import { RoadmapTopicDTO } from '@/services/roadmap-topics';
import { RoadmapResourceDTO } from '@/services/roadmap-resources';

interface RoadmapTopicCardProps {
    topic: RoadmapTopicDTO;
    resources: RoadmapResourceDTO[];
    trackColor?: string | null;
    isOpen: boolean;
    onToggle: (id: string) => void;
    topicId: string;
}

/* ─── Explicit color class maps (Tailwind-safe, no dynamic interpolation) ─── */
const COLOR_CLASSES = {
    amber: {
        border: 'border-amber-300 dark:border-amber-500/30',
        borderHover: 'hover:border-amber-500 dark:hover:border-amber-500/60',
        ring: 'focus:ring-amber-500',
        chevronBg: 'bg-amber-50 dark:bg-amber-900/20',
        chevronText: 'text-amber-500',
        resourceRing: 'focus:ring-amber-500',
        divider: 'border-amber-200 dark:border-amber-500/20',
    },
    violet: {
        border: 'border-violet-300 dark:border-violet-500/30',
        borderHover: 'hover:border-violet-500 dark:hover:border-violet-500/60',
        ring: 'focus:ring-violet-500',
        chevronBg: 'bg-violet-50 dark:bg-violet-900/20',
        chevronText: 'text-violet-500',
        resourceRing: 'focus:ring-violet-500',
        divider: 'border-violet-200 dark:border-violet-500/20',
    },
    blue: {
        border: 'border-blue-300 dark:border-blue-500/30',
        borderHover: 'hover:border-blue-500 dark:hover:border-blue-500/60',
        ring: 'focus:ring-blue-500',
        chevronBg: 'bg-blue-50 dark:bg-blue-900/20',
        chevronText: 'text-blue-500',
        resourceRing: 'focus:ring-blue-500',
        divider: 'border-blue-200 dark:border-blue-500/20',
    },
    emerald: {
        border: 'border-emerald-300 dark:border-emerald-500/30',
        borderHover: 'hover:border-emerald-500 dark:hover:border-emerald-500/60',
        ring: 'focus:ring-emerald-500',
        chevronBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        chevronText: 'text-emerald-500',
        resourceRing: 'focus:ring-emerald-500',
        divider: 'border-emerald-200 dark:border-emerald-500/20',
    },
    orange: {
        border: 'border-orange-300 dark:border-orange-500/30',
        borderHover: 'hover:border-orange-500 dark:hover:border-orange-500/60',
        ring: 'focus:ring-orange-500',
        chevronBg: 'bg-orange-50 dark:bg-orange-900/20',
        chevronText: 'text-orange-500',
        resourceRing: 'focus:ring-orange-500',
        divider: 'border-orange-200 dark:border-orange-500/20',
    },
    purple: {
        border: 'border-purple-300 dark:border-purple-500/30',
        borderHover: 'hover:border-purple-500 dark:hover:border-purple-500/60',
        ring: 'focus:ring-purple-500',
        chevronBg: 'bg-purple-50 dark:bg-purple-900/20',
        chevronText: 'text-purple-500',
        resourceRing: 'focus:ring-purple-500',
        divider: 'border-purple-200 dark:border-purple-500/20',
    },
    green: {
        border: 'border-green-300 dark:border-green-500/30',
        borderHover: 'hover:border-green-500 dark:hover:border-green-500/60',
        ring: 'focus:ring-green-500',
        chevronBg: 'bg-green-50 dark:bg-green-900/20',
        chevronText: 'text-green-500',
        resourceRing: 'focus:ring-green-500',
        divider: 'border-green-200 dark:border-green-500/20',
    },
    indigo: {
        border: 'border-indigo-300 dark:border-indigo-500/30',
        borderHover: 'hover:border-indigo-500 dark:hover:border-indigo-500/60',
        ring: 'focus:ring-indigo-500',
        chevronBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        chevronText: 'text-indigo-500',
        resourceRing: 'focus:ring-indigo-500',
        divider: 'border-indigo-200 dark:border-indigo-500/20',
    },
} as const;

type ColorKey = keyof typeof COLOR_CLASSES;

function resolveColor(trackColor?: string | null): ColorKey {
    if (!trackColor) return 'amber';
    const keys: ColorKey[] = ['amber', 'violet', 'blue', 'emerald', 'orange', 'purple', 'green', 'indigo'];
    for (const key of keys) {
        if (trackColor.includes(key)) return key;
    }
    return 'amber';
}

function RoadmapTopicCard({ topic, resources, trackColor, isOpen, onToggle, topicId }: RoadmapTopicCardProps) {
    const c = COLOR_CLASSES[resolveColor(trackColor)];

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'Video': return <Video className="w-4 h-4" />;
            case 'Article': return <FileText className="w-4 h-4" />;
            case 'Book': return <BookOpen className="w-4 h-4" />;
            default: return <ExternalLink className="w-4 h-4" />;
        }
    };

    return (
        <article className={`rounded-3xl border-2 overflow-hidden transition-all duration-300 bg-white dark:bg-slate-800/50 ${c.border} ${c.borderHover}`}>
            {/* Header — clickable */}
            <button
                type="button"
                onClick={() => onToggle(topicId)}
                aria-expanded={isOpen}
                aria-label={`${topic.title} — click to ${isOpen ? 'collapse' : 'expand'} resources`}
                className={`w-full text-left p-5 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-inset ${c.ring} rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h4 className="font-bold mb-1 text-slate-900 dark:text-white">
                            {topic.title}
                        </h4>
                        {topic.description && (
                            <p className="text-sm line-clamp-2 text-slate-600 dark:text-slate-400">
                                {topic.description}
                            </p>
                        )}
                    </div>
                    <div className={`p-2 rounded-xl ${c.chevronBg} transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDown className={`w-5 h-5 ${c.chevronText}`} />
                    </div>
                </div>
            </button>

            {/* Body — instant render, no loading, no fetch */}
            {isOpen && (
                <div className={`px-5 pb-5 border-t ${c.divider}`}>
                    <div className="pt-4 space-y-2">
                        {resources.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-2">No resources available yet.</p>
                        ) : (
                            resources.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all group focus:outline-none focus:ring-2 ${c.resourceRing} bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700`}
                                >
                                    <div className={`p-2 rounded-xl ${resource.type === 'Video' ? 'bg-red-500/10 text-red-500' :
                                        resource.type === 'Article' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-purple-500/10 text-purple-500'
                                        }`}>
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
                                            {resource.title}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {resource.type}
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 dark:text-slate-400" aria-hidden="true" />
                                </a>
                            ))
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}

export default memo(RoadmapTopicCard);
