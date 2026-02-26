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
        <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-400" />
                Course Icon
            </label>

            {/* Selected preview + toggle */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all shrink-0"
                    style={{
                        background: value ? currentBg : undefined,
                        borderColor: value ? 'rgba(99,102,241,0.4)' : 'rgba(71,85,105,0.5)',
                        borderStyle: value ? 'solid' : 'dashed',
                    }}
                >
                    {value ? (
                        <img src={getCourseIconUrl(value)!} alt={value} className="w-8 h-8" />
                    ) : (
                        <Image className="w-5 h-5 text-slate-500" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    {value ? (
                        <div className="flex items-center gap-2">
                            <code className="text-xs bg-slate-800 px-2 py-0.5 rounded text-blue-300">{value}</code>
                            <button type="button" onClick={() => onChange('')} className="text-slate-500 hover:text-red-400 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <span className="text-slate-500 text-xs">No icon selected</span>
                    )}
                    <button type="button" onClick={() => setIsOpen(!isOpen)} className="block text-xs text-blue-400 hover:text-blue-300 mt-0.5">
                        {isOpen ? 'Close picker' : 'Choose icon'}
                    </button>
                </div>
            </div>

            {/* Icon grid picker */}
            {isOpen && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto">
                        {COURSE_ICONS.map(icon => (
                            <button
                                key={icon.value}
                                type="button"
                                onClick={() => { onChange(icon.value); setIsOpen(false); }}
                                title={icon.label}
                                className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl transition-all ${value === icon.value
                                        ? 'bg-blue-600/20 ring-2 ring-blue-500 scale-105'
                                        : 'hover:bg-slate-800'
                                    }`}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ background: currentBg }}
                                >
                                    <img src={getCourseIconUrl(icon.value)!} alt={icon.label} className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] text-slate-400 truncate w-full text-center">{icon.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Background color picker */}
                    {onBgColorChange && (
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                            <label className="text-xs font-medium text-slate-400">Icon Background</label>
                            <div className="flex items-center gap-2 flex-wrap">
                                {BG_PRESETS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => onBgColorChange(color)}
                                        className={`w-7 h-7 rounded-lg border-2 transition-all ${currentBg === color ? 'border-blue-500 scale-110' : 'border-transparent hover:border-slate-600'
                                            }`}
                                        style={{ background: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
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
                                    placeholder="Any CSS background, e.g. linear-gradient(...)"
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500"
                                />
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
