import { Linkedin, ExternalLink } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export function CreatorSection() {
    const { theme } = useTheme()
    const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)

    return (
        <section
            className={`w-full py-12 md:py-20 transition-all duration-300 rounded-[2.5rem] overflow-hidden ${isDark
                ? 'bg-slate-900 border border-slate-800/50'
                : 'bg-gradient-to-b from-slate-50 to-white border border-slate-100'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                {/*
                  Layout Logic for LTR Site:
                  Mobile: flex-col -> Image First (Top), Text Second (Bottom)
                  Desktop: flex-row -> Image First (Left), Text Second (Right)
                */}
                {/* Badge – centered on full section width */}
                <div className="w-full flex justify-center mb-8">
                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isDark
                            ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}
                    >
                        ✨ Curated by Moatasm
                    </span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

                    {/* Image Column (1st in DOM = Left on Desktop, Top on Mobile) */}
                    <div className="md:w-1/3 flex justify-center md:justify-start w-full">
                        <div className="relative group perspective-1000">
                            {/* Abstract Decor */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500 to-emerald-500 rounded-[2rem] opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40 animate-pulse" />

                            {/* Image Container */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white dark:ring-slate-800 rotate-3 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105">
                                <img
                                    src="/images/creator.jpg"
                                    alt="Moatasm Shaban - Founder"
                                    className="w-full h-full object-cover object-[center_15%]"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div
                                className={`absolute -bottom-6 -right-6 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow ${isDark
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white text-slate-800'
                                    }`}
                            >
                                <span className="text-2xl">⚡</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Experience
                                    </p>
                                    <p className="font-bold">Product Design</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column – text only, RTL right-aligned */}
                    <div className="md:w-2/3 w-full flex flex-col space-y-6">

                        {/* Text block – RTL, right-aligned */}
                        <div className="w-full text-right" dir="rtl">
                            <h2
                                className={`text-3xl md:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'
                                    }`}
                            >
                                يا مرحب بمرعبين الـ ITI 👋
                                <span
                                    className={`block mt-3 text-transparent bg-clip-text bg-gradient-to-r ${isDark
                                        ? 'from-emerald-400 to-teal-400'
                                        : 'from-emerald-600 to-teal-600'
                                        }`}
                                >
                                    أنا معتصم شعبان
                                </span>
                            </h2>
                            <p
                                className={`mt-3 text-lg font-medium inline-block px-4 py-1 rounded-lg ${isDark
                                    ? 'bg-slate-800 text-slate-300'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                Product Designer
                            </p>
                        </div>

                        <div className="w-full space-y-6 text-right" dir="rtl">
                            <p
                                className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}
                            >
                                عملت المنصة دي لسبب بسيط: أنا كنت مكانكم في يوم من الأيام. كنت بسأل 'أبدأ منين؟' و 'إيه المصادر اللي أثق فيها؟'.
                                الرحلة كانت مليانة تشتت، وعشان كدة قررت أرسم ليكم الخريطة اللي كنت أتمنى ألاقيها وقتها.
                            </p>

                            <p
                                className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}
                            >
                                الهدف إني أوفر عليكم التوهة اللي ناس كتير عاشتها، وأقدم لكم خلاصة المصادر العالمية في مكان واحد. سواء كنت ابن الـ ITI أو لسه بتبدأ طريقك.. المنصة دي صُنعت بكل حب، لتكون دليلك للاحتراف. ❤️
                            </p>
                        </div>

                    </div>

                </div>

                {/* LinkedIn Button – centered on full section width (same axis as badge) */}
                <div className="w-full flex justify-center mt-10">
                    <a
                        href="https://www.linkedin.com/in/moatasm-shaban-7994711a2/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold bg-[#0A66C2] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    >
                        <Linkedin className="w-5 h-5" />
                        <span>Let's Connect</span>
                        <ExternalLink className="w-4 h-4 opacity-70" />
                    </a>
                </div>
            </div>
        </section>
    )
}
