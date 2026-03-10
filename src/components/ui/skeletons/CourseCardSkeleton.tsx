import { LoadingSkeleton } from '../LoadingSkeleton'

export function CourseCardSkeleton() {
    return (
        <div className="rounded-3xl border-2 border-[var(--border-main)] bg-[var(--bg-card)] p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                {/* LEFT: Icon & Main Info */}
                <div className="flex items-start md:items-center gap-4 flex-1">
                    <LoadingSkeleton className="h-14 w-14 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <LoadingSkeleton className="h-4 w-20 rounded-full" />
                        </div>
                        <LoadingSkeleton className="h-6 w-3/4 rounded-md" />
                        <LoadingSkeleton className="h-4 w-full rounded-md" />
                    </div>
                </div>

                {/* RIGHT: Metadata & Chevron */}
                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-dashed border-[var(--border-main)]">
                    <div className="flex items-center gap-4">
                        <LoadingSkeleton className="h-4 w-16 rounded" />
                        <LoadingSkeleton className="h-4 w-16 rounded" />
                    </div>
                    <LoadingSkeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export function CourseCardGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="flex flex-col space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <CourseCardSkeleton key={i} />
            ))}
        </div>
    )
}
