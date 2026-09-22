'use client';

import React, { useState } from 'react';
import { useLMS } from '@/context/LMSContext';
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  Bell,
  Award,
  Globe,
  Sliders,
  Mail,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useLMS();

  const [portalName, setPortalName] = useState(settings.portalName);
  const [organizationName, setOrganizationName] = useState(settings.organizationName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [passGradePercentage, setPassGradePercentage] = useState(settings.passGradePercentage);
  const [allowSelfRegistration, setAllowSelfRegistration] = useState(settings.allowSelfRegistration);
  const [enableCertificates, setEnableCertificates] = useState(settings.enableCertificates);
  const [notifyOnSubmissions, setNotifyOnSubmissions] = useState(settings.notifyOnSubmissions);
  const [notifyOnEnrollment, setNotifyOnEnrollment] = useState(settings.notifyOnEnrollment);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      portalName,
      organizationName,
      supportEmail,
      passGradePercentage: Number(passGradePercentage),
      allowSelfRegistration,
      enableCertificates,
      notifyOnSubmissions,
      notifyOnEnrollment,
      maintenanceMode,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure institutional identity, student registration policies, grading thresholds, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institutional Branding */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">Academy Identity & Branding</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Display Name</label>
              <input
                type="text"
                required
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Academy</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">System Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Academic Rules */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">Academic & Certification Policies</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Passing Grade Percentage (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={passGradePercentage}
                  onChange={(e) => setPassGradePercentage(Number(e.target.value))}
                  className="w-28 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-sky-500"
                />
                <span className="text-xs text-slate-500">
                  Learners scoring above this mark are eligible for completion certificates.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 border border-sky-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Issue Automated Completion Certificates</span>
                  <span className="text-[11px] text-slate-500">
                    Generate digitally signed Lumokido certificates when all course modules are finished.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableCertificates}
                  onChange={(e) => setEnableCertificates(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 border border-sky-100 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Open Learner Self-Registration</span>
                  <span className="text-[11px] text-slate-500">
                    Allow new students to sign up without prior invitation by administration.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={allowSelfRegistration}
                  onChange={(e) => setAllowSelfRegistration(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Notifications & Maintenance */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">Notifications & Availability</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Notify Faculty on Assignment Submissions</span>
                <span className="text-[11px] text-slate-500">
                  Send real-time alerts to the course instructor when a project task is uploaded.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnSubmissions}
                onChange={(e) => setNotifyOnSubmissions(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Enrollment Welcome Emails</span>
                <span className="text-[11px] text-slate-500">
                  Dispatch onboarding curriculum guides when a student registers for a course.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnEnrollment}
                onChange={(e) => setNotifyOnEnrollment(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-rose-800 block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-rose-600">
                  Temporarily lock student logins for scheduled database migration or maintenance.
                </span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
