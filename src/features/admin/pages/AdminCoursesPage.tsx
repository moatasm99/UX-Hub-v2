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
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Courses Manager</h1>
                    <p className="text-slate-400 mt-1">Manage intensive courses and roadmap tracks</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add Course
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800">
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Course</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No courses found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="group hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{course.title}</p>
                                                    <p className="text-xs text-slate-500 font-mono truncate max-w-[150px]">{course.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            {course.category || <span className="text-slate-600 italic">None</span>}
                                        </td>
                                        <td className="p-4 text-slate-300 capitalize">
                                            <span className={`px-2 py-1 rounded-xs text-xs font-medium ${course.type === 'intensive' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                {course.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleTogglePublish(course)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${course.is_published
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
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
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(course)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Course?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">{courseToDelete?.title}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
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
