import { Variants } from 'framer-motion'

/**
 * Shared motion tokens aligned with index.css
 */
export const durations = {
    fast: 0.15,
    normal: 0.25,
    slow: 0.35,
}

// Using bezier definitions as arrays for better control, 
// but cast to any to avoid strict Easing type conflicts if needed
// or use the BezierDefinition type if available.
export const easings = {
    out: [0.22, 1, 0.36, 1] as any,
    spring: [0.34, 1.56, 0.64, 1] as any,
}

/**
 * Standard variants for common patterns
 */
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: durations.normal, ease: easings.out } },
    exit: { opacity: 0, transition: { duration: durations.fast, ease: easings.out } },
}

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: durations.normal, ease: easings.out } },
    exit: { opacity: 0, y: 10, transition: { duration: durations.fast, ease: easings.out } },
}

export const staggerChildren = (staggerDelay = 0.05) => ({
    animate: {
        transition: {
            staggerChildren: staggerDelay,
        },
    },
})

export const hoverLift: Variants = {
    hover: {
        y: -4,
        scale: 1.01,
        transition: { duration: durations.normal, ease: easings.out },
    },
    tap: {
        scale: 0.98,
        transition: { duration: durations.fast },
    },
}

export const accordionVariants: Variants = {
    closed: { height: 0, opacity: 0, overflow: 'hidden' },
    open: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: { duration: durations.normal, ease: easings.out },
            opacity: { duration: durations.normal, delay: 0.1 },
        },
    },
}

export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.normal,
            ease: easings.out,
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: durations.fast,
            ease: easings.out,
        },
    },
}

/**
 * Reduced motion helper
 */
export const isReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

import { useEffect, useState } from 'react'

/**
 * Hook to reactively track if user prefers reduced motion
 */
export function useReducedMotion() {
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReducedMotion(mediaQuery.matches)

        const onChange = (event: MediaQueryListEvent) => {
            setReducedMotion(event.matches)
        }

        mediaQuery.addEventListener('change', onChange)
        return () => mediaQuery.removeEventListener('change', onChange)
    }, [])

    return reducedMotion
}
