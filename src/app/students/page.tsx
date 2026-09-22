'use client';

import React, { useEffect, useState } from 'react';
import { api, AdminStudent } from '@/lib/api';
import { useLMS } from '@/context/LMSContext';
import { Users, Search } from 'lucide-react';

export default function StudentsPage() {
  const { showToast, globalSearch } = useLMS();
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.overview
      .get()
      .then((data) => setStudents(data.studentList))
      .catch((err: Error) => {
        showToast({
          type: 'error',
          title: 'Students unavailable',
          message: err.message || 'Could not load student accounts.',
        });
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const query = (searchQuery || globalSearch).toLowerCase();
  const filtered = students.filter(
    (student) =>
      query === '' ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <p className="text-sm text-slate-500 mt-1">
          {loading
            ? 'Loading registered students…'
            : `${students.length} registered students. Spent counts paid orders only. Refunded orders stay in the list.`}
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search name or email"
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-sm outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">Loading students…</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2" />
            No students match that search.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Paid books</th>
                <th className="py-3 px-4 font-semibold">Spent</th>
                <th className="py-3 px-4 font-semibold">What they bought</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                  <tr key={student.id} className="border-t border-slate-100 align-top">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </td>
                    <td className="py-4 px-4 font-semibold">{student.purchaseCount}</td>
                    <td className="py-4 px-4 font-semibold">₹{student.spent.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-slate-600">
                      {student.books.length === 0
                        ? 'No orders'
                        : student.books
                            .map(
                              (book) =>
                                `${book.title} · ₹${book.amount.toLocaleString('en-IN')} · ${book.paymentStatus} · ${book.accessStatus}`,
                            )
                            .join(' · ')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
