import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { RoadmapTrackDTO } from '@/services/roadmap-tracks';

interface AdminTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: RoadmapTrackDTO | null;
    isSubmitting?: boolean;
}

const emptyForm = {
    title: '',
    description: '',
    is_published: true,
};

export default function AdminTrackModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isSubmitting = false,
}: AdminTrackModalProps) {
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    description: initialData.description ?? '',
                    is_published: initialData.is_published,
                });
            } else {
                setFormData(emptyForm);
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
    };

    if (!isOpen) return null;

    const inputCls = 'w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all placeholder:[var(--text-muted)] font-medium';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[var(--border-main)]">
                        <h2 className="text-xl font-bold text-[var(--text-main)]">
                            {initialData ? 'Edit Track' : 'Add Track'}
                        </h2>
                        <button type="button" onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--bg-muted)] transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[var(--text-secondary)]">Title *</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className={inputCls}
                                placeholder="Enter track title..."
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[var(--text-secondary)]">Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`${inputCls} resize-none`}
                                placeholder="What is this track about?"
                                rows={3}
                            />
                        </div>

                        {/* Publish toggle */}
                        <div
                            className="flex items-center justify-between p-4 bg-[var(--bg-muted)]/50 border border-[var(--border-main)] rounded-lg cursor-pointer hover:border-[var(--border-strong)] transition-colors"
                            onClick={() => setFormData(p => ({ ...p, is_published: !p.is_published }))}
                        >
                            <div className="space-y-0.5">
                                <span className="text-sm font-semibold text-[var(--text-main)]">Publish immediately</span>
                                <p className="text-xs text-[var(--text-muted)]">Make this track visible to everyone</p>
                            </div>
                            <button
                                type="button"
                                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${formData.is_published ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-main)]'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 p-6 border-t border-[var(--border-main)] bg-[var(--bg-muted)]/30">
                        <button type="button" onClick={onClose} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-lg shadow-lg shadow-[var(--accent-primary)]/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {initialData ? 'Update Track' : 'Create Track'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
