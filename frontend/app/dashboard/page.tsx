'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { documentService } from '@/services/document.service'
import { quizService } from '@/services/quiz.service'
import { analyticsService } from '@/services/analytics.service'
import { revisionService } from '@/services/revision.service'
import type { Document, QuizAttempt, AnalyticsOverview, Revision } from '@/types'
import {
  FileText,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Sparkles,
  Award,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [docsData, attemptsData, revisionsData, overviewData] = await Promise.all([
          documentService.getDocuments(),
          quizService.getAttempts(),
          revisionService.getRevisions(),
          analyticsService.getOverview()
        ])
        setDocuments(docsData)
        setAttempts(attemptsData)
        setRevisions(revisionsData)
        setOverview(overviewData)
      } catch (error) {
        console.error(error)
        showToast('Failed to load dashboard statistics', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [showToast])

  // Get recent 3 documents
  const recentDocuments = documents
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Generate study insights based on dashboard numbers
  const getInsights = () => {
    if (!overview) return 'No study records available yet. Upload a document to start.'
    
    if (overview.totalAttempts === 0) {
      return 'You have uploaded materials but not attempted any quizzes. Go to your Documents, click Study, and generate a quiz to test your comprehension!'
    }

    if (overview.averageScore < 50) {
      return 'Alert: Your average quiz score is below 50%. Focus on checking your "Weak Topics" tab and reading the Study Notes before re-taking quizzes.'
    }

    if (overview.averageScore < 85) {
      return 'Good Progress: You are averaging solid marks. Generate a "Revision note summary" for key topics to lock in details for exam recall.'
    }

    return 'Elite Level: You are mastering your topics! Try chatting with your documents to query edge-case questions and formulas.'
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
              Study Workspace
            </h1>
            <p className="text-xs text-slate-500 font-black uppercase tracking-wider mt-1.5">
              AI-assisted learning dashboard & materials manager
            </p>
          </div>
          <Link href="/documents" className="w-full md:w-auto shrink-0">
            <Button variant="primary" className="w-full md:w-auto shadow-[3px_3px_0px_0px_#0F172A] flex items-center gap-2">
              <Plus className="h-4 w-4" /> Upload PDF Document
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Total Documents */}
          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#2563EB] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Documents</span>
              <FileText className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="mt-6">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-4xl font-black text-slate-900 leading-none">{documents.length}</span>
              )}
            </div>
          </Card>

          {/* Notes Generated */}
          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#16A34A] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Study Notes</span>
              <BookOpen className="h-4.5 w-4.5 text-success" />
            </div>
            <div className="mt-6">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-4xl font-black text-slate-900 leading-none">{revisions.length}</span>
              )}
            </div>
          </Card>

          {/* Flashcards */}
          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#4F46E5] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Flashcards</span>
              <Layers className="h-4.5 w-4.5 text-indigo-650" />
            </div>
            <div className="mt-6">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-4xl font-black text-slate-900 leading-none">{revisions.length * 5}</span>
              )}
            </div>
          </Card>

          {/* Quiz Attempts */}
          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#DC2626] border-2 border-slate-900 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Attempts</span>
              <HelpCircle className="h-4.5 w-4.5 text-danger" />
            </div>
            <div className="mt-6">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-4xl font-black text-slate-900 leading-none">
                  {overview?.totalAttempts ?? 0}
                </span>
              )}
            </div>
          </Card>

          {/* Average Score */}
          <Card className="p-5 flex flex-col justify-between shadow-[4px_4px_0px_0px_#D97706] border-2 border-slate-900 bg-white col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avg Score</span>
              <GraduationCap className="h-4.5 w-4.5 text-warning" />
            </div>
            <div className="mt-6">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-4xl font-black text-slate-900 leading-none">
                  {overview?.averageScore ?? 0}%
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest px-1">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/documents">
              <Card hoverable className="p-4 flex items-center justify-between shadow-[2px_2px_0px_0px_#0F172A] border-2 border-slate-900 h-16 group">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 group-hover:text-primary transition-colors">Upload PDF</span>
                <Plus className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>
            <Link href="/weak-topics">
              <Card hoverable className="p-4 flex items-center justify-between shadow-[2px_2px_0px_0px_#0F172A] border-2 border-slate-900 h-16 group">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 group-hover:text-primary transition-colors">Weak Topics</span>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>
            <Link href="/revisions">
              <Card hoverable className="p-4 flex items-center justify-between shadow-[2px_2px_0px_0px_#0F172A] border-2 border-slate-900 h-16 group">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 group-hover:text-primary transition-colors">Review Notes</span>
                <BookOpen className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>
            <Link href="/analytics">
              <Card hoverable className="p-4 flex items-center justify-between shadow-[2px_2px_0px_0px_#0F172A] border-2 border-slate-900 h-16 group">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 group-hover:text-primary transition-colors">Attempts Log</span>
                <Award className="h-4 w-4 text-slate-400" />
              </Card>
            </Link>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Recent Documents Panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-slate-500" /> Recent Documents
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : recentDocuments.length === 0 ? (
              <Card className="p-10 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <FileText className="h-8 w-8 text-slate-450 mx-auto mb-2" />
                <p className="text-xs font-black uppercase text-slate-500">No documents uploaded</p>
                <Link href="/documents" className="inline-block mt-4">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-5 flex items-center justify-between border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] bg-white group hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-3 bg-blue-50 border-2 border-slate-900 text-primary shrink-0 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-primary transition-colors truncate max-w-xs md:max-w-md">
                          {doc.title}
                        </h3>
                        <p className="text-[9px] text-slate-550 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                          <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <Badge
                        variant={
                          doc.status === 'COMPLETED'
                            ? 'success'
                            : doc.status === 'PROCESSING'
                              ? 'warning'
                              : doc.status === 'FAILED'
                                ? 'danger'
                                : 'default'
                        }
                      >
                        {doc.status}
                      </Badge>
                      <Link href={`/documents/${doc.id}`}>
                        <Button size="sm" className="shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                          View
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Insights & Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-slate-500" /> Study Insights
            </h2>

            <Card className="p-6 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
              <div className="p-3 bg-slate-900 text-white font-black uppercase text-[10px] tracking-wider flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-warning" /> AI Advisor Advice
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {getInsights()}
              </p>
            </Card>

            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-slate-500" /> Recent Activity
            </h2>

            <Card className="p-6 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Quiz performance</p>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : attempts.length === 0 ? (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">No quizzes attempted yet.</p>
              ) : (
                <div className="space-y-3">
                  {attempts.slice(0, 3).map((attempt) => (
                    <div key={attempt.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-xs">
                      <span className="font-black text-slate-800 uppercase tracking-wider text-[10px]">
                        Topic #{attempt.topicId}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-650">{attempt.correctAnswers}/{attempt.totalQuestions}</span>
                        <Badge variant={attempt.score >= 70 ? 'success' : attempt.score >= 50 ? 'warning' : 'danger'}>
                          {attempt.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
