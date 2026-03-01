import { useMemo, useCallback } from 'react';
import { usePublishedTopicsWithResources } from '@/hooks/use-public-roadmap';
import RoadmapTopicCard from './RoadmapTopicCard';
import { RoadmapTrackDTO } from '@/services/roadmap-tracks';
import { SafeQuery } from '@/components/common/SafeQuery';

interface RoadmapSectionProps {
    track: RoadmapTrackDTO;
    searchQuery?: string;
    openTopicId: string | null;
    onToggleTopic: (id: string) => void;
}

export default function RoadmapSection({ track, searchQuery, openTopicId, onToggleTopic }: RoadmapSectionProps) {
    const { topics, isLoading, isError } = usePublishedTopicsWithResources(track.id);

    // Memoize filtered list — only recompute when inputs change
    const filteredTopics = useMemo(() => {
        if (!searchQuery) return topics;
        const query = searchQuery.toLowerCase();
        return topics.filter(topic =>
            topic.title.toLowerCase().includes(query) ||
            topic.description?.toLowerCase().includes(query)
        );
    }, [topics, searchQuery]);

    // Stable toggle handler — prevents new function on every render
    // (critical for React.memo on child RoadmapTopicCard)
    const handleToggle = useCallback((id: string) => {
        onToggleTopic(id);
    }, [onToggleTopic]);

    return (
        <SafeQuery
            data={filteredTopics}
            isLoading={isLoading}
            error={isError ? new Error('Failed to load roadmap topics') : null}
            loadingFallback={
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-3xl" />
                    ))}
                </div>
            }
        >
            {(topics: any[]) => (
                <section className="space-y-4" aria-label={`${track.title} track`}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">{track.icon || '🎯'}</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {track.title}
                        </h3>
                        <span className="text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            {topics.length} topics
                        </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {topics.map((topic) => (
                            <RoadmapTopicCard
                                key={topic.id}
                                topic={topic}
                                resources={topic.roadmap_resources}
                                trackColor={track.color}
                                isOpen={openTopicId === topic.id}
                                onToggle={handleToggle}
                                topicId={topic.id}
                            />
                        ))}
                    </div>
                </section>
            )}
        </SafeQuery>
    );
}
