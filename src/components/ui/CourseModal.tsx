'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Course, CourseModule, CourseStatus } from '@/types/lms';
import { useLMS } from '@/context/LMSContext';
import { Plus, Trash2 } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCourse?: Course | null;
}

export function CourseModal({ isOpen, onClose, editingCourse }: CourseModalProps) {
  const { instructors, addCourse, updateCourse } = useLMS();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Course['category']>('Development');
  const [level, setLevel] = useState<Course['level']>('Beginner');
  const [instructorId, setInstructorId] = useState('');
  const [price, setPrice] = useState<number>(99);
  const [duration, setDuration] = useState('20h');
  const [status, setStatus] = useState<CourseStatus>('published');
  const [modules, setModules] = useState<CourseModule[]>([
    { id: 'm1', title: 'Course Orientation & Setup', lessonsCount: 4, duration: '2h 30m' },
  ]);

  useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title);
      setCode(editingCourse.code);
      setDescription(editingCourse.description);
      setCategory(editingCourse.category);
      setLevel(editingCourse.level);
      setInstructorId(editingCourse.instructorId);
      setPrice(editingCourse.price);
      setDuration(editingCourse.duration);
      setStatus(editingCourse.status);
      setModules(editingCourse.modules || []);
    } else {
      setTitle('');
      setCode('CS-' + Math.floor(100 + Math.random() * 900));
      setDescription('');
      setCategory('Development');
      setLevel('Beginner');
      setInstructorId(instructors[0]?.id || '');
      setPrice(99);
      setDuration('24h');
      setStatus('published');
      setModules([{ id: 'm1', title: 'Introduction & Foundations', lessonsCount: 4, duration: '3h 00m' }]);
    }
  }, [editingCourse, isOpen, instructors]);

  const handleAddModule = () => {
    const newMod: CourseModule = {
      id: `m-${Date.now()}`,
      title: `Module ${modules.length + 1}: Key Concepts`,
      lessonsCount: 5,
      duration: '4h 00m',
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleModuleTitleChange = (id: string, newTitle: string) => {
    setModules(modules.map((m) => (m.id === id ? { ...m, title: newTitle } : m)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const instructor = instructors.find((i) => i.id === instructorId) || instructors[0];

    const coursePayload = {
      title,
      code,
      description,
      category,
      level,
      instructorId: instructor?.id || 'inst-1',
      instructorName: instructor?.name || 'Dr. Sarah Jenkins',
      instructorAvatar: instructor?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      price: Number(price),
      duration,
      status,
      modules,
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, coursePayload);
    } else {
      addCourse(coursePayload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCourse ? 'Edit Course' : 'Create New Course'}
      description="Define the curriculum metadata, instructor, and learning modules."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced TypeScript & Clean Architecture"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CS-301"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of course outcomes and target learners..."
            className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Course['category'])}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              <option value="Development">Development</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Course['level'])}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Publish Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CourseStatus)}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor</label>
            <select
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
            >
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.specialty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Price (USD $)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30h 15m"
              className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
            />
          </div>
        </div>

        {/* Modules Section */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Curriculum Modules ({modules.length})</span>
            <button
              type="button"
              onClick={handleAddModule}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Module
            </button>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-sky-50/60 border border-sky-100 text-xs"
              >
                <span className="text-sky-700 font-mono font-semibold w-5 shrink-0">#{idx + 1}</span>
                <input
                  type="text"
                  value={mod.title}
                  onChange={(e) => handleModuleTitleChange(mod.id, e.target.value)}
                  className="flex-1 bg-transparent border-none text-slate-800 focus:outline-none font-medium"
                />
                <span className="text-slate-500 shrink-0">{mod.lessonsCount} lessons</span>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(mod.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            {editingCourse ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
