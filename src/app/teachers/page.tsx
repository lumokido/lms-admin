'use client';

import React from 'react';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { GraduationCap } from 'lucide-react';

export default function TeachersComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Teacher Faculty Management"
      badge="Under Construction"
      description="A centralized portal for managing educator assignments, teaching schedules, faculty payouts, student evaluation feedback, and tenure credentials."
      icon={GraduationCap}
      targetQuarter="Q2 2026"
      plannedFeatures={[
        'Full faculty directory and workload distribution',
        'Automatic salary and hourly payout calculations',
        'Direct instructor-to-student messaging channels',
        'Subject matter expertise tags & credentials verification',
        'Teaching performance analytics & student satisfaction ratings',
        'Substitute teacher allocation and leave approval workflows',
      ]}
    />
  );
}
