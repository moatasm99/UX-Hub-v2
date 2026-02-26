import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"

type MarkdownRendererProps = {
    content?: string | null
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    if (!content) return null

    return (
        <div className="prose prose-slate dark:prose-invert max-w-none break-words">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
