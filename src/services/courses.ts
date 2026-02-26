/**
 * Courses Service
 *
 * All Supabase queries for courses.
 * UI components should NEVER import this directly — use hooks instead.
 */

import { supabase } from '@/lib/supabase'
import type { Course, CourseType } from '@/types/database'

export async function getCourses(type?: CourseType): Promise<Course[]> {
    let query = supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true })

    if (type) {
        query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) throw error
    return data ?? []
}

export async function getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function getCourseCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('category')
        .eq('is_published', true)
        .eq('type', 'roadmap')
        .order('category')

    if (error) throw error

    const rows = (data ?? []) as Array<{ category: string | null }>
    const categories = [...new Set(rows.map((c) => c.category).filter(Boolean))] as string[]
    return categories
}

export async function getCoursesByCategory(category: string): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .eq('type', 'roadmap')
        .eq('category', category)
        .order('order_index', { ascending: true })

    if (error) throw error
    return data ?? []
}
