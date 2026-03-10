import { useMemo, useCallback } from 'react';
import { usePublishedTopicsWithResources } from '@/hooks/use-public-roadmap';
import RoadmapTopicCard from './RoadmapTopicCard';
import { RoadmapTrackDTO } from '@/services/roadmap-tracks';
import { SafeQuery } from '@/components/common/SafeQuery';
import { RoadmapGridSkeleton } from '@/components/ui/skeletons';
import { motion } from 'framer-motion'
import { fadeInUp, staggerChildren } from '@/lib/motion'

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
                <RoadmapGridSkeleton count={3} />
            }
        >
            {(topics: any[]) => (
                <section className="space-y-4" aria-label={`${track.title} track`}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">{track.icon || '🎯'}</span>
                        <h3 className="text-xl font-bold text-[var(--text-main)]">
                            {track.title}
                        </h3>
                        <span className="text-sm px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {topics.length} topics
                        </span>
                    </div>
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerChildren(0.05)}
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {topics.map((topic) => (
                            <motion.div key={topic.id} variants={fadeInUp}>
                                <RoadmapTopicCard
                                    topic={topic}
                                    resources={topic.roadmap_resources}
                                    trackColor={track.color}
                                    isOpen={openTopicId === topic.id}
                                    onToggle={handleToggle}
                                    topicId={topic.id}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            )}
        </SafeQuery>
    );
}
