'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { AssignmentSubmission } from '@/types/lms';
import { useLMS } from '@/context/LMSContext';
import { FileText, CheckCircle2 } from 'lucide-react';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentSubmission | null;
}

export function GradeModal({ isOpen, onClose, assignment }: GradeModalProps) {
  const { gradeAssignment } = useLMS();
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (assignment) {
      setScore(assignment.score ?? 85);
      setFeedback(assignment.feedback ?? '');
    }
  }, [assignment]);

  if (!assignment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gradeAssignment(assignment.id, Number(score), feedback);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Grade Submission"
      description={`Review work for ${assignment.studentName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Assignment Brief */}
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <FileText className="w-4 h-4 text-sky-600" />
            <span className="line-clamp-1">{assignment.title}</span>
          </div>
          <div className="text-slate-600">
            Course: <span className="font-semibold text-slate-800">{assignment.courseTitle}</span>
          </div>
          {assignment.attachmentName && (
            <div className="text-sky-700 font-mono text-[11px] pt-1">
              File: {assignment.attachmentName}
            </div>
          )}
        </div>

        {/* Score input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Score (out of {assignment.maxScore})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={assignment.maxScore}
              required
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-28 glass-input px-3 py-2 rounded-lg text-base font-bold text-center border-slate-300"
            />
            <span className="text-sm font-semibold text-slate-500">/ {assignment.maxScore} pts</span>
          </div>
        </div>

        {/* Feedback input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor Feedback</label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide constructive feedback, suggestions, and assessment remarks..."
            className="w-full glass-input px-3 py-2 rounded-lg text-xs border-slate-300"
          />
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
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Submit Grade
          </button>
        </div>
      </form>
    </Modal>
  );
}
