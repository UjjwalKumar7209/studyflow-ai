'use client'

import React, { useEffect, useState, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { documentService } from '@/services/document.service'
import type { Document } from '@/types'
import {
  FileText,
  Search,
  UploadCloud,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  FolderOpen
} from 'lucide-react'
import Link from 'next/link'

export default function DocumentsPage() {
  const { showToast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments()
      setDocuments(data)
    } catch {
      showToast('Failed to fetch documents list', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are supported', 'error')
      return
    }

    setUploading(true)
    try {
      showToast(`Uploading ${file.name}...`, 'info')
      const doc = await documentService.uploadDocument(file)
      showToast('Document uploaded successfully!', 'success')
      setDocuments((prev) => [doc, ...prev])
    } catch (error: any) {
      const msg = error.response?.data?.msg || 'Upload failed'
      showToast(msg, 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerProcess = async (id: number) => {
    showToast('Processing PDF content. Please wait...', 'info')
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'PROCESSING' } : d))
    )

    try {
      const updatedDoc = await documentService.processDocument(id)
      showToast('Document processed successfully!', 'success')
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? updatedDoc : d))
      )
    } catch (error: any) {
      const msg = error.response?.data?.msg || 'Processing failed'
      showToast(msg, 'error')
      fetchDocuments()
    }
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
              My Documents
            </h1>
            <p className="text-xs text-slate-550 font-black uppercase tracking-wider mt-1.5">
              Upload study textbooks or syllabus, extract chapters, and trigger studies
            </p>
          </div>
          <Button
            onClick={fetchDocuments}
            className="p-3 border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#0F172A] w-fit"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-4 border-dashed p-12 text-center cursor-pointer transition-all duration-150 ${
            dragOver
              ? 'border-primary bg-blue-50/20'
              : 'border-slate-900 bg-white hover:bg-slate-50/30'
          } shadow-[4px_4px_0px_0px_#0F172A]`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 border-2 border-slate-900 text-primary shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">
              {uploading ? 'Processing PDF Upload...' : 'Drag & Drop your study PDF here'}
            </h3>
            <p className="text-[10px] text-slate-450 font-black uppercase tracking-wider">
              {uploading ? 'Please wait, allocating workspace storage' : 'or click to search files (PDF format only)'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 max-w-md bg-white border-2 border-slate-900 px-4 py-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <Search className="h-4.5 w-4.5 text-slate-550 shrink-0" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold outline-none border-none focus:ring-0 bg-transparent text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A]">
            <FolderOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-xs font-black uppercase text-slate-700">No documents found</h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
              {searchQuery ? 'Check spelling or try a different term' : 'Upload your first PDF textbook to begin studying'}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="flex flex-col justify-between h-60 shadow-[4px_4px_0px_0px_#0F172A] border-2 border-slate-900 hover:shadow-[6px_6px_0px_0px_#0F172A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-white"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="p-2.5 bg-blue-50 border-2 border-slate-900 text-primary shadow-[1px_1px_0px_0px_#0F172A]">
                      <FileText className="h-5 w-5" />
                    </div>
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
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 line-clamp-2" title={doc.title}>
                      {doc.title}
                    </h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-2 flex items-center gap-1.5">
                      <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  {(doc.status === 'PENDING' || doc.status === 'UPLOADED') && (
                    <Button
                      onClick={() => triggerProcess(doc.id)}
                      variant="primary"
                      className="w-full text-[10px] py-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Parse Chapters
                    </Button>
                  )}

                  {doc.status === 'PROCESSING' && (
                    <Button
                      disabled
                      className="w-full text-[10px] py-2 bg-slate-50 text-slate-400 border-2 border-slate-350"
                    >
                      <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Parsing...
                    </Button>
                  )}

                  {doc.status === 'FAILED' && (
                    <Button
                      onClick={() => triggerProcess(doc.id)}
                      className="w-full text-[10px] py-2 bg-rose-50 text-danger border-danger shadow-[2px_2px_0px_0px_rgba(220,38,38,0.2)]"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Retry Parsing
                    </Button>
                  )}

                  {doc.status === 'COMPLETED' && (
                    <>
                      <Link href={`/topics/${doc.id}`} className="flex-1">
                        <Button
                          variant="primary"
                          className="w-full text-[10px] py-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                        >
                          Study <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </Link>
                      <Link href={`/chat/${doc.id}`}>
                        <Button
                          className="p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center bg-slate-50"
                          title="Chat with Document"
                        >
                          <MessageSquare className="h-4.5 w-4.5 text-slate-700" />
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link href={`/documents/${doc.id}`}>
                    <Button
                      className="p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center bg-slate-50 text-[10px] font-black uppercase"
                      title="Metadata details"
                    >
                      Info
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
