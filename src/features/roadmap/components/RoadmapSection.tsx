import { useState } from 'react';
import { usePublishedTopics } from '@/hooks/use-public-roadmap';
import RoadmapTopicCard from './RoadmapTopicCard';
import { RoadmapTrackDTO } from '@/services/roadmap-tracks';

interface RoadmapSectionProps {
    track: RoadmapTrackDTO;
    searchQuery?: string;
}

export default function RoadmapSection({ track, searchQuery }: RoadmapSectionProps) {
    const { topics, isLoading } = usePublishedTopics(track.id);
    const [openTopicId, setOpenTopicId] = useState<string | null>(null);

    const filteredTopics = topics.filter(topic => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            topic.title.toLowerCase().includes(query) ||
            topic.description?.toLowerCase().includes(query)
        );
    });

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded"></div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-muted rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (topics.length === 0) return null;
    if (searchQuery && filteredTopics.length === 0) return null;

    return (
        <section className="space-y-4" aria-label={`${track.title} track`}>
            <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{track.icon || '🎯'}</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {track.title}
                </h3>
                <span className="text-sm px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    {filteredTopics.length} topics
                </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTopics.map((topic) => (
                    <RoadmapTopicCard
                        key={topic.id}
                        topic={topic}
                        trackColor={track.color}
                        isOpen={openTopicId === topic.id}
                        onToggle={() => setOpenTopicId(prev => prev === topic.id ? null : topic.id)}
                    />
                ))}
            </div>
        </section>
    );
}
