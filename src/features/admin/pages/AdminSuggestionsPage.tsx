import { useState } from 'react';
import { SubmissionPageTemplate } from '../components/community/SubmissionPageTemplate';
import { CommunitySubmissionDTO } from '@/services/community-submissions';
import { AddResourceModal } from '../components/community/AddResourceModal';

export default function AdminSuggestionsPage() {
    const [modalSubmission, setModalSubmission] = useState<CommunitySubmissionDTO | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <SubmissionPageTemplate
                key={refreshKey}
                type="suggestion"
                title="💡 Feature Suggestions"
                description="Explore ideas and improvements suggested by the community"
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
