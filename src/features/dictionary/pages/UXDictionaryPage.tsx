import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Search, BookOpen, Copy, Check, Link2 } from 'lucide-react';
import { uxDictionary, LEVEL_LABELS, LEVEL_DESCRIPTIONS, type DictionaryTerm } from '@/data/ux-dictionary';
import { CommunityFeedbackSection } from '@/features/community/components/CommunityFeedbackSection';

/* ════════════════════════════════════════════════ */
/*  Term Card Component                            */
/* ════════════════════════════════════════════════ */
const TermCard = memo(function TermCard({ term, highlight }: { term: DictionaryTerm; highlight: string }) {
    const [copied, setCopied] = useState(false);

    const copyTerm = useCallback(() => {
        navigator.clipboard.writeText(term.term);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [term.term]);

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} className="bg-amber-300/40 dark:bg-amber-500/30 text-inherit rounded px-0.5">{part}</mark>
                : part
        );
    };

    const levelColors: Record<number, string> = {
        1: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        2: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        3: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    };

    return (
        <article
            id={term.slug}
            className="group relative rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-6 transition-all duration-200 hover:border-amber-400/50 dark:hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
        >
            {/* Category badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${levelColors[term.level]}`}>
                    {term.category}
                </span>
                <div className="flex gap-1.5">
                    <button
                        onClick={copyTerm}
                        title="Copy term"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                        href={`#${term.slug}`}
                        title="Anchor link"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                    >
                        <Link2 className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* English term */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {highlightText(term.term, highlight)}
            </h3>

            {/* Arabic definition */}
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300" dir="rtl" lang="ar" style={{ fontFamily: "'Noto Sans Arabic', 'Segoe UI', sans-serif" }}>
                {highlightText(term.definition, highlight)}
            </p>
        </article>
    );
});

/* ════════════════════════════════════════════════ */
/*  Main Page Component                            */
/* ════════════════════════════════════════════════ */
export default function UXDictionaryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    // SEO
    useEffect(() => {
        document.title = 'UX/UI Dictionary | UX Hub';
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', 'Complete UX/UI glossary covering beginner to expert terminology in Product Design.');
        }
    }, []);

    // Filter terms
    const filteredTerms = useMemo(() => {
        let terms = uxDictionary.filter(t => t.level === activeLevel);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            terms = terms.filter(t =>
                t.term.toLowerCase().includes(q) ||
                t.definition.toLowerCase().includes(q)
            );
        }

        if (activeLetter) {
            terms = terms.filter(t => t.term[0].toUpperCase() === activeLetter);
        }

        return terms;
    }, [activeLevel, searchQuery, activeLetter]);

    // Available letters for current level
    const availableLetters = useMemo(() => {
        const levelTerms = uxDictionary.filter(t => t.level === activeLevel);
        const letters = new Set(levelTerms.map(t => t.term[0].toUpperCase()));
        return Array.from(letters).sort();
    }, [activeLevel]);

    // Group by category
    const groupedTerms = useMemo(() => {
        const groups: Record<string, DictionaryTerm[]> = {};
        filteredTerms.forEach(t => {
            if (!groups[t.category]) groups[t.category] = [];
            groups[t.category].push(t);
        });
        return groups;
    }, [filteredTerms]);

    // Level tab colors
    const levelTabStyles: Record<number, { active: string; inactive: string }> = {
        1: {
            active: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25',
            inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
        },
        2: {
            active: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
            inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
        },
        3: {
            active: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25',
            inactive: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
        },
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">

            {/* Hero */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            Comprehensive UX/UI Glossary
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            📘 UX/UI Dictionary
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4 text-slate-600 dark:text-slate-400">
                        Complete UX/UI glossary covering beginner to expert terminology in Product Design.
                    </p>
                    <p className="text-sm max-w-xl mx-auto text-slate-500 dark:text-slate-500" dir="rtl">
                        {LEVEL_DESCRIPTIONS[activeLevel]}
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-xl mx-auto mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search terms or definitions..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setActiveLetter(null); }}
                        className="w-full pl-12 pr-4 py-4 rounded-3xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/20 text-lg bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-amber-500 text-slate-900 dark:text-white placeholder-slate-400"
                        aria-label="Search dictionary"
                    />
                </div>
            </section>

            {/* Level Tabs + Alphabet */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    {/* Level tabs */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {([1, 2, 3] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => { setActiveLevel(level); setActiveLetter(null); setSearchQuery(''); }}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeLevel === level
                                    ? levelTabStyles[level].active
                                    : levelTabStyles[level].inactive
                                    }`}
                            >
                                {LEVEL_LABELS[level]}
                            </button>
                        ))}
                        <span className="ml-auto self-center text-sm text-slate-500 dark:text-slate-400">
                            {filteredTerms.length} terms
                        </span>
                    </div>

                    {/* Alphabet nav */}
                    <div className="flex flex-wrap gap-1">
                        <button
                            onClick={() => setActiveLetter(null)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${!activeLetter
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            All
                        </button>
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                            const isAvailable = availableLetters.includes(letter);
                            const isActive = activeLetter === letter;
                            return (
                                <button
                                    key={letter}
                                    onClick={() => isAvailable && setActiveLetter(isActive ? null : letter)}
                                    disabled={!isAvailable}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${isActive
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : isAvailable
                                            ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                        }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Level 3 warning */}
            {activeLevel === 3 && (
                <div className="max-w-7xl mx-auto px-4 mt-6">
                    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-center" dir="rtl">
                        <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                            ⚠️ تنبيه هام: المصطلحات دي هي (أسلحة ثقيلة). استخدمها لما تكون بتناقش استراتيجية أو بتبني قسم UX في شركة، لكن بلاش تستخدمها مع عميل بسيط عشان ميتخضش منك!
                        </p>
                    </div>
                </div>
            )}

            {/* Terms Grid */}
            <main className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {filteredTerms.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-slate-500 dark:text-slate-400 mb-2">No terms found</p>
                            <p className="text-sm text-slate-400">Try a different search or level.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {Object.entries(groupedTerms).map(([category, terms]) => (
                                <section key={category}>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-500"></span>
                                        {category}
                                        <span className="text-xs font-normal text-slate-400 ml-1">({terms.length})</span>
                                    </h2>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {terms.map(term => (
                                            <TermCard key={term.slug} term={term} highlight={searchQuery} />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>

                <div className="max-w-7xl mx-auto px-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <CommunityFeedbackSection />
                </div>
            </main>
        </div>
    );
}
