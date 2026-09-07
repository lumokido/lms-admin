'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { Course } from '@/types/lms';
import { CourseModal } from '@/components/ui/CourseModal';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  CheckCircle,
  FileEdit,
  Star,
} from 'lucide-react';

export default function CoursesPage() {
  const { courses, deleteCourse, toggleCourseStatus, globalSearch } = useLMS();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const categories = ['All', 'Development', 'Data & AI', 'Design', 'Business', 'Marketing'];

  const effectiveSearch = searchQuery || globalSearch;
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesSearch =
      effectiveSearch === '' ||
      c.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setCourseModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Course Curriculum</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage course syllabi, module breakdowns, pricing, and publication statuses.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right side: Search, Status, View mode */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter courses..."
              className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs outline-none focus:bg-white focus:border-sky-500"
          >
            <option value="All">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredCourses.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl bg-white border border-slate-200 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, status filters, or create a brand new curriculum.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50"
            >
              {/* Thumbnail Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge
                    variant={
                      course.status === 'published'
                        ? 'success'
                        : course.status === 'draft'
                        ? 'warning'
                        : 'neutral'
                    }
                    dot
                  >
                    {course.status.toUpperCase()}
                  </Badge>
                  <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-slate-800 border border-slate-200">
                    {course.code}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-xs font-extrabold text-sky-900 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-sky-100">
                  {course.price > 0 ? `$${course.price}` : 'Free'}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-sky-600 font-semibold">{course.category}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{course.rating > 0 ? course.rating.toFixed(1) : 'New'}</span>
                  </div>
                </div>

                {/* Instructor & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructorName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">
                      {course.instructorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleCourseStatus(course.id)}
                      title={course.status === 'published' ? 'Move to Draft' : 'Publish Course'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {course.status === 'published' ? (
                        <FileEdit className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      title="Edit Course"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      title="Delete Course"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-sky-50/50">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{course.title}</p>
                          <span className="text-[11px] text-slate-400 font-mono">{course.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info">{course.category}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{course.instructorName}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          course.status === 'published'
                            ? 'success'
                            : course.status === 'draft'
                            ? 'warning'
                            : 'neutral'
                        }
                        dot
                      >
                        {course.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">
                      {course.enrolledStudents.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {course.price > 0 ? `$${course.price}` : 'Free'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        editingCourse={editingCourse}
      />
    </div>
  );
}
