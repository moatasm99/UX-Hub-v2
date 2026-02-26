/**
 * UX Design Hub 2.0 — Supabase Database Types
 *
 * These types mirror the database schema defined in
 * supabase/migrations/001_create_schema.sql
 *
 * NOTE: For production, generate types automatically with:
 *   npx supabase gen types typescript --project-id psksmlpiqfvafrxqkmps > src/types/database.ts
 */

// ─── Enums ────────────────────────────────────────────
export type CourseType = 'intensive' | 'roadmap'
export type ResourceType = 'video' | 'article' | 'playlist'

// ─── Row Types ────────────────────────────────────────

export interface Course {
    id: string
    title: string
    description: string | null
    category: string | null
    type: CourseType
    icon: string | null
    order_index: number
    is_published: boolean
    created_at: string
}

export interface Module {
    id: string
    course_id: string
    title: string
    day_number: number | null
    description: string | null
    order_index: number
    is_required: boolean
}

export interface Resource {
    id: string
    title: string
    url: string
    type: ResourceType
    provider: string | null
    is_active: boolean
    created_at: string
}

export interface ModuleResource {
    id: string
    module_id: string
    resource_id: string
    is_core: boolean
    order_index: number
}

export interface Task {
    id: string
    module_id: string
    description: string
    deliverable_hint: string | null
}

export interface SiteConfig {
    id: string
    key: string
    value: Record<string, unknown>
}

// ─── Insert Types (omit auto-generated fields) ───────

export type CourseInsert = Omit<Course, 'id' | 'created_at'> & {
    id?: string
    created_at?: string
}

export type ModuleInsert = Omit<Module, 'id'> & { id?: string }

export type ResourceInsert = Omit<Resource, 'id' | 'created_at'> & {
    id?: string
    created_at?: string
}

export type ModuleResourceInsert = Omit<ModuleResource, 'id'> & { id?: string }

export type TaskInsert = Omit<Task, 'id'> & { id?: string }

export type SiteConfigInsert = Omit<SiteConfig, 'id'> & { id?: string }

// ─── Database Schema (for Supabase client typing) ─────

export interface Database {
    public: {
        Tables: {
            courses: {
                Row: Course
                Insert: CourseInsert
                Update: Partial<CourseInsert>
            }
            modules: {
                Row: Module
                Insert: ModuleInsert
                Update: Partial<ModuleInsert>
            }
            resources: {
                Row: Resource
                Insert: ResourceInsert
                Update: Partial<ResourceInsert>
            }
            module_resources: {
                Row: ModuleResource
                Insert: ModuleResourceInsert
                Update: Partial<ModuleResourceInsert>
            }
            tasks: {
                Row: Task
                Insert: TaskInsert
                Update: Partial<TaskInsert>
            }
            site_config: {
                Row: SiteConfig
                Insert: SiteConfigInsert
                Update: Partial<SiteConfigInsert>
            }
        }
        Enums: {
            course_type: CourseType
            resource_type: ResourceType
        }
    }
}
