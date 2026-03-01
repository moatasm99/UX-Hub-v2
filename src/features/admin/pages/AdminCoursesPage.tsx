import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAdminCourses } from '@/hooks/use-admin-courses';
import type { CourseDTO } from '@/services/admin-courses';
import CourseFormModal from '../components/CourseFormModal';

export default function AdminCoursesPage() {
    const { courses, isLoading, createCourse, updateCourse, deleteCourse } = useAdminCourses();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseDTO | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<CourseDTO | null>(null);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCreate = () => {
        setEditingCourse(null);
        setIsModalOpen(true);
    };

    const handleEdit = (course: CourseDTO) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (course: CourseDTO) => {
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (courseToDelete) {
            await deleteCourse.mutateAsync(courseToDelete.id);
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingCourse) {
                await updateCourse.mutateAsync({ ...data, id: editingCourse.id });
            } else {
                await createCourse.mutateAsync(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save course:', error);
        }
    };

    const handleTogglePublish = async (course: CourseDTO) => {
        await updateCourse.mutateAsync({
            id: course.id,
            is_published: !course.is_published
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Courses Manager</h1>
                    <p className="text-[var(--text-muted)] mt-1 font-medium">Manage intensive courses and roadmap tracks</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-[var(--accent-primary)]/20 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Course
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--bg-muted)] border border-[var(--border-main)] rounded-lg pl-10 pr-4 py-2.5 text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none transition-all placeholder-[var(--text-muted)] font-medium"
                />
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-muted)]/50 border-b border-[var(--border-main)]">
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Course</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-main)] text-sm">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-[var(--text-muted)] font-medium">
                                        No courses found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="group hover:bg-[var(--bg-muted)]/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--bg-card)] group-hover:text-[var(--accent-primary)] transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text-main)]">{course.title}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)] font-bold tabular-nums truncate max-w-[150px] uppercase opacity-70 tracking-tight">{course.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[var(--text-secondary)] font-medium">
                                            {course.category || <span className="text-[var(--text-disabled)] italic">None</span>}
                                        </td>
                                        <td className="p-4 text-[var(--text-secondary)] capitalize">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs ${course.type === 'intensive' ? 'bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] border-[var(--accent-indigo)]/20 shadow-[var(--accent-indigo)]/5' : 'bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border-[var(--accent-emerald)]/20 shadow-[var(--accent-emerald)]/5'}`}>
                                                {course.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(course)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${course.is_published
                                                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20'
                                                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-main)] hover:text-[var(--text-main)] hover:border-[var(--text-main)]'
                                                    }`}
                                            >
                                                {course.is_published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {course.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(course)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(course)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CourseFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingCourse}
                isSubmitting={createCourse.isPending || updateCourse.isPending}
            />

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Delete Course?</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-6 font-medium">
                            Are you sure you want to delete <span className="text-[var(--text-main)] font-bold">{courseToDelete?.title}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2"
                                disabled={deleteCourse.isPending}
                            >
                                {deleteCourse.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
