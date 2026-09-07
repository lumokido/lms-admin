'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLMS } from '@/context/LMSContext';
import { StudentStatus } from '@/types/lms';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentModal({ isOpen, onClose }: StudentModalProps) {
  const { addStudent } = useLMS();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<StudentStatus>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const randomAvatar = `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`;

    addStudent({
      name,
      email,
      phone: phone || undefined,
      avatar: randomAvatar,
      status,
    });

    setName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Student"
      description="Add a new learner to the academy roster."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Venkatesh"
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
            placeholder="e.g. priya.v@example.com"
            className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98765 00000"
            className="w-full glass-input px-3 py-2 rounded-lg text-sm border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StudentStatus)}
            className="w-full glass-input px-3 py-2 rounded-lg text-sm bg-white border-slate-300"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

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
            Enroll Student
          </button>
        </div>
      </form>
    </Modal>
  );
}
