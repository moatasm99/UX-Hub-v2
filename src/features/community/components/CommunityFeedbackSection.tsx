import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommunitySubmissionModal } from './CommunitySubmissionModal';

export function CommunityFeedbackSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative group overflow-hidden rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-sm transition-all hover:border-purple-300 dark:hover:border-purple-500/30">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -tr-y-1/2 -tr-x-1/2 w-32 h-32 bg-purple-500/5 blur-[80px] rounded-full group-hover:bg-purple-500/10 transition-colors" />
                <div className="absolute bottom-0 left-0 tr-y-1/2 tr-x-1/2 w-24 h-24 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

                <div className="relative flex flex-col md:flex-row items-center gap-8 md:justify-between text-center md:text-left">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mb-4">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Have feedback or resources to suggest?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We're constantly evolving the UX Design Hub. If you've found a great resource
                            or have ideas to improve the platform, we'd love to hear from you!
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="whitespace-nowrap px-8 py-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                    >
                        Send Feedback
                    </button>
                </div>
            </div>

            <CommunitySubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
