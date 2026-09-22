'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { AssignmentSubmission } from '@/types/lms';
import { Badge } from '@/components/ui/Badge';
import { GradeModal } from '@/components/ui/GradeModal';
import {
  CheckSquare,
  Search,
  FileText,
  Clock,
  Award,
  Filter,
} from 'lucide-react';

export default function AssignmentsPage() {
  const { assignments, globalSearch } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentSubmission | null>(null);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);

  const effectiveSearch = searchQuery || globalSearch;
  const filteredAssignments = assignments.filter((asg) => {
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'pending' && asg.status === 'pending') ||
      (selectedTab === 'graded' && asg.status === 'graded') ||
      (selectedTab === 'late' && asg.status === 'late');

    const matchesSearch =
      effectiveSearch === '' ||
      asg.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      asg.studentName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      asg.courseTitle.toLowerCase().includes(effectiveSearch.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const gradedCount = assignments.filter((a) => a.status === 'graded').length;
  const lateCount = assignments.filter((a) => a.status === 'late').length;

  const handleOpenGrade = (asg: AssignmentSubmission) => {
    setSelectedAssignment(asg);
    setGradeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignment Grading</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review student project submissions, evaluate milestone tasks, and publish instructor feedback.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedTab === 'all'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            All Submissions ({assignments.length})
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedTab === 'pending'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setSelectedTab('graded')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedTab === 'graded'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            Graded ({gradedCount})
          </button>
          <button
            onClick={() => setSelectedTab('late')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedTab === 'late'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
            }`}
          >
            Late Submissions ({lateCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or task..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-sky-50/50">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Assignment Task</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4 text-right">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No submissions found under this filter.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={asg.studentAvatar}
                          alt={asg.studentName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <span className="font-bold text-slate-900">{asg.studentName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-[240px]">
                          {asg.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{asg.courseTitle}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {asg.submittedAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          asg.status === 'graded'
                            ? 'success'
                            : asg.status === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                        dot
                      >
                        {asg.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {asg.score !== null ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {asg.score} / {asg.maxScore}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Ungraded</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenGrade(asg)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          asg.status === 'graded'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-sky-500 text-white hover:bg-sky-600 shadow-xs'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{asg.status === 'graded' ? 'Edit Grade' : 'Grade Now'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Modal */}
      <GradeModal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        assignment={selectedAssignment}
      />
    </div>
  );
}
