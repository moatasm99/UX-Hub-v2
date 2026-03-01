import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { BookMarked, Rocket, BookOpen, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { GlobalCommunityFab } from '@/features/community/components/GlobalCommunityFab'
import { UltraCelebrationButton } from '@/components/public/UltraCelebrationButton'

/* ─── Navigation Config ─── */
const navLinks = [
    {
        to: '/#courses', // Scrolls to courses section on Home
        label: 'Intensive Courses',
        emoji: '📚',
        icon: BookMarked,
        activeGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    },
    {
        to: '/roadmap',
        label: 'Product Design Roadmap',
        emoji: '🚀',
        icon: Rocket,
        activeGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    },
    {
        to: '/dictionary',
        label: 'UX/UI Dictionary',
        emoji: '📘',
        icon: BookOpen,
        activeGradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
] as const

export function RootLayout() {
    const location = useLocation()
    const { theme, setTheme } = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)

    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

    return (
        <div className="min-h-screen transition-colors duration-300 bg-[var(--bg-app)] text-[var(--text-main)]">

            {/* ━━━ HEADER ━━━ */}
            <header
                className="sticky top-0 z-50 border-b border-[var(--border-main)] bg-[var(--glass-bg)] backdrop-blur-xl transition-colors duration-300"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">

                    {/* ── Logo ── */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 transition-opacity hover:opacity-80"
                        style={{ transitionDuration: 'var(--motion-fast)' }}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white shadow-lg shadow-purple-500/25">
                            U
                        </div>
                        <div>
                            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                                UX Learning Hub
                            </h1>
                            <p
                                className="text-xs"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Your path to UX mastery
                            </p>
                        </div>
                    </Link>

                    {/* ── Desktop Tab Navigation ── */}
                    <nav
                        className="hidden items-center gap-1.5 rounded-2xl p-1 md:flex"
                        style={{ backgroundColor: 'var(--bg-muted)' }}
                    >
                        {navLinks.map((link) => {
                            // Custom active logic:
                            // 1. Home link ('/#courses') -> active when pathname is exactly '/'
                            // 2. Other links -> active when pathname starts with the link's path
                            const isActive = link.to === '/#courses'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(link.to)

                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
                                        ${isActive
                                            ? `${link.activeGradient} text-white shadow-lg`
                                            : 'hover:bg-[var(--bg-secondary)]'
                                        }`}
                                    style={{
                                        transitionDuration: 'var(--motion-normal)',
                                        color: isActive ? undefined : 'var(--text-secondary)',
                                    }}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{link.emoji} {link.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* ── Right Controls ── */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-2xl p-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                            style={{
                                backgroundColor: 'var(--bg-muted)',
                                color: isDark ? '#facc15' : 'var(--text-secondary)',
                                transitionDuration: 'var(--motion-normal)',
                            }}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-2xl p-2.5 transition-all md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                            style={{
                                backgroundColor: 'var(--bg-muted)',
                                color: 'var(--text-secondary)',
                                transitionDuration: 'var(--motion-normal)',
                            }}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Navigation ── */}
                <div
                    className="overflow-hidden transition-all md:hidden"
                    style={{
                        maxHeight: mobileMenuOpen ? '200px' : '0px',
                        opacity: mobileMenuOpen ? 1 : 0,
                        transitionDuration: 'var(--motion-slow)',
                        transitionTimingFunction: 'var(--ease-out)',
                    }}
                >
                    <div className="flex gap-2 px-4 pb-4">
                        {navLinks.map((link) => {
                            const isActive = link.to === '/#courses'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(link.to)
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-medium transition-all
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]
                                        ${isActive
                                            ? `${link.activeGradient} text-white shadow-lg`
                                            : ''
                                        }`}
                                    style={{
                                        backgroundColor: isActive ? undefined : 'var(--bg-muted)',
                                        color: isActive ? undefined : 'var(--text-secondary)',
                                        transitionDuration: 'var(--motion-normal)',
                                    }}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{link.emoji} {link.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </header>

            {/* ━━━ PAGE CONTENT ━━━ */}
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <Outlet />
            </main>

            {/* ━━━ FOOTER ━━━ */}
            <footer
                className="border-t py-6 text-center text-sm"
                style={{
                    borderColor: 'var(--border-main)',
                    color: 'var(--text-muted)',
                }}
            >
                UX Design Hub 2.0 — Built with ❤️ for ITI
            </footer>
            {/* ━━━ COMMUNITY FAB ━━━ */}
            <GlobalCommunityFab />

            {/* ━━━ CELEBRATION ━━━ */}
            <UltraCelebrationButton />

        </div>
    )
}
