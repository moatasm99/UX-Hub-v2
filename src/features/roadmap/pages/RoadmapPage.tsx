import { useState, useMemo, useEffect } from 'react';
import { Rocket, Filter, Search } from 'lucide-react';
import RoadmapSection from '../components/RoadmapSection';
import { usePublishedTracks } from '@/hooks/use-public-roadmap';
import { CommunityFeedbackSection } from '@/features/community/components/CommunityFeedbackSection';

export default function RoadmapPage() {
    // Dynamic data
    const { tracks, isLoading } = usePublishedTracks();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('All');
    const [openTopicId, setOpenTopicId] = useState<string | null>(null);

    // SEO
    useEffect(() => {
        document.title = 'Product Design Roadmap | UX Hub';
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', 'Complete Product Design Roadmap covering fundamentals, product thinking, UX strategy, and advanced topics.');
        }
    }, []);

    // Filter tracks based on selected track pill
    const filteredTracks = useMemo(() => {
        if (selectedTrackId === 'All') return tracks;
        return tracks.filter(t => t.id === selectedTrackId);
    }, [tracks, selectedTrackId]);

    // Note: search filtering is handled visually or could be passed down to sections.
    // For simplicity and matching the prompt's requested structure, we'll keep the track listing clean.
    // If we wanted to search across all topics/descriptions, we could do that here by fetching everything,
    // but the prompt suggests a nested fetch (Page -> Section -> Card).
    // So searching might be limited to track titles unless we refactor to a flat list.
    // However, looking at the previous RoadmapListPage, searching was done on a flat array.
    // Given the "Production Ready" requirement, we'll keep it performing well.

    return (
        <div className="min-h-screen transition-colors duration-300 bg-[var(--bg-app)] text-[var(--text-main)]">

            {/* Hero Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
                        <Rocket className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            Advanced Product Strategy Roadmap
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            🚀 Product Design Roadmap
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-[var(--text-secondary)]">
                        Complete Product Design Roadmap covering fundamentals, product thinking, UX strategy, and advanced topics.
                    </p>
                </div>

                {/* Filters */}
                {/* We adapt RoadmapFilters to use dynamic tracks */}
                <DynamicRoadmapFilters
                    tracks={tracks}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedTrackId={selectedTrackId}
                    setSelectedTrackId={setSelectedTrackId}
                />
            </section>

            {/* Main Content */}
            <main className="px-4 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-12">
                        {isLoading ? (
                            <div className="space-y-12 animate-pulse">
                                {[1, 2].map(i => (
                                    <div key={i} className="space-y-4">
                                        <div className="h-8 w-48 bg-[var(--bg-muted)] rounded"></div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {[1, 2, 3].map(j => (
                                                <div key={j} className="h-32 bg-[var(--bg-muted)] rounded-xl"></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredTracks.length === 0 ? (
                            <div className="text-center py-16 text-[var(--text-muted)]">
                                <p className="text-lg">No roadmap tracks found.</p>
                            </div>
                        ) : (
                            filteredTracks.map((track) => (
                                <RoadmapSection
                                    key={track.id}
                                    track={track}
                                    searchQuery={searchQuery}
                                    openTopicId={openTopicId}
                                    onToggleTopic={(id: string) => setOpenTopicId(prev => prev === id ? null : id)}
                                />
                            ))
                        )}
                    </div>

                    <div className="mt-20 border-t border-[var(--border-main)]">
                        <CommunityFeedbackSection />
                    </div>
                </div>
            </main>
        </div>
    );
}

// Internal component for dynamic filters to avoid prop drilling or modifying the original too much yet
function DynamicRoadmapFilters({ tracks, searchQuery, setSearchQuery, selectedTrackId, setSelectedTrackId }: any) {
    return (
        <div className="space-y-6">
            <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-3xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/20 text-lg bg-[var(--bg-card)] border-[var(--border-main)] focus:border-[var(--accent-primary)] text-[var(--text-main)] placeholder-[var(--text-muted)]"
                    aria-label="Search roadmap topics"
                />
            </div>

            <section className="px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="p-4 rounded-3xl bg-[var(--bg-card)] shadow-sm">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-[var(--text-muted)]" />
                                <span className="text-sm font-medium text-[var(--text-secondary)]">
                                    Filter by Track:
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTrackId('All')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrackId === 'All'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                        }`}
                                >
                                    All
                                </button>
                                {tracks.map((track: any) => (
                                    <button
                                        key={track.id}
                                        onClick={() => setSelectedTrackId(track.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrackId === track.id
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                            : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                            }`}
                                    >
                                        {track.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
