'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, Activity } from 'lucide-react'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F5F7FA] flex-col gap-6 p-4">
        <div className="p-4 bg-primary text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-bounce">
          <Activity className="h-8 w-8" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="font-black uppercase tracking-widest text-slate-900 text-xs animate-pulse">
            Authenticating Session...
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Preparing StudyFlow Workspace
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirection handled by AuthProvider
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white h-full z-10 border-r-2 border-slate-900">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 border-2 border-slate-900 bg-white shadow-[1px_1px_0px_0px_#0F172A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b-2 border-slate-900 px-6 flex items-center justify-between shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="p-1 bg-primary text-white border-2 border-slate-900">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-black text-sm uppercase tracking-wider text-slate-900">
              StudyFlow
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-10 px-6 sm:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
