import { useRef, useState, useEffect, type ReactNode } from 'react'

interface FadeInSectionProps {
    children: ReactNode
    className?: string
    /** Delay in ms before the animation triggers (for staggering) */
    delay?: number
}

/**
 * Lightweight scroll-triggered fade-in using native IntersectionObserver.
 * CSS-only animation via opacity + translateY. Zero dependencies.
 */
export function FadeInSection({ children, className = '', delay = 0 }: FadeInSectionProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        setTimeout(() => setVisible(true), delay)
                    } else {
                        setVisible(true)
                    }
                    observer.unobserve(el)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [delay])

    return (
        <div
            ref={ref}
            className={`fade-section ${visible ? 'visible' : ''} ${className}`}
        >
            {children}
        </div>
    )
}
