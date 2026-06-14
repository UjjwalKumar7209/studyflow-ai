'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { analyticsService } from '@/services/analytics.service'
import { quizService } from '@/services/quiz.service'
import type { AnalyticsOverview, QuizAttempt } from '@/types'
import {
  BarChart3,
  Award,
  HelpCircle,
  TrendingUp,
  History,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react'

export default function AnalyticsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [overviewData, attemptsData] = await Promise.all([
          analyticsService.getOverview(),
          quizService.getAttempts()
        ])
        setOverview(overviewData)
        setAttempts(attemptsData)
      } catch {
        showToast('Failed to load analytics records', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [showToast])

  // Prepare chart data: recent 6 quiz scores chronologically
  const chartAttempts = attempts
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-6)

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
              Learning Analytics
            </h1>
            <p className="text-xs text-slate-550 font-black uppercase tracking-wider mt-1.5">
              Detailed metrics history and performance tracker
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#2563EB] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Average Score</span>
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="mt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-black text-slate-900">
                  {overview?.averageScore ?? 0}%
                </span>
              )}
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#16A34A] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Best Score</span>
              <Award className="h-4.5 w-4.5 text-success" />
            </div>
            <div className="mt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-black text-slate-900">
                  {overview?.bestScore ?? 0}%
                </span>
              )}
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#DC2626] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Attempts</span>
              <TrendingUp className="h-4.5 w-4.5 text-danger" />
            </div>
            <div className="mt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-black text-slate-900">
                  {overview?.totalAttempts ?? 0}
                </span>
              )}
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#4F46E5] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Solved Qs</span>
              <HelpCircle className="h-4.5 w-4.5 text-indigo-650" />
            </div>
            <div className="mt-4">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-black text-slate-900">
                  {overview?.totalQuestionsAnswered ?? 0}
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Charts & Insights Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Custom SVG Score Chart */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2 px-1">
              <BarChart3 className="h-4.5 w-4.5 text-slate-550" /> Performance Trend
            </h2>

            <Card className="p-6 md:p-8 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Recent Quiz Scores (%)</span>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last 6 Attempts</span>
              </div>

              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : chartAttempts.length === 0 ? (
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-200 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  No score history to map
                </div>
              ) : (
                <div className="w-full">
                  {/* Clean responsive SVG Bar Chart */}
                  <svg className="w-full h-48" viewBox="0 0 500 180">
                    {/* Background lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="2" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="#F1F5F9" strokeWidth="2" />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="#F1F5F9" strokeWidth="2" />
                    <line x1="40" y1="150" x2="480" y2="150" stroke="#0F172A" strokeWidth="2" />

                    {/* Chart Bars */}
                    {chartAttempts.map((item, idx) => {
                      const colWidth = 40
                      const spacing = 70
                      const startX = 60 + idx * spacing
                      const barHeight = Math.max(8, (item.score / 100) * 130)
                      const startY = 150 - barHeight

                      return (
                        <g key={item.id} className="group cursor-pointer">
                          {/* Shadow offset */}
                          <rect
                            x={startX + 3}
                            y={startY + 3}
                            width={colWidth}
                            height={barHeight}
                            fill="#0F172A"
                          />
                          {/* Primary Bar */}
                          <rect
                            x={startX}
                            y={startY}
                            width={colWidth}
                            height={barHeight}
                            fill={item.score >= 80 ? '#16A34A' : item.score >= 55 ? '#2563EB' : '#DC2626'}
                            stroke="#0F172A"
                            strokeWidth="2"
                          />
                          {/* Label score text */}
                          <text
                            x={startX + colWidth / 2}
                            y={startY - 8}
                            textAnchor="middle"
                            className="font-mono font-black text-[10px] fill-slate-900"
                          >
                            {item.score}%
                          </text>
                          {/* X-axis Label text */}
                          <text
                            x={startX + colWidth / 2}
                            y={168}
                            textAnchor="middle"
                            className="font-sans font-bold text-[8px] uppercase fill-slate-500 tracking-wider"
                          >
                            T#{item.topicId}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              )}
            </Card>
          </div>

          {/* Quick study insights diagnostics */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest px-1">
              Comprehension Insight
            </h2>

            <Card className="p-6 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Diagnostics summary</p>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {overview && overview.totalAttempts > 0
                  ? `Your highest test score is ${overview.bestScore}%. We recommend targeting a consistent 80%+ marks ratio across all extracted chapters before attempting advanced exams.`
                  : 'You have no recorded quiz scores to draw performance conclusions. Try launching a comprehension test from the topics dashboard to log data.'}
              </p>
            </Card>
          </div>
        </div>

        {/* Attempt Log Panel */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest px-1 flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-slate-500" /> Historical Attempt Log
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <Card className="p-12 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A]">
              <History className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-black uppercase text-slate-500">No attempts logged</p>
              <p className="text-[10px] text-slate-450 uppercase mt-1">Quizzes you complete will show up here</p>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white border-2 border-slate-900 rounded-none">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase tracking-wider font-bold">
                      <th className="p-4 border-b border-slate-900">Attempt ID</th>
                      <th className="p-4 border-b border-slate-900">Topic ID</th>
                      <th className="p-4 border-b border-slate-900">Ratio Correct</th>
                      <th className="p-4 border-b border-slate-900">Grade Percentage</th>
                      <th className="p-4 border-b border-slate-900">Submission Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b last:border-0 border-slate-200 hover:bg-slate-50 font-semibold text-slate-700">
                        <td className="p-4 font-black text-slate-900">#{attempt.id}</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-slate-400" /> Topic #{attempt.topicId}
                          </span>
                        </td>
                        <td className="p-4 font-black text-slate-905">
                          {attempt.correctAnswers} / {attempt.totalQuestions}
                        </td>
                        <td className="p-4 font-black">
                          <Badge
                            variant={
                              attempt.score >= 80
                                ? 'success'
                                : attempt.score >= 50
                                  ? 'warning'
                                  : 'danger'
                            }
                          >
                            {attempt.score}%
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(attempt.createdAt).toLocaleDateString()} {new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
