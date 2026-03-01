import type { ModuleResourceWithDetails } from '@/services/resources'

interface ResourceListProps {
    resources: ModuleResourceWithDetails[]
}

const typeIcons: Record<string, string> = {
    video: '🎬',
    article: '📝',
    playlist: '🎵',
}

export function ResourceList({ resources }: ResourceListProps) {
    const coreResources = resources.filter((r) => r.is_core)
    const supplementary = resources.filter((r) => !r.is_core)

    return (
        <div className="space-y-3">
            {coreResources.length > 0 && (
                <ResourceSection title="Core Resources" items={coreResources} />
            )}
            {supplementary.length > 0 && (
                <ResourceSection title="Supplementary" items={supplementary} />
            )}
        </div>
    )
}

function ResourceSection({
    title,
    items,
}: {
    title: string
    items: ModuleResourceWithDetails[]
}) {
    return (
        <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {title}
            </h4>
            <ul className="space-y-1.5">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]"
                        >
                            <span>{typeIcons[item.resource.type] ?? '📎'}</span>
                            <span className="flex-1">{item.resource.title}</span>
                            {item.resource.provider && (
                                <span className="text-xs text-[var(--text-muted)]">
                                    {item.resource.provider}
                                </span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
