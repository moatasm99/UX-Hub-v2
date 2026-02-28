import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communitySubmissionsService, CommunitySubmissionDTO, SubmissionStatus, SubmissionType } from '@/services/community-submissions';
import { SubmissionCard } from './SubmissionCard';

interface Props {
    type: SubmissionType;
    title: string;
    description: string;
    onAddResource?: (submission: CommunitySubmissionDTO) => void;
}

const STATUS_TABS: { value: SubmissionStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
    { value: 'approved', label: 'Approved', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'rejected', label: 'Rejected', icon: <XCircle className="w-4 h-4" /> },
];

export function SubmissionPageTemplate({ type, title, description, onAddResource }: Props) {
    const [activeTab, setActiveTab] = useState<SubmissionStatus>('pending');
    const [submissions, setSubmissions] = useState<CommunitySubmissionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await communitySubmissionsService.getByTypeAndStatus(type, activeTab);
            setSubmissions(data);
        } catch (err) {
            console.error('Failed to load submissions:', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, type]);

    useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

    const handleStatusChange = async (id: string, status: SubmissionStatus) => {
        setActionLoading(id);
        try {
            await communitySubmissionsService.updateStatus(id, status);
            setSubmissions(prev => prev.filter(s => s.id !== id));
        } catch {
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/admin" className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{title}</h1>
                        <p className="text-sm text-slate-500">{description}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl bg-slate-900 w-fit border border-slate-800">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${activeTab === tab.value
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.value && !loading && (
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                                {submissions.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                    <p className="text-slate-500 text-lg italic">No {activeTab} {type}s at the moment</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {submissions.map(sub => (
                        <SubmissionCard
                            key={sub.id}
                            submission={sub}
                            activeTab={activeTab}
                            actionLoading={actionLoading}
                            onStatusChange={handleStatusChange}
                            onAddResource={onAddResource}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
