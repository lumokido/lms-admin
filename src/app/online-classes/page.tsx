'use client';

import React from 'react';
import { ComingSoon } from '@/components/ui/ComingSoon';
import { Video } from 'lucide-react';

export default function OnlineClassesComingSoonPage() {
  return (
    <ComingSoon
      moduleName="Live Online Classes & Webinars"
      badge="Under Construction"
      description="Interactive virtual classrooms featuring HD live video, screen sharing, interactive whiteboards, breakout rooms, and automatic session cloud recordings."
      icon={Video}
      targetQuarter="Q2 2026"
      plannedFeatures={[
        'One-click Zoom, Google Meet & WebRTC integrations',
        'In-class polling, live Q&A, and hand-raising mechanics',
        'Automatic cloud lecture recording and transcriber',
        'Virtual attendance syncing upon joining meeting',
        'Multi-speaker video spotlight and screen annotation',
        'Class schedule timetable with calendar reminder invites',
      ]}
    />
  );
}
