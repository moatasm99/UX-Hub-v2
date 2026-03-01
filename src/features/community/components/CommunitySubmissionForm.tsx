import { useState } from 'react';
import { Send, MessageSquare, Lightbulb, Link2, CheckCircle2, Loader2 } from 'lucide-react';
import { communitySubmissionsService, SubmissionType } from '@/services/community-submissions';

const TYPE_OPTIONS: { value: SubmissionType; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" />, description: 'Share your thoughts about the platform' },
    { value: 'suggestion', label: 'Suggestion', icon: <Lightbulb className="w-4 h-4" />, description: 'Suggest new features or improvements' },
    { value: 'resource', label: 'Resource', icon: <Link2 className="w-4 h-4" />, description: 'Submit a useful learning resource' },
];

export default function CommunitySubmissionForm() {
    const [type, setType] = useState<SubmissionType>('feedback');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const isValid = title.trim().length > 0 && (type !== 'resource' || url.trim().length > 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await communitySubmissionsService.submit({
                type,
                title: title.trim(),
                message: message.trim() || undefined,
                url: type === 'resource' ? url.trim() : undefined,
            });
            setSubmitted(true);
            setTitle('');
            setMessage('');
            setUrl('');
            setTimeout(() => setSubmitted(false), 4000);
        } catch {
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="max-w-2xl mx-auto">
            <div className="rounded-3xl border-2 overflow-hidden bg-[var(--bg-card)] border-[var(--border-accent)]">
                {/* Header */}
                <div className="px-6 py-5 bg-[var(--bg-muted)] border-b border-[var(--border-main)]">
                    <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
                        💬 Suggest Improvement or Submit Resource
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Help us improve! Share feedback, ideas, or useful resources.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Type Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-main)]">
                            Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {TYPE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setType(opt.value)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center
                                        ${type === opt.value
                                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                                            : 'border-[var(--border-main)] hover:border-[var(--border-strong)] text-[var(--text-secondary)]'
                                        }`}
                                >
                                    {opt.icon}
                                    <span className="text-xs font-semibold">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="submission-title" className="text-sm font-semibold text-[var(--text-main)]">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="submission-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder={type === 'resource' ? 'Resource name...' : 'Brief description...'}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {/* URL — only for resource type */}
                    {type === 'resource' && (
                        <div className="space-y-2">
                            <label htmlFor="submission-url" className="text-sm font-semibold text-[var(--text-main)]">
                                URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="submission-url"
                                type="url"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    )}

                    {/* Message */}
                    <div className="space-y-2">
                        <label htmlFor="submission-message" className="text-sm font-semibold text-[var(--text-main)]">
                            Message <span className="text-[var(--text-muted)]">(optional)</span>
                        </label>
                        <textarea
                            id="submission-message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Tell us more..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-main)] bg-[var(--bg-muted)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all
                            ${isValid && !isSubmitting
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/25 cursor-pointer'
                                : 'bg-[var(--bg-muted)] text-[var(--text-muted)] cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : submitted ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Submitted! Thank you 🎉
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}
