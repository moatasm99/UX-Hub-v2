import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { COURSE_ICONS, getCourseIconUrl, DEFAULT_ICON_BG } from '@/constants/courseIcons';

// ─── Preset background colors ──────────────────────────
const BG_PRESETS = [
    '#F5F5F5', '#E8F5E9', '#E3F2FD', '#FFF3E0',
    '#F3E5F5', '#FBE9E7', '#E0F7FA', '#FFFDE7',
    '#FCE4EC', '#EDE7F6', '#E8EAF6', '#E0F2F1',
];

// ─── Icon Selector (admin form) ──────────────────────
interface IconSelectorProps {
    value: string;
    onChange: (key: string) => void;
    bgColor?: string;
    onBgColorChange?: (color: string) => void;
}

export function IconSelector({ value, onChange, bgColor, onBgColorChange }: IconSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentBg = bgColor || DEFAULT_ICON_BG;

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-wider">
                <Image className="w-4 h-4 text-[var(--accent-primary)]" />
                Course Icon
            </label>

            {/* Selected preview + toggle */}
            <div className="flex items-center gap-4 p-4 bg-[var(--bg-muted)]/30 border border-[var(--border-main)] rounded-xl shadow-sm">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all shrink-0 shadow-lg"
                    style={{
                        background: value ? currentBg : undefined,
                        borderColor: value ? 'var(--accent-primary)' : 'var(--border-main)',
                        borderStyle: value ? 'solid' : 'dashed',
                    }}
                >
                    {value ? (
                        <img src={getCourseIconUrl(value)!} alt={value} className="w-10 h-10" />
                    ) : (
                        <Image className="w-6 h-6 text-[var(--text-muted)]" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    {value ? (
                        <div className="flex items-center gap-3">
                            <code className="text-xs font-bold bg-[var(--bg-card)] border border-[var(--border-main)] px-3 py-1 rounded-lg text-[var(--accent-primary)]">{value}</code>
                            <button type="button" onClick={() => onChange('')} className="p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Remove icon">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <span className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">No icon selected</span>
                    )}
                    <button type="button" onClick={() => setIsOpen(!isOpen)} className="block text-xs text-[var(--accent-primary)] hover:opacity-80 mt-1.5 font-bold transition-all underline underline-offset-4">
                        {isOpen ? 'Close picker' : 'Choose icon'}
                    </button>
                </div>
            </div>

            {/* Icon grid picker */}
            {isOpen && (
                <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl space-y-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {COURSE_ICONS.map(icon => (
                            <button
                                key={icon.value}
                                type="button"
                                onClick={() => { onChange(icon.value); setIsOpen(false); }}
                                title={icon.label}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all border-2 ${value === icon.value
                                    ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/10 scale-105'
                                    : 'bg-[var(--bg-muted)] border-transparent hover:border-[var(--border-strong)]'
                                    }`}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                                    style={{ background: currentBg }}
                                >
                                    <img src={getCourseIconUrl(icon.value)!} alt={icon.label} className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] text-[var(--text-muted)] font-bold truncate w-full text-center uppercase tracking-tighter">{icon.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Background color picker */}
                    {onBgColorChange && (
                        <div className="pt-5 border-t border-[var(--border-main)] space-y-4">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Icon Background Overlay</label>
                            <div className="flex items-center gap-2 flex-wrap">
                                {BG_PRESETS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => onBgColorChange(color)}
                                        className={`w-8 h-8 rounded-lg border-2 transition-all shadow-sm ${currentBg === color ? 'border-[var(--accent-primary)] scale-110 shadow-[var(--accent-primary)]/20' : 'border-transparent hover:border-[var(--border-strong)]'
                                            }`}
                                        style={{ background: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                                <div className="flex items-center gap-3 bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg px-3 py-2 flex-1">
                                    <input
                                        type="color"
                                        value={currentBg.startsWith('#') ? currentBg : '#F5F5F5'}
                                        onChange={e => onBgColorChange(e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                                        title="Color picker"
                                    />
                                    <input
                                        type="text"
                                        value={currentBg}
                                        onChange={e => onBgColorChange(e.target.value)}
                                        placeholder="HEX or Gradient..."
                                        className="flex-1 bg-transparent border-none text-xs text-[var(--text-main)] placeholder:[var(--text-muted)] outline-none font-bold"
                                    />
                                </div>
                                <span className="text-[10px] text-[var(--text-muted)] font-bold italic px-2">Example: #F5F5F5 or linear-gradient(...)</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Course Icon (public-facing render) ──────────────
export function CourseIcon({
    iconKey,
    bgColor,
    size = 48,
    className = '',
}: {
    iconKey: string | null | undefined;
    bgColor?: string | null;
    size?: number;
    className?: string;
}) {
    const url = getCourseIconUrl(iconKey);
    if (!url) return null;

    return (
        <div
            className={`rounded-2xl flex items-center justify-center shrink-0 ${className}`}
            style={{
                background: bgColor || DEFAULT_ICON_BG,
                width: size,
                height: size,
            }}
        >
            <img src={url} alt={iconKey || 'icon'} style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
    );
}
