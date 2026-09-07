'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { Student } from '@/types/lms';
import { StudentModal } from '@/components/ui/StudentModal';
import { StudentDrawer } from '@/components/ui/StudentDrawer';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Trash2,
  BookOpen,
  Filter,
} from 'lucide-react';

export default function StudentsPage() {
  const { students, deleteStudent, globalSearch } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [inspectingStudent, setInspectingStudent] = useState<Student | null>(null);

  const effectiveSearch = searchQuery || globalSearch;
  const filteredStudents = students.filter((s) => {
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesSearch =
      effectiveSearch === '' ||
      s.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students Roster</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track student enrollments, academic progress, grades, and lifecycle status.
          </p>
        </div>
        <button
          onClick={() => setStudentModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs outline-none focus:bg-white focus:border-sky-500"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-sky-50/50">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Courses Enrolled</th>
                <th className="py-3.5 px-4">Average Progress</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No students match the current criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <span className="text-[11px] text-slate-500">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          student.status === 'active'
                            ? 'success'
                            : student.status === 'suspended'
                            ? 'danger'
                            : 'neutral'
                        }
                        dot
                      >
                        {student.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                        <span>{student.enrolledCourses.length}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span className="font-bold text-slate-800">{student.averageProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.averageProgress >= 80
                                ? 'bg-emerald-500'
                                : student.averageProgress >= 40
                                ? 'bg-sky-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${student.averageProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {student.joinDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {student.lastActive}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setInspectingStudent(student)}
                          title="View Student Profile"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          title="Remove Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* Modals & Drawers */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />
      <StudentDrawer
        student={inspectingStudent}
        onClose={() => setInspectingStudent(null)}
      />
    </div>
  );
}
