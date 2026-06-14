'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  TrendingDown,
  BookOpen,
  Settings,
  LogOut,
  Activity,
  ChevronRight
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Weak Topics', href: '/weak-topics', icon: TrendingDown },
    { name: 'Revision Notes', href: '/revisions', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-white border-r-2 border-slate-900 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Header / Brand */}
      <div className="h-16 flex items-center px-6 border-b-2 border-slate-900 bg-white">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-primary text-white border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="font-black text-lg uppercase tracking-wider text-slate-900">
            StudyFlow<span className="text-primary font-black">.AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-3 mb-2">
          Study Portal
        </div>
        
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 font-bold uppercase tracking-wider text-xs transition-all ${
                active
                  ? 'bg-slate-900 text-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#2563EB] translate-x-[-1px] translate-y-[-1px]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-2 border-transparent'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-primary' : 'text-slate-500'}`} />
                {item.name}
              </span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t-2 border-slate-900 bg-slate-50">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-white font-black uppercase text-sm shadow-[1.5px_1.5px_0px_0px_#2563EB]">
              {user?.name?.substring(0, 2) ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate uppercase tracking-wide">
                {user?.name ?? 'User'}
              </p>
              <p className="text-[10px] font-bold text-slate-500 truncate">
                {user?.email ?? 'user@studyflow.ai'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 py-2 px-3 border-2 border-slate-900 font-black uppercase tracking-wider text-[9px] bg-white text-slate-900 hover:bg-rose-50 hover:text-danger active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            <LogOut className="h-3 w-3" />
            End Session
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
