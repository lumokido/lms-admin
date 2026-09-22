'use client';

import React from 'react';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { FileQuestion } from 'lucide-react';

export default function ExaminationsComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Examinations & Online Proctoring"
      badge="Under Construction"
      description="Secure online assessment environment with automated question banks, AI proctoring, timed quiz attempts, and instant report cards."
      icon={FileQuestion}
      targetQuarter="Q3 2026"
      plannedFeatures={[
        'Timed MCQs, coding challenges, and essay question formats',
        'AI proctoring with tab-switch detection & webcam monitoring',
        'Randomized question sets and automated answer key grading',
        'Gradebook curves and percentile rank calculations',
        'Hall ticket generation and examination timetable publisher',
        'Digitally verifiable certificate issuance upon passing',
      ]}
    />
  );
}
