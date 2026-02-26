/**
 * Modules Service
 *
 * Supabase queries for course modules.
 */

import { supabase } from '@/lib/supabase'
import type { Module } from '@/types/database'

export async function getModulesByCourse(courseId: string): Promise<Module[]> {
    const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

    if (error) throw error
    return data ?? []
}

export async function getModuleById(id: string): Promise<Module | null> {
    const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}
