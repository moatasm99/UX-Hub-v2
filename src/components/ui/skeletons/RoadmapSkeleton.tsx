import { LoadingSkeleton } from '../LoadingSkeleton'

export function RoadmapTopicSkeleton() {
    return (
        <article className="rounded-3xl border-2 border-[var(--border-main)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                        <LoadingSkeleton className="h-5 w-1/2 rounded" />
                        <LoadingSkeleton className="h-4 w-full rounded" />
                        <LoadingSkeleton className="h-4 w-3/4 rounded" />
                    </div>
                    <LoadingSkeleton className="h-9 w-9 rounded-xl" />
                </div>
            </div>
        </article>
    )
}

export function RoadmapGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <RoadmapTopicSkeleton key={i} />
            ))}
        </div>
    )
}

export function RoadmapTrackSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <LoadingSkeleton className="h-8 w-8 rounded-full" />
                <LoadingSkeleton className="h-7 w-48 rounded" />
                <LoadingSkeleton className="h-6 w-20 rounded-full" />
            </div>
            <RoadmapGridSkeleton count={3} />
        </div>
    )
}
