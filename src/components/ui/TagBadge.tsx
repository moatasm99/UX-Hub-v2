import { cn } from '@/lib/utils'

interface TagBadgeProps {
    label: string
    variant?: 'primary' | 'secondary' | 'outline'
    className?: string
}

const variantStyles = {
    primary: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]',
    secondary: 'bg-[var(--bg-muted)] text-[var(--text-secondary)]',
    outline: 'border border-[var(--border-main)] text-[var(--text-muted)]',
}

export function TagBadge({ label, variant = 'primary', className }: TagBadgeProps) {
    return (
        <span
            className={cn(
                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                variantStyles[variant],
                className
            )}
        >
            {label}
        </span>
    )
}
