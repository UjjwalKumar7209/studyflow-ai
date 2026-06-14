'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Activity } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      await register(name, email, password)
      showToast('Account created successfully!', 'success')
    } catch (err: any) {
      const msg = err.response?.data?.msg || 'Failed to create account. Please try again.'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6 sm:p-8">
      {/* Brand logo link */}
      <Link href="/" className="flex items-center gap-2.5 mb-10 group shrink-0">
        <div className="p-1.5 bg-primary text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <Activity className="h-5 w-5" />
        </div>
        <span className="font-black text-xl uppercase tracking-wider text-slate-900">
          StudyFlow<span className="text-primary font-black">.AI</span>
        </span>
      </Link>

      <Card className="max-w-md w-full p-8 sm:p-10 shadow-[8px_8px_0px_0px_#0F172A] bg-white border-2 border-slate-900 rounded-none">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-1.5">
            Join now and study smarter with AI
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-slate-900 bg-rose-50 text-danger font-bold text-xs uppercase tracking-wide leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-black"
            >
              Log In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}