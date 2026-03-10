import { LoadingSkeleton } from '../LoadingSkeleton'

export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)]">
            <LoadingSkeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <LoadingSkeleton className="h-4 w-1/3 rounded" />
                <LoadingSkeleton className="h-3 w-1/4 rounded" />
            </div>
            <LoadingSkeleton className="h-4 w-4 rounded shrink-0" />
        </div>
    )
}

export function ListGridSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <ListItemSkeleton key={i} />
            ))}
        </div>
    )
}
