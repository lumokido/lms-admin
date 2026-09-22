'use client';

import React from 'react';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { Briefcase } from 'lucide-react';

export default function JobsComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Campus Placement & Job Board"
      badge="Under Construction"
      description="Connect certified graduates with top hiring tech partners, enterprise apprenticeships, and curated career opportunities."
      icon={Briefcase}
      targetQuarter="Q3 2026"
      plannedFeatures={[
        'Verified corporate employer recruiting dashboard',
        'One-click student resume submission & skill matching',
        'Automated interview scheduling and candidate shortlisting',
        'Placement statistics, offer letters, and CTC compensation reports',
        'Direct hiring partner messaging & virtual job fairs',
        'Alumni mentorship network and referral channels',
      ]}
    />
  );
}
