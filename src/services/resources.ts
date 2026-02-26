/**
 * Resources Service
 *
 * Supabase queries for the unified resource library.
 * Fetches resources through the module_resources junction table.
 */

import { supabase } from '@/lib/supabase'
import type { Resource, Task } from '@/types/database'

export interface ModuleResourceWithDetails {
    id: string
    is_core: boolean
    order_index: number
    resource: Resource
}

export async function getResourcesByModule(
    moduleId: string
): Promise<ModuleResourceWithDetails[]> {
    const { data, error } = await supabase
        .from('module_resources')
        .select(`
            id,
            is_core,
            order_index,
            resource:resources (*)
        `)
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true })

    if (error) throw error

    // Flatten the joined result — cast needed because our
    // simplified Database interface can't express join shapes.
    const rows = (data ?? []) as Array<{
        id: string
        is_core: boolean
        order_index: number
        resource: Resource
    }>
    return rows.map((row) => ({
        id: row.id,
        is_core: row.is_core,
        order_index: row.order_index,
        resource: row.resource,
    }))
}

export async function getTasksByModule(moduleId: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('module_id', moduleId)

    if (error) throw error
    return data ?? []
}
