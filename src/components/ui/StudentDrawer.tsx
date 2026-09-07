'use client';

import React from 'react';
import { Student, StudentStatus } from '@/types/lms';
import { useLMS } from '@/context/LMSContext';
import { X, Mail, Phone, Calendar, Clock, BookOpen } from 'lucide-react';
import { Badge } from './Badge';

interface StudentDrawerProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentDrawer({ student, onClose }: StudentDrawerProps) {
  const { updateStudentStatus } = useLMS();

  if (!student) return null;

  const handleStatusChange = (newStatus: StudentStatus) => {
    updateStudentStatus(student.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-sky-50/50 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Student Profile</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Student Intro */}
            <div className="flex items-center gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-300"
              />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{student.name}</h3>
                <div className="flex items-center gap-2 mt-1">
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
                  <span className="text-xs text-slate-500 font-medium">ID: {student.id}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-center">
                <span className="text-xs text-sky-700 font-semibold block">Avg Progress</span>
                <span className="text-2xl font-extrabold text-sky-900">{student.averageProgress}%</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-xs text-emerald-700 font-semibold block">Completed</span>
                <span className="text-2xl font-extrabold text-emerald-900">
                  {student.completedCoursesCount} Course{student.completedCoursesCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-600" />
                <span className="font-medium">{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span className="font-medium">{student.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Enrolled on {student.joinDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Last active {student.lastActive}</span>
              </div>
            </div>

            {/* Status Switcher */}
            <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">Change Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(['active', 'inactive', 'suspended'] as StudentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-1.5 text-xs font-bold rounded-lg capitalize border transition-all cursor-pointer ${
                      student.status === st
                        ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-sky-700 hover:border-sky-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enrolled Courses ({student.enrolledCourses.length})
                </h4>
              </div>

              {student.enrolledCourses.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No active course enrollments yet.</p>
              ) : (
                <div className="space-y-3">
                  {student.enrolledCourses.map((c) => (
                    <div
                      key={c.courseId}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{c.courseTitle}</h5>
                        </div>
                        {c.grade && (
                          <span className="text-xs font-bold text-amber-700 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                            Grade: {c.grade}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Progress</span>
                          <span className="font-bold text-slate-800">{c.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="capitalize">{c.status.replace('_', ' ')}</span>
                        <span>Joined: {c.enrolledDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
