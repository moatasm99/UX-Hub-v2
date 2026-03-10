import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
    className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-md bg-[var(--bg-muted)]',
                'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[var(--bg-app)]/10 before:to-transparent',
                className
            )}
        />
    )
}
