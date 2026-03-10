import { Linkedin, ExternalLink } from 'lucide-react'
import { useSiteSettings } from '@/hooks/use-site-settings'
import { motion } from 'framer-motion'
import { fadeInUp, staggerChildren, hoverLift, useReducedMotion } from '@/lib/motion'

export function CreatorSection() {
    const { settings, isLoading } = useSiteSettings()
    const isReduced = useReducedMotion()

    // ─── Loading Skeleton (matches exact hero height to prevent layout shift) ───
    if (isLoading || !settings) {
        return (
            <section className="w-full py-12 md:py-20 rounded-[2.5rem] overflow-hidden animate-pulse bg-[var(--bg-muted)] border border-[var(--border-main)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="w-full flex justify-center mb-8">
                        <div className="h-7 w-48 rounded-full bg-[var(--bg-secondary)]" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                        <div className="md:w-1/3 flex justify-center md:justify-start w-full">
                            <div className="w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-[var(--bg-secondary)]" />
                        </div>
                        <div className="md:w-2/3 w-full space-y-4">
                            <div className="h-10 w-3/4 rounded-lg ml-auto bg-[var(--bg-secondary)]" />
                            <div className="h-8 w-1/2 rounded-lg ml-auto bg-[var(--bg-secondary)]" />
                            <div className="h-6 w-32 rounded-lg ml-auto bg-[var(--bg-secondary)]" />
                            <div className="space-y-3 mt-6">
                                <div className="h-5 w-full rounded bg-[var(--bg-secondary)]" />
                                <div className="h-5 w-5/6 rounded ml-auto bg-[var(--bg-secondary)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ─── Split description into paragraphs ───
    const descriptionParagraphs = settings.hero_description
        ? settings.hero_description.split('\n\n').filter(Boolean)
        : []

    return (
        <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren(0.1)}
            className="w-full py-12 md:py-20 transition-all duration-300 rounded-[2.5rem] overflow-hidden bg-[var(--bg-card)] border border-[var(--border-main)]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/* Badge – centered */}
                <motion.div variants={fadeInUp} className="w-full flex justify-center mb-8">
                    <span
                        className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20 shadow-sm"
                    >
                        {settings.hero_badge_text}
                    </span>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

                    {/* Image Column */}
                    <motion.div variants={fadeInUp} className="md:w-1/3 flex justify-center md:justify-start w-full">
                        <div className="relative group perspective-1000">
                            {/* Abstract Decor */}
                            {!isReduced && (
                                <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-emerald)] rounded-[2rem] opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40 animate-pulse" />
                            )}

                            {/* Image Container */}
                            <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-[var(--border-main)] transition-transform duration-500 ${!isReduced ? 'rotate-3 group-hover:rotate-0 group-hover:scale-105' : ''}`}>
                                <img
                                    key={settings.hero_image_url}
                                    src={settings.hero_image_url || '/images/creator.jpg'}
                                    alt={`${settings.hero_title_line_2} - ${settings.hero_role_label}`}
                                    className="w-full h-full object-cover object-[center_15%]"
                                />
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                whileHover={isReduced ? {} : { scale: 1.1, rotate: 5 }}
                                className={`absolute -bottom-6 -right-6 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 bg-[var(--bg-card)] text-[var(--text-main)] ${!isReduced ? 'animate-bounce-slow' : ''}`}
                            >
                                <span className="text-2xl">⚡</span>
                                <div>
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                        {settings.hero_experience_label}
                                    </p>
                                    <p className="font-bold">{settings.hero_experience_value}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <div className="md:w-2/3 w-full flex flex-col space-y-6">

                        {/* Text block – RTL */}
                        <motion.div variants={fadeInUp} className="w-full text-right" dir="rtl">
                            <h2
                                className="text-3xl md:text-5xl font-black leading-tight text-[var(--text-main)] font-display"
                            >
                                {settings.hero_title_line_1}
                                <span
                                    className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-emerald)] to-cyan-500"
                                >
                                    {settings.hero_title_line_2}
                                </span>
                            </h2>
                            <p
                                className="mt-3 text-lg font-medium inline-block px-4 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                            >
                                {settings.hero_role_label}
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="w-full space-y-6 text-right" dir="rtl">
                            {descriptionParagraphs.map((paragraph, idx) => (
                                <p
                                    key={idx}
                                    className="text-lg md:text-xl leading-relaxed text-[var(--text-secondary)]"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </motion.div>

                    </div>

                </div>

                {/* CTA Button – centered */}
                <motion.div variants={fadeInUp} className="w-full flex justify-center mt-10">
                    <motion.a
                        variants={hoverLift}
                        whileHover="hover"
                        whileTap="tap"
                        href={settings.hero_button_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold bg-[#0A66C2] text-white shadow-lg shadow-blue-500/20"
                    >
                        <Linkedin className="w-5 h-5" />
                        <span>{settings.hero_button_text}</span>
                        <ExternalLink className="w-4 h-4 opacity-70" />
                    </motion.a>
                </motion.div>
            </div>
        </motion.section>
    )
}
