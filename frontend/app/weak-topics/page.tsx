'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { analyticsService } from '@/services/analytics.service'
import type { WeakTopic } from '@/types'
import {
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Activity,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function WeakTopicsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([])

  const loadWeakTopics = async () => {
    try {
      const data = await analyticsService.getWeakTopics()
      const sorted = data.slice().sort((a, b) => b.weaknessScore - a.weaknessScore)
      setWeakTopics(sorted)
    } catch {
      showToast('Failed to fetch weak topics list', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeakTopics()
  }, [])

  const handleReanalyze = async () => {
    setAnalyzing(true)
    showToast('Re-evaluating quiz scores and compiling weak topics...', 'info')
    try {
      const updated = await analyticsService.analyzeWeakTopics()
      const sorted = updated.slice().sort((a, b) => b.weaknessScore - a.weaknessScore)
      setWeakTopics(sorted)
      showToast('Weak topics analysis updated successfully!', 'success')
    } catch {
      showToast('Analysis refresh failed', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const getPriorityInfo = (avgScore: number) => {
    if (avgScore < 45) {
      return {
        label: 'High Priority',
        badge: 'danger' as const,
        cardBorder: 'border-danger shadow-premium-danger',
        action: 'Immediate Review Needed: Generate notes for this topic, copy terms, and discuss with the PDF chatbot.'
      }
    } else if (avgScore < 70) {
      return {
        label: 'Medium Priority',
        badge: 'warning' as const,
        cardBorder: 'border-warning shadow-[4px_4px_0px_0px_var(--color-warning)]',
        action: 'Recall Practice: Practice with flashcards daily and review summaries before retaking quizzes.'
      }
    } else {
      return {
        label: 'Low Priority',
        badge: 'primary' as const,
        cardBorder: 'border-primary shadow-premium-primary',
        action: 'Reinforcement: Retake quiz once to push scores past 85%.'
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
              Weak Topics Diagnostics
            </h1>
            <p className="text-xs text-slate-550 font-black uppercase tracking-wider mt-1.5">
              Identified academic focus areas and gaps tracked from quiz results
            </p>
          </div>
          <Button
            onClick={handleReanalyze}
            variant="primary"
            className="shadow-[3px_3px_0px_0px_#0F172A] flex items-center gap-2"
            isLoading={analyzing}
          >
            <RefreshCw className="h-4 w-4" /> Re-Analyze Scores
          </Button>
        </div>

        {/* Content Panel */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-44 w-full" />
            ))}
          </div>
        ) : weakTopics.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A]">
            <CheckCircle className="h-10 w-10 text-success mx-auto mb-3" />
            <h3 className="text-sm font-black uppercase text-slate-800">All topics are mastered!</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
              No learning gaps detected. Complete more quizzes and click Re-Analyze to trigger diagnostics.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {weakTopics.map((item) => {
              const priority = getPriorityInfo(item.averageScore)

              return (
                <Card
                  key={item.id}
                  className={`p-6 md:p-8 bg-white border-2 ${priority.cardBorder} flex flex-col justify-between space-y-5`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge variant={priority.badge}>{priority.label}</Badge>
                      <h3 className="text-base font-black uppercase text-slate-900 mt-3.5">
                        Topic ID: #{item.topicId}
                      </h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        Flag Date: {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Average score</p>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">{item.averageScore}%</p>
                    </div>
                  </div>

                  {/* Recommendation block */}
                  <div className="p-4 border-2 border-slate-900 bg-slate-50 text-xs font-semibold text-slate-700 leading-relaxed space-y-1">
                    <span className="font-black text-slate-900 uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-slate-600" /> Improvement Recommendation:
                    </span>
                    <p>{priority.action}</p>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-2 border-t border-slate-100">
                    <Link href={`/notes/${item.topicId}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] justify-center bg-white"
                      >
                        <BookOpen className="h-4 w-4 mr-1.5 text-emerald-600 shrink-0" /> Review Notes
                      </Button>
                    </Link>
                    <Link href={`/quiz/${item.topicId}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] justify-center bg-white"
                      >
                        <HelpCircle className="h-4 w-4 mr-1.5 text-rose-600 shrink-0" /> Retake Test <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
