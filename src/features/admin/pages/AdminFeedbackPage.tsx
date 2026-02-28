import { useState } from 'react';
import { SubmissionPageTemplate } from '../components/community/SubmissionPageTemplate';
import { CommunitySubmissionDTO } from '@/services/community-submissions';
import { AddResourceModal } from '../components/community/AddResourceModal';

export default function AdminFeedbackPage() {
    const [modalSubmission, setModalSubmission] = useState<CommunitySubmissionDTO | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <SubmissionPageTemplate
                key={refreshKey}
                type="feedback"
                title="💬 General Feedback"
                description="Monitor user feedback and report bugs from the community"
                onAddResource={setModalSubmission}
            />

            {modalSubmission && (
                <AddResourceModal
                    submission={modalSubmission}
                    onClose={() => setModalSubmission(null)}
                    onSuccess={() => {
                        setModalSubmission(null);
                        setRefreshKey(prev => prev + 1);
                    }}
                />
            )}
        </>
    );
}
