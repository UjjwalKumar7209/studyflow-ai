'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/hooks/useToast'
import { chatService } from '@/services/chat.service'
import { documentService } from '@/services/document.service'
import type { ChatMessage, Document } from '@/types'
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Bot,
  User as UserIcon
} from 'lucide-react'
import Link from 'next/link'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const documentId = Number(params.id)

  const [document, setDocument] = useState<Document | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [sending, setSending] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const loadChatData = async () => {
    try {
      const [docData, historyData] = await Promise.all([
        documentService.getDocument(documentId),
        chatService.getChatHistory(documentId)
      ])
      setDocument(docData)
      setMessages(historyData)
    } catch {
      showToast('Document not found', 'error')
      router.push('/documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) {
      loadChatData()
    }
  }, [documentId])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || sending) return

    const userQuestion = question.trim()
    setQuestion('')
    setSending(true)

    const tempMessage: ChatMessage = {
      id: Math.random(),
      userId: 0,
      documentId: documentId,
      question: userQuestion,
      answer: 'Thinking...',
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, tempMessage])

    try {
      const result = await chatService.askQuestion(documentId, userQuestion)
      setMessages((prev) =>
        prev.map((msg) => (msg.question === userQuestion ? result : msg))
      )
    } catch {
      showToast('Failed to send message', 'error')
      setMessages((prev) => prev.filter((msg) => msg.question !== userQuestion))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (!document) return null

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto space-y-4">
        {/* Back Link */}
        <Link
          href={`/topics/${documentId}`}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </Link>

        {/* Title Header */}
        <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-4 shrink-0">
          <div className="p-2.5 bg-blue-50 border-2 border-slate-900 text-primary shadow-[1.5px_1.5px_0px_0px_#0F172A]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
              Document Chatbot
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate max-w-xs sm:max-w-xl">
              File: {document.title}
            </p>
          </div>
        </div>

        {/* Chat History Panel */}
        <Card className="flex-1 overflow-y-auto p-6 bg-slate-50 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col space-y-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="p-4 bg-blue-50 border-2 border-slate-900 text-primary mb-4 shadow-[2px_2px_0px_0px_#0F172A]">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xs font-black uppercase text-slate-900">Chat with PDF</h3>
              <p className="text-[10px] text-slate-500 max-w-xs mt-1.5 uppercase font-bold tracking-wider leading-relaxed">
                Query formulas, ask for paragraph references, or verify details instantly
              </p>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-4">
                  {/* User Message */}
                  <div className="flex items-start gap-3 justify-end max-w-2xl ml-auto">
                    <div className="bg-white border-2 border-slate-900 p-4 shadow-[2px_2px_0px_0px_#2563EB] text-xs text-slate-900 leading-relaxed font-bold">
                      {msg.question}
                    </div>
                    <div className="h-8 w-8 bg-slate-900 text-white flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#2563EB] text-xs font-black">
                      U
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-3 max-w-2xl mr-auto">
                    <div className="h-8 w-8 bg-primary text-white flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                      <Bot className="h-4.5 w-4.5" />
                    </div>
                    <div className={`border-2 border-slate-900 p-4 shadow-[2px_2px_0px_0px_#0F172A] text-xs text-slate-900 bg-[#F1F5F9] ${
                      msg.answer === 'Thinking...' ? 'animate-pulse font-semibold' : ''
                    }`}>
                      {msg.answer === 'Thinking...' ? (
                        msg.answer
                      ) : (
                        <MarkdownRenderer content={msg.answer} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          )}
        </Card>

        {/* Sticky Input Bar */}
        <form onSubmit={handleSend} className="flex gap-3 shrink-0">
          <div className="flex-1 bg-white border-2 border-slate-900 px-4 py-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center focus-within:ring-2 focus-within:ring-primary">
            <input
              type="text"
              placeholder={`Ask a question about "${document.title.substring(0, 25)}..."`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full text-xs font-semibold outline-none border-none focus:ring-0 bg-transparent text-slate-900 placeholder:text-slate-400"
              disabled={sending}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center shrink-0 px-6 py-3"
            disabled={!question.trim() || sending}
          >
            <Send className="h-4.5 w-4.5" />
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}
