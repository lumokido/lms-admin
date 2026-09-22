'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  Plus,
  Mail,
  BookOpen,
  Users,
  Star,
  Search,
} from 'lucide-react';

export default function InstructorsPage() {
  const { instructors, addInstructor, globalSearch } = useLMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New instructor form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');

  const effectiveSearch = searchQuery || globalSearch;
  const filteredInstructors = instructors.filter((inst) => {
    return (
      effectiveSearch === '' ||
      inst.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      inst.specialty.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      inst.email.toLowerCase().includes(effectiveSearch.toLowerCase())
    );
  });

  const handleAddInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const randomAvatar = `https://images.unsplash.com/photo-${1507003211169 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`;

    addInstructor({
      name,
      email,
      specialty: specialty || 'Curriculum Specialist',
      bio: bio || 'Faculty member at Lumokido Academy.',
      avatar: randomAvatar,
      status: 'active',
    });

    setName('');
    setEmail('');
    setSpecialty('');
    setBio('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty & Instructors</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage instructors, course assignments, learner evaluations, and teaching credentials.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instructor</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name or domain..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredInstructors.length}</span> educators
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((inst) => (
          <div
            key={inst.id}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-5 bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100/50"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={inst.avatar}
                    alt={inst.name}
                    className="w-12 h-12 rounded-xl object-cover border border-sky-300"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{inst.name}</h3>
                    <p className="text-xs text-sky-600 font-semibold">{inst.specialty}</p>
                  </div>
                </div>

                <Badge variant={inst.status === 'active' ? 'success' : 'neutral'} dot>
                  {inst.status === 'active' ? 'ACTIVE' : 'ON LEAVE'}
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed">
                {inst.bio}
              </p>
            </div>

            {/* Teaching Stats */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mb-0.5 font-medium">
                  <BookOpen className="w-3 h-3 text-sky-600" />
                  <span>Courses</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{inst.coursesCount}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mb-0.5 font-medium">
                  <Users className="w-3 h-3 text-sky-600" />
                  <span>Students</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{inst.totalStudents.toLocaleString()}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mb-0.5 font-medium">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span>Rating</span>
                </div>
                <span className="text-sm font-bold text-amber-600">{inst.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Email Contact */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span className="truncate">{inst.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Instructor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Faculty Member"
        description="Add a new teacher or instructor to the LMS platform."
        maxWidth="md"
      >
        <form onSubmit={handleAddInstructor} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jane Smith"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane.smith@lumokido.in"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Domain Specialty</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Distributed Systems & Rust"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Biography</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief professional background, past roles, or certifications..."
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              Add Faculty Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
