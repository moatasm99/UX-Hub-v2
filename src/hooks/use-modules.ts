/**
 * Module Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getModulesByCourse, getModuleById } from '@/services/modules'

export function useModulesByCourse(courseId: string) {
    return useQuery({
        queryKey: queryKeys.modules.byCourse(courseId),
        queryFn: () => getModulesByCourse(courseId),
        enabled: !!courseId,
    })
}

export function useModule(id: string) {
    return useQuery({
        queryKey: queryKeys.modules.detail(id),
        queryFn: () => getModuleById(id),
        enabled: !!id,
    })
}
