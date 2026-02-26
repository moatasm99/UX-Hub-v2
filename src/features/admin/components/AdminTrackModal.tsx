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

    const inputCls = 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? 'Edit Track' : 'Add Track'}
                        </h2>
                        <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">Title *</label>
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
                            <label className="block text-sm font-semibold text-slate-300">Description (Optional)</label>
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
                            className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors"
                            onClick={() => setFormData(p => ({ ...p, is_published: !p.is_published }))}
                        >
                            <div className="space-y-0.5">
                                <span className="text-sm font-semibold text-slate-200">Publish immediately</span>
                                <p className="text-xs text-slate-500">Make this track visible to everyone</p>
                            </div>
                            <button
                                type="button"
                                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${formData.is_published ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-800 bg-slate-900/50">
                        <button type="button" onClick={onClose} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
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
