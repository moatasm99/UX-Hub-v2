import { cn } from '@/lib/utils'

interface TagBadgeProps {
    label: string
    variant?: 'primary' | 'secondary' | 'outline'
    className?: string
}

const variantStyles = {
    primary: 'bg-blue-50 text-blue-700',
    secondary: 'bg-gray-100 text-gray-600',
    outline: 'border border-gray-300 text-gray-600',
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
