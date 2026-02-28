import { useState } from 'react';
import { SubmissionPageTemplate } from '../components/community/SubmissionPageTemplate';
import { CommunitySubmissionDTO } from '@/services/community-submissions';
import { AddResourceModal } from '../components/community/AddResourceModal';

export default function AdminResourceSubmissionsPage() {
    const [modalSubmission, setModalSubmission] = useState<CommunitySubmissionDTO | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <SubmissionPageTemplate
                key={refreshKey}
                type="resource"
                title="📂 Resource Submissions"
                description="Review and add community-submitted resources to courses or roadmaps"
                onAddResource={setModalSubmission}
            />

            {modalSubmission && (
                <AddResourceModal
                    submission={modalSubmission}
                    onClose={() => setModalSubmission(null)}
                    onSuccess={() => {
                        setModalSubmission(null);
                        setRefreshKey(prev => prev + 1); // Refresh the list
                    }}
                />
            )}
        </>
    );
}
