import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';
import { CommunitySubmissionModal } from './CommunitySubmissionModal';

export function GlobalCommunityFab() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Do not show on admin routes
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25 hover:scale-110 active:scale-95 transition-all duration-200 group"
                aria-label="Send Feedback"
            >
                <MessageSquarePlus className="w-6 h-6 transition-transform group-hover:rotate-12" />

                {/* Tooltip */}
                <span className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                    Give Feedback 💬
                </span>
            </button>

            <CommunitySubmissionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
