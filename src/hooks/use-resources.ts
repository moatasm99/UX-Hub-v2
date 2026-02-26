/**
 * Resource & Task Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getResourcesByModule, getTasksByModule } from '@/services/resources'

export function useResourcesByModule(moduleId: string) {
    return useQuery({
        queryKey: queryKeys.resources.byModule(moduleId),
        queryFn: () => getResourcesByModule(moduleId),
        enabled: !!moduleId,
    })
}

export function useTasksByModule(moduleId: string) {
    return useQuery({
        queryKey: queryKeys.tasks.byModule(moduleId),
        queryFn: () => getTasksByModule(moduleId),
        enabled: !!moduleId,
    })
}
