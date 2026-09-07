'use client';

import React from 'react';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { UserCheck } from 'lucide-react';

export default function AttendanceComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Attendance & Participation Tracking"
      badge="Under Construction"
      description="Automated digital roll-call and biometric attendance tracking across batch lectures, laboratory sessions, and live online webinars."
      icon={UserCheck}
      targetQuarter="Q2 2026"
      plannedFeatures={[
        'Daily & weekly batch attendance registers',
        'Automatic absence alerts dispatched via SMS & Email to guardians',
        'Attendance percentage thresholds for examination eligibility',
        'QR-code and geolocation-based classroom check-ins',
        'Leave application submissions and teacher approval portal',
        'Exportable monthly attendance compliance audit sheets',
      ]}
    />
  );
}
