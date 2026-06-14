'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowRight, Activity } from 'lucide-react'

export function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="bg-white border-b-2 border-slate-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 bg-primary text-white border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-black text-xl uppercase tracking-wider text-slate-900">
              StudyFlow<span className="text-primary font-black">.AI</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="premium-button premium-button-primary text-xs flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-black text-xs text-slate-900 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="premium-button premium-button-primary text-xs"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
