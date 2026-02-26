import { ChevronDown, Video, FileText, BookOpen, ExternalLink } from 'lucide-react';
import { usePublishedResources } from '@/hooks/use-public-roadmap';
import { RoadmapTopicDTO } from '@/services/roadmap-topics';

interface RoadmapTopicCardProps {
    topic: RoadmapTopicDTO;
    trackColor?: string | null;
    isOpen: boolean;
    onToggle: () => void;
}

export default function RoadmapTopicCard({ topic, trackColor, isOpen, onToggle }: RoadmapTopicCardProps) {
    const { resources, isLoading } = usePublishedResources(isOpen ? topic.id : undefined);

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'Video': return <Video className="w-4 h-4" />;
            case 'Article': return <FileText className="w-4 h-4" />;
            case 'Book': return <BookOpen className="w-4 h-4" />;
            default: return <ExternalLink className="w-4 h-4" />;
        }
    };

    const getThemeColor = () => {
        if (!trackColor) return 'amber';
        if (trackColor.includes('amber')) return 'amber';
        if (trackColor.includes('violet')) return 'violet';
        if (trackColor.includes('blue')) return 'blue';
        if (trackColor.includes('emerald')) return 'emerald';
        if (trackColor.includes('orange')) return 'orange';
        if (trackColor.includes('purple')) return 'purple';
        if (trackColor.includes('green')) return 'green';
        if (trackColor.includes('indigo')) return 'indigo';
        return 'amber';
    };

    const color = getThemeColor();

    return (
        <article className={`rounded-3xl border-2 overflow-hidden transition-all duration-300 bg-white dark:bg-slate-800/50 border-${color}-300 dark:border-${color}-500/30 hover:border-${color}-500 dark:hover:border-${color}-500/60`}>
            {/* Header — clickable */}
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-label={`${topic.title} — click to ${isOpen ? 'collapse' : 'expand'} resources`}
                className={`w-full text-left p-5 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${color}-500 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800`}
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
                    <div className={`p-2 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDown className={`w-5 h-5 text-${color}-500`} />
                    </div>
                </div>
            </button>

            {/* Body — strict conditional render */}
            {isOpen && (
                <div className={`px-5 pb-5 border-t border-${color}-200 dark:border-${color}-500/20`}>
                    <div className="pt-4 space-y-2">
                        {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-12 bg-muted rounded-2xl"></div>
                                <div className="h-12 bg-muted rounded-2xl"></div>
                            </div>
                        ) : resources.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-2">No resources available yet.</p>
                        ) : (
                            resources.map((resource) => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all group focus:outline-none focus:ring-2 focus:ring-${color}-500 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700`}
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
