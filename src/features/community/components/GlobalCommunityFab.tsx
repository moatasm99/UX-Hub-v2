import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, Link2, Lightbulb, CheckCircle2, Loader2, Info } from 'lucide-react';
import { communitySubmissionsService, SubmissionType } from '@/services/community-submissions';

export default function GlobalCommunityFab() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Form fields
    const [type, setType] = useState<SubmissionType>('feedback');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('');

    // Don't render on admin routes
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    // Smart context detection
    const getContextInfo = () => {
        const path = location.pathname;
        const pageTitle = document.title.split('|')[0].trim();

        if (path === '/') return { type: 'general' as const, label: 'Landing Page' };
        if (path.startsWith('/roadmap')) return { type: 'roadmap' as const, label: `Roadmap: ${pageTitle}` };
        if (path.startsWith('/dictionary')) return { type: 'dictionary' as const, label: `Dictionary: ${pageTitle}` };
        if (path.startsWith('/courses')) return { type: 'course' as const, label: `Course: ${pageTitle}` };

        return { type: 'general' as const, label: pageTitle || 'Platform' };
    };

    const context = getContextInfo();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await communitySubmissionsService.submit({
                type,
                title: title.trim(),
                message: message.trim() || undefined,
                url: type === 'resource' ? url.trim() : undefined,
                context_url: window.location.href,
                context_title: context.label,
            });
            setSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                resetForm();
            }, 2000);
        } catch (err) {
            console.error(err);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setMessage('');
        setUrl('');
        setType('feedback');
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-xl shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all group"
            >
                <div className="relative">
                    <MessageSquare className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                </div>
                <span className="font-bold text-sm">Feedback</span>
            </button>

            {/* Modal Portal */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-200 dark:border-purple-500/30 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-b border-purple-100 dark:border-purple-500/20 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    💬 Contribution Hub
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Info className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs text-slate-500">From: {context.label}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Type Selector */}
                            <div className="grid grid-cols-3 gap-2">
                                {(['feedback', 'suggestion', 'resource'] as const).map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setType(t)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all
                                            ${type === t
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        {t === 'feedback' && <MessageSquare className="w-4 h-4" />}
                                        {t === 'suggestion' && <Lightbulb className="w-4 h-4" />}
                                        {t === 'resource' && <Link2 className="w-4 h-4" />}
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{t}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder={type === 'resource' ? 'Resource name...' : 'Describe your feedback...'}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all"
                                    />
                                </div>

                                {type === 'resource' && (
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">URL</label>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={e => setUrl(e.target.value)}
                                            placeholder="https://..."
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Message (Optional)</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Add details..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!title.trim() || isSubmitting}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-all
                                    ${!title.trim() || isSubmitting
                                        ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:scale-[1.02] shadow-purple-500/25'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : submitted ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {isSubmitting ? 'Submitting...' : submitted ? 'Success!' : 'Send Contribution'}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
