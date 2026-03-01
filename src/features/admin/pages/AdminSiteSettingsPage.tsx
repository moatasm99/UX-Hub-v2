import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/use-site-settings';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function AdminSiteSettingsPage() {
    const navigate = useNavigate();
    const { settings, isLoading } = useSiteSettings();
    const updateMutation = useUpdateSiteSettings();

    const [form, setForm] = useState({
        hero_badge_text: '',
        hero_title_line_1: '',
        hero_title_line_2: '',
        hero_role_label: '',
        hero_description: '',
        hero_button_text: '',
        hero_button_url: '',
        hero_image_url: '',
        hero_experience_label: '',
        hero_experience_value: '',
    });

    // Sync form when settings load
    useEffect(() => {
        if (settings) {
            setForm({
                hero_badge_text: settings.hero_badge_text || '',
                hero_title_line_1: settings.hero_title_line_1 || '',
                hero_title_line_2: settings.hero_title_line_2 || '',
                hero_role_label: settings.hero_role_label || '',
                hero_description: settings.hero_description || '',
                hero_button_text: settings.hero_button_text || '',
                hero_button_url: settings.hero_button_url || '',
                hero_image_url: settings.hero_image_url || '',
                hero_experience_label: settings.hero_experience_label || '',
                hero_experience_value: settings.hero_experience_value || '',
            });
        }
    }, [settings]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync(form);
        } catch {
            // Error handled by mutation state
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                            <Settings className="w-6 h-6 text-[var(--accent-primary)]" />
                            Site Settings
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1 font-medium">Manage your landing page hero section</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95"
                >
                    {updateMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Success/Error Messages */}
            {updateMutation.isSuccess && (
                <div className="p-4 bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/30 rounded-xl text-[var(--accent-emerald)] text-sm font-bold shadow-sm animate-in slide-in-from-top-2 duration-300">
                    ✅ Settings saved successfully!
                </div>
            )}
            {updateMutation.isError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold shadow-sm animate-in slide-in-from-top-2 duration-300">
                    ❌ Failed to save settings. Please try again.
                </div>
            )}

            {/* Hero Section Settings */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-6 space-y-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-main)] pb-4">
                    🎯 Hero Section
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Badge Text */}
                    <FieldInput
                        label="Badge Text"
                        value={form.hero_badge_text}
                        onChange={(v) => handleChange('hero_badge_text', v)}
                        placeholder="✨ Curated by Moatasm"
                        required
                    />

                    {/* Role Label */}
                    <FieldInput
                        label="Role Label"
                        value={form.hero_role_label}
                        onChange={(v) => handleChange('hero_role_label', v)}
                        placeholder="Product Designer"
                        required
                    />

                    {/* Title Line 1 */}
                    <FieldInput
                        label="Title — Line 1"
                        value={form.hero_title_line_1}
                        onChange={(v) => handleChange('hero_title_line_1', v)}
                        placeholder="يا مرحب بمرعبين الـ ITI 👋"
                        required
                    />

                    {/* Title Line 2 (Highlighted) */}
                    <FieldInput
                        label="Title — Line 2 (Highlighted)"
                        value={form.hero_title_line_2}
                        onChange={(v) => handleChange('hero_title_line_2', v)}
                        placeholder="أنا معتصم شعبان"
                        required
                    />

                    {/* Button Text */}
                    <FieldInput
                        label="CTA Button Text"
                        value={form.hero_button_text}
                        onChange={(v) => handleChange('hero_button_text', v)}
                        placeholder="Let's Connect"
                        required
                    />

                    {/* Button URL */}
                    <FieldInput
                        label="CTA Button URL"
                        value={form.hero_button_url}
                        onChange={(v) => handleChange('hero_button_url', v)}
                        placeholder="https://linkedin.com/in/..."
                        required
                    />

                    {/* Experience Label */}
                    <FieldInput
                        label="Experience Badge — Label"
                        value={form.hero_experience_label}
                        onChange={(v) => handleChange('hero_experience_label', v)}
                        placeholder="Experience"
                        required
                    />

                    {/* Experience Value */}
                    <FieldInput
                        label="Experience Badge — Value"
                        value={form.hero_experience_value}
                        onChange={(v) => handleChange('hero_experience_value', v)}
                        placeholder="Product Design"
                        required
                    />
                </div>

                {/* Image Upload */}
                <ImageUploader
                    currentUrl={form.hero_image_url}
                    onUploadComplete={(url) => handleChange('hero_image_url', url)}
                />

                {/* Description (full width textarea) */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                        Description <span className="text-[var(--text-muted)] font-normal">(supports multiple paragraphs)</span>
                    </label>
                    <textarea
                        value={form.hero_description}
                        onChange={(e) => handleChange('hero_description', e.target.value)}
                        rows={6}
                        className="w-full rounded-lg bg-[var(--bg-muted)] border border-[var(--border-main)] p-4 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] resize-none transition-all placeholder:[var(--text-muted)] font-medium"
                        placeholder="Write your hero description..."
                        dir="rtl"
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Reusable Field Component ────────────────────
function FieldInput({
    label, value, onChange, placeholder, required
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg bg-[var(--bg-muted)] border border-[var(--border-main)] px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] transition-all placeholder:[var(--text-muted)] font-medium"
            />
        </div>
    );
}
