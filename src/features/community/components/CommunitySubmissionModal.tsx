import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerChildren } from '@/lib/motion';
import { MessageSquare, X, Send, Link2, Lightbulb, CheckCircle2, Loader2, Info } from 'lucide-react';
import { communitySubmissionsService, SubmissionType } from '@/services/community-submissions';

interface CommunitySubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommunitySubmissionModal({ isOpen, onClose }: CommunitySubmissionModalProps) {
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Form fields
    const [type, setType] = useState<SubmissionType>('feedback');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('');

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
                name: name.trim() || undefined,
                email: email.trim() || undefined,
            });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
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
        setName('');
        setEmail('');
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#020617]/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !isSubmitting && onClose()}
                    />
 
                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[var(--bg-card)] rounded-3xl border-2 border-[var(--border-accent)] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 bg-[var(--bg-muted)] border-b border-[var(--border-main)] flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                                    💬 Contribution Hub
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Info className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                    <span className="text-xs text-[var(--text-secondary)]">From: {context.label}</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
 
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-12 text-center space-y-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                            className="w-20 h-20 bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] rounded-full flex items-center justify-center mx-auto"
                                        >
                                            <CheckCircle2 className="w-10 h-10" />
                                        </motion.div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-bold text-[var(--text-main)]">Thank You!</h4>
                                            <p className="text-[var(--text-secondary)]">Your contribution has been received and is being reviewed by the community.</p>
                                        </div>
                                        <div className="pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={onClose}
                                                className="px-6 py-2 rounded-xl bg-[var(--bg-muted)] text-[var(--text-main)] font-semibold border border-[var(--border-main)]"
                                            >
                                                Close
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        variants={staggerChildren(0.05)}
                                        initial="initial"
                                        animate="animate"
                                        exit={{ opacity: 0, y: -20 }}
                                        onSubmit={handleSubmit}
                                        className="p-6 space-y-5"
                                    >
                                        {/* Contributor Info (Optional) */}
                                        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest pl-1">Your Name</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    placeholder="Optional"
                                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:outline-none transition-all text-sm font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest pl-1">Your Email</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="Optional"
                                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:outline-none transition-all text-sm font-bold"
                                                />
                                            </div>
                                        </motion.div>
 
                                        {email && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-500/20 p-3 rounded-2xl flex items-start gap-3"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                                                <p className="text-[10px] text-purple-700 dark:text-purple-300 font-bold leading-relaxed">
                                                    Provide your email to earn a <b>Top Contributor</b> badge and track your submissions!
                                                </p>
                                            </motion.div>
                                        )}
 
                                        <div className="h-px bg-[var(--border-main)]" />
 
                                        {/* Type Selector */}
                                        <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-2">
                                            {(['feedback', 'suggestion', 'resource'] as const).map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setType(t)}
                                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all
                                                        ${type === t
                                                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                                                            : 'border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                                                        }`}
                                                >
                                                    {t === 'feedback' && <MessageSquare className="w-4 h-4" />}
                                                    {t === 'suggestion' && <Lightbulb className="w-4 h-4" />}
                                                    {t === 'resource' && <Link2 className="w-4 h-4" />}
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">{t}</span>
                                                </button>
                                            ))}
                                        </motion.div>
 
                                        <motion.div variants={fadeInUp} className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5 block">Title</label>
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={e => setTitle(e.target.value)}
                                                    placeholder={type === 'resource' ? 'Resource name...' : 'Describe your feedback...'}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:outline-none transition-all"
                                                />
                                            </div>
 
                                            {type === 'resource' && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5 block">URL</label>
                                                    <input
                                                        type="url"
                                                        value={url}
                                                        onChange={e => setUrl(e.target.value)}
                                                        placeholder="https://..."
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:outline-none transition-all"
                                                    />
                                                </motion.div>
                                            )}
 
                                            <div>
                                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5 block">Message (Optional)</label>
                                                <textarea
                                                    value={message}
                                                    onChange={e => setMessage(e.target.value)}
                                                    placeholder="Add details..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] focus:border-[var(--accent-primary)] focus:outline-none transition-all resize-none"
                                                />
                                            </div>
                                        </motion.div>
 
                                        <motion.button
                                            variants={fadeInUp}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={!title.trim() || isSubmitting}
                                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-all
                                                ${!title.trim() || isSubmitting
                                                    ? 'bg-[var(--bg-muted)] text-[var(--text-muted)] cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-purple-600 to-violet-600 shadow-purple-500/25'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                            {isSubmitting ? 'Submitting...' : 'Send Contribution'}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
