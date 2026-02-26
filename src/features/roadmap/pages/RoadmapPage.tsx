import { useState, useMemo } from 'react';
import { Rocket, Filter, Search } from 'lucide-react';
import RoadmapSection from '../components/RoadmapSection';
import { usePublishedTracks } from '@/hooks/use-public-roadmap';

export default function RoadmapPage() {
    // Dynamic data
    const { tracks, isLoading } = usePublishedTracks();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrackId, setSelectedTrackId] = useState('All');

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
        <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">

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
                            🚀 Product Roadmap
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-slate-600 dark:text-slate-400">
                        Dynamic strategic product resources: Vision, Launch, Analytics, and Research methods.
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
                                        <div className="h-8 w-48 bg-muted rounded"></div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {[1, 2, 3].map(j => (
                                                <div key={j} className="h-32 bg-muted rounded-xl"></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredTracks.length === 0 ? (
                            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                                <p className="text-lg">No roadmap tracks found.</p>
                            </div>
                        ) : (
                            filteredTracks.map((track) => (
                                <RoadmapSection
                                    key={track.id}
                                    track={track}
                                    searchQuery={searchQuery}
                                />
                            ))
                        )}
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-3xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 text-lg bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 text-slate-900 dark:text-white placeholder-slate-500"
                    aria-label="Search roadmap topics"
                />
            </div>

            <section className="px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/50 shadow-sm dark:shadow-none">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Filter by Track:
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTrackId('All')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTrackId === 'All'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
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
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
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
