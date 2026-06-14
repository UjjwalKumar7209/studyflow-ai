'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { documentService } from '@/services/document.service'
import type { Document } from '@/types'
import {
  FileText,
  Calendar,
  Layers,
  ArrowLeft,
  Sparkles,
  Info,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default function DocumentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const documentId = Number(params.id)

  const [document, setDocument] = useState<Document | null>(null)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const loadDocumentDetails = async () => {
    try {
      const doc = await documentService.getDocument(documentId)
      setDocument(doc)

      if (doc.status === 'COMPLETED') {
        try {
          const contentRes = await documentService.getContent(documentId)
          setContent(contentRes.content)
        } catch {
          console.warn('Failed to load document content')
        }
      }
    } catch {
      showToast('Document not found', 'error')
      router.push('/documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) {
      loadDocumentDetails()
    }
  }, [documentId])

  const triggerProcess = async () => {
    setProcessing(true)
    showToast('Starting AI document parsing...', 'info')
    try {
      const updated = await documentService.processDocument(documentId)
      setDocument(updated)
      showToast('Parsing finished successfully!', 'success')
      if (updated.status === 'COMPLETED') {
        const contentRes = await documentService.getContent(documentId)
        setContent(contentRes.content)
      }
    } catch (error: any) {
      showToast(error.response?.data?.msg || 'Processing failed', 'error')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="h-64 col-span-1" />
            <Skeleton className="h-64 col-span-2" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!document) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Link */}
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Documents
        </Link>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 border-2 border-slate-900 text-primary shadow-[2px_2px_0px_0px_#0F172A]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">
                {document.title}
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
                <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>{document.fileType}</span>
              </p>
            </div>
          </div>
          <Badge
            variant={
              document.status === 'COMPLETED'
                ? 'success'
                : document.status === 'PROCESSING'
                  ? 'warning'
                  : document.status === 'FAILED'
                    ? 'danger'
                    : 'default'
            }
            className="w-fit self-start md:self-center"
          >
            {document.status}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Metadata Cards */}
          <div className="space-y-6 col-span-1">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2 px-1">
              <Info className="h-4.5 w-4.5 text-slate-500" /> Document Info
            </h2>

            <Card className="p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white text-xs border-2 border-slate-900">
              <div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Original Name</p>
                <p className="font-extrabold text-slate-900 truncate mt-1">{document.originalFileName}</p>
              </div>

              <div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Date Uploaded</p>
                <p className="font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {new Date(document.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Storage Location</p>
                <p className="font-extrabold text-slate-900 mt-1 font-mono break-all">{document.storagePath}</p>
              </div>

              {(document.status === 'PENDING' || document.status === 'UPLOADED') && (
                <Button
                  onClick={triggerProcess}
                  variant="primary"
                  className="w-full justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                  isLoading={processing}
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Start Processing
                </Button>
              )}

              {document.status === 'COMPLETED' && (
                <Link href={`/topics/${document.id}`} className="block">
                  <Button
                    variant="primary"
                    className="w-full justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <Layers className="h-4 w-4 mr-2" /> View Topics
                  </Button>
                </Link>
              )}
            </Card>
          </div>

          {/* Raw Text Content */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2 px-1">
              <BookOpen className="h-4.5 w-4.5 text-slate-500" /> Extracted Text Content
            </h2>

            {document.status !== 'COMPLETED' ? (
              <Card className="p-10 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A] flex flex-col justify-center h-52">
                <p className="text-xs font-black uppercase text-slate-500">Text content not extracted yet</p>
                <p className="text-[10px] text-slate-450 uppercase mt-1.5 font-bold tracking-wide">Please trigger document processing to view PDF text</p>
              </Card>
            ) : !content ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <Card className="p-6 h-[400px] overflow-y-auto bg-slate-55 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-mono text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {content}
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
