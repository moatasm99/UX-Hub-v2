import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
    className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-[var(--bg-muted)]',
                className
            )}
        />
    )
}
