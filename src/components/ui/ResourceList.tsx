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
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {title}
            </h4>
            <ul className="space-y-1.5">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                        >
                            <span>{typeIcons[item.resource.type] ?? '📎'}</span>
                            <span className="flex-1">{item.resource.title}</span>
                            {item.resource.provider && (
                                <span className="text-xs text-gray-400">
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
