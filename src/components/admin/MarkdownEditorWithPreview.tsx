import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer"

type Props = {
    value: string
    onChange: (value: string) => void
    label?: string
}

export function MarkdownEditorWithPreview({ value, onChange, label }: Props) {
    return (
        <div className="space-y-4">
            {label && (
                <label className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Editor */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 ml-1">Editor</span>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={12}
                        className="w-full rounded-lg bg-[var(--bg-muted)] border border-[var(--border-main)] p-4 text-sm font-mono text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] resize-none transition-all placeholder-[var(--text-muted)] font-medium"
                        placeholder="Write your content using Markdown..."
                    />
                </div>

                {/* Preview */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 ml-1">Live Preview</span>
                    <div className="rounded-lg border border-[var(--border-main)] bg-[var(--bg-card)] p-5 min-h-[290px] overflow-auto prose-themed prose-sm shadow-inner">
                        <MarkdownRenderer content={value} />
                    </div>
                </div>
            </div>
        </div>
    )
}
