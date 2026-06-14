'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import {
  User as UserIcon,
  LogOut,
  Bell,
  Sliders,
  Shield
} from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()

  const [studyReminder, setStudyReminder] = useState(true)
  const [sessionLimit, setSessionLimit] = useState('45')
  const [saving, setSaving] = useState(false)

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast('Settings saved successfully!', 'success')
    }, 800)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
              Workspace Settings
            </h1>
            <p className="text-sm text-slate-550 font-black uppercase tracking-wider mt-1.5">
              Manage profiles, study reminders, and active sessions
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Preferences Navigation */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest px-1">
              Settings Tabs
            </h2>

            <Card className="p-2 space-y-1 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs border-2 border-slate-900">
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-900 text-white font-black uppercase tracking-wide">
                <UserIcon className="h-4 w-4 text-primary" /> Profile details
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 text-slate-650 font-black uppercase tracking-wide opacity-50 cursor-not-allowed">
                <Bell className="h-4 w-4" /> Study Alerts
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2.5 text-slate-650 font-black uppercase tracking-wide opacity-50 cursor-not-allowed">
                <Shield className="h-4 w-4" /> Security panel
              </div>
            </Card>
          </div>

          {/* Forms Panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile detail cards */}
            <Card className="p-6 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-6">
              <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center gap-2.5 border-b pb-3 border-slate-100">
                <UserIcon className="h-5 w-5 text-primary" /> Personal Profile
              </h2>

              <div className="space-y-4">
                <Input
                  label="Display Name"
                  value={user?.name ?? 'User'}
                  disabled
                  className="bg-slate-50 cursor-not-allowed font-bold text-slate-700 border-2"
                />

                <Input
                  label="Email Address"
                  value={user?.email ?? 'user@studyflow.ai'}
                  disabled
                  className="bg-slate-50 cursor-not-allowed font-bold text-slate-700 border-2"
                />

                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  * Name and email modifications are managed by admin portal.
                </p>
              </div>
            </Card>

            {/* Study preferences cards */}
            <Card className="p-6 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider flex items-center gap-2.5 border-b pb-3 border-slate-100">
                  <Sliders className="h-5 w-5 text-indigo-655" /> Learning Parameters
                </h2>

                <div className="space-y-5 text-xs font-semibold">
                  <div className="flex items-center justify-between p-4 border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <div>
                      <p className="font-black text-slate-900 uppercase text-xs">Daily Reminders</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Alert me when scores require re-testing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={studyReminder}
                      onChange={(e) => setStudyReminder(e.target.checked)}
                      className="h-5.5 w-5.5 border-2 border-slate-900 text-primary focus:ring-0 cursor-pointer shadow-[1px_1px_0px_0px_#0F172A]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-750">
                      Study Interval length
                    </label>
                    <select
                      value={sessionLimit}
                      onChange={(e) => setSessionLimit(e.target.value)}
                      className="w-full brutalist-input select-none font-bold text-xs uppercase tracking-wide cursor-pointer focus:ring-0 focus:border-primary border-2 border-slate-300 py-3 px-4 bg-white"
                    >
                      <option value="25">25 minutes (Pomodoro)</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full md:w-auto shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] py-3 text-xs"
                    isLoading={saving}
                  >
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Card>

            {/* Session logout card */}
            <Card className="p-6 bg-white border-2 border-danger shadow-[4px_4px_0px_0px_rgba(220,38,38,0.25)] space-y-4">
              <h2 className="text-sm font-black uppercase text-danger tracking-wider">
                Session Control
              </h2>
              <p className="text-xs font-bold text-slate-500 leading-normal">
                Exit your secure workspace and log out of the current active session.
              </p>
              <Button
                onClick={logout}
                className="premium-button-danger border-2 border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-2"
              >
                <LogOut className="h-4.5 w-4.5" /> Log Out
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
