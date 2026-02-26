import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer"

type Props = {
    value: string
    onChange: (value: string) => void
    label?: string
}

export function MarkdownEditorWithPreview({ value, onChange, label }: Props) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-slate-400">
                    {label}
                </label>
            )}

            <div className="grid md:grid-cols-2 gap-6">

                {/* Editor */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Editor</span>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={12}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 p-4 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none transition-all"
                        placeholder="Write your task using Markdown..."
                    />
                </div>

                {/* Preview */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Live Preview</span>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4 min-h-[250px] overflow-auto prose-themed prose-sm">
                        <MarkdownRenderer content={value} />
                    </div>
                </div>
            </div>
        </div>
    )
}
