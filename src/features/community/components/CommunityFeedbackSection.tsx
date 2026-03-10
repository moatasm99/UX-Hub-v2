import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommunitySubmissionModal } from './CommunitySubmissionModal';
import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/motion';

export function CommunityFeedbackSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    return (
        <section className="mt-12 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-3xl border-2 border-[var(--border-main)] bg-[var(--bg-card)] p-8 md:p-10 shadow-sm transition-all hover:border-[var(--accent-primary)]/30"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -tr-y-1/2 -tr-x-1/2 w-32 h-32 bg-[var(--accent-primary)]/5 blur-[80px] rounded-full group-hover:bg-[var(--accent-primary)]/10 transition-colors" />
                <div className="absolute bottom-0 left-0 tr-y-1/2 tr-x-1/2 w-24 h-24 bg-blue-500/5 blur-[60px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

                <div className="relative flex flex-col md:flex-row items-center gap-8 md:justify-between text-center md:text-left">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] mb-4">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2">
                            Have feedback or resources to suggest?
                        </h2>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            We're constantly evolving the UX Design Hub. If you've found a great resource
                            or have ideas to improve the platform, we'd love to hear from you!
                        </p>
                    </div>

                    <motion.button
                        variants={hoverLift}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setIsModalOpen(true)}
                        className="whitespace-nowrap px-8 py-4 rounded-2xl bg-[var(--text-main)] text-[var(--bg-app)] font-bold shadow-xl shadow-[var(--text-main)]/5"
                    >
                        Send Feedback
                    </motion.button>
                </div>
            </motion.div>

            <CommunitySubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
