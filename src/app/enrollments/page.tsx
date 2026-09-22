'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { Badge } from '@/components/ui/Badge';
import {
  ClipboardList,
  Search,
  Download,
  BookOpen,
  Filter,
} from 'lucide-react';

export default function EnrollmentsPage() {
  const { enrollments, globalSearch, showToast } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const effectiveSearch = searchQuery || globalSearch;
  const filteredEnrollments = enrollments.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch =
      effectiveSearch === '' ||
      e.studentName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      e.studentEmail.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Enrollment ID,Student Name,Email,Course,Category,Date,Progress,Status\n'];
    const rows = filteredEnrollments.map(
      (e) =>
        `"${e.id}","${e.studentName}","${e.studentEmail}","${e.courseTitle}","${e.category}","${e.enrolledDate}",${e.progress}%,"${e.status}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enrollments_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Export Generated',
      message: `${filteredEnrollments.length} enrollment records exported as CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enrollment Logs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time enrollment stream, course access milestones, and completion telemetry.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or course..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Filter by:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs outline-none focus:bg-white focus:border-sky-500"
          >
            <option value="All">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-sky-50/50">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course Enrolled</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Enrolled Date</th>
                <th className="py-3.5 px-4">Curriculum Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Last Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No enrollment transactions match your filter.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={enr.studentAvatar}
                          alt={enr.studentName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{enr.studentName}</p>
                          <span className="text-[11px] text-slate-500">{enr.studentEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
                          {enr.courseTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="info">{enr.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {enr.enrolledDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Progress</span>
                          <span className="font-bold text-slate-800">{enr.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              enr.progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${enr.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          enr.status === 'completed'
                            ? 'success'
                            : enr.status === 'in_progress'
                            ? 'info'
                            : 'danger'
                        }
                        dot
                      >
                        {enr.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                      {enr.lastAccessed}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
