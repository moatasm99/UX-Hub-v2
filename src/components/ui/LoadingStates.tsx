import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonLoadingStateProps {
    isLoading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    className?: string;
}

export function ButtonLoadingState({
    isLoading,
    children,
    loadingText,
    className
}: ButtonLoadingStateProps) {
    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <motion.div
                initial={false}
                animate={{
                    opacity: isLoading ? 0 : 1,
                    y: isLoading ? -10 : 0
                }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-2"
            >
                {children}
            </motion.div>

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-center justify-center gap-2"
                >
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
                    {loadingText && (
                        <span className="text-sm font-medium">{loadingText}</span>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export function InlineLoadingState({ message }: { message?: string }) {
    return (
        <div className="flex items-center gap-2 py-4 text-[var(--text-secondary)]">
            <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
            </div>
            <span className="text-sm font-medium">{message || 'Loading...'}</span>
        </div>
    )
}
