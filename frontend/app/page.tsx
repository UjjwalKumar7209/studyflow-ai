'use client'

import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import {
  FileText,
  Brain,
  Layers,
  HelpCircle,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-[10px] font-black uppercase tracking-widest text-primary mb-8">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Flow through your syllabus
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tight max-w-5xl uppercase leading-[0.9] mb-8">
          Turn any PDF into <span className="text-primary">custom AI study tools</span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-650 max-w-3xl mb-12 leading-relaxed font-bold">
          Stop scanning endless chapters. Upload your textbook or slides to instantly extract key topics, generate readable markdown study notes, practice active recall flashcards, attempt MCQ quizzes, and analyze learning weaknesses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/register"
            className="premium-button premium-button-primary text-sm px-10 py-4.5 flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#0F172A]"
          >
            Start studying free <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="premium-button text-sm px-10 py-4.5 flex items-center justify-center gap-3 bg-white shadow-[4px_4px_0px_0px_#0F172A]"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl text-left">
          {[
            { label: 'PDF Parsing', desc: 'Secure backend content compilation' },
            { label: 'Summaries Hub', desc: 'Clean markdown documentation notes' },
            { label: 'Active Recall', desc: 'Flippable decks with shortcut keys' },
            { label: 'Gaps Diagnostic', desc: 'Auto score logging and weakness alerts' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border-2 border-slate-900 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{stat.label}</p>
              <p className="text-xs text-slate-600 font-bold leading-normal">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="bg-white border-t-2 border-b-2 border-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
              AI-driven academic workspaces
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-black uppercase tracking-widest">
              Everything you need to master your syllabus in one high-performance layout.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F5F7FA] border-2 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              <div className="p-3 bg-blue-50 text-primary border-2 border-slate-900 w-fit mb-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight mb-2">Smart PDF Upload</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed flex-1">
                Upload raw PDFs up to 50MB. Our backend extracts text content, analyzes document chapters, and prepares them for AI processing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F5F7FA] border-2 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              <div className="p-3 bg-emerald-50 text-emerald-600 border-2 border-slate-900 w-fit mb-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight mb-2">Topic Extractor</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed flex-1">
                No more reading 100-page chapters. The AI identifies key core topics and builds bite-sized revision sheets and deep summaries.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F5F7FA] border-2 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              <div className="p-3 bg-amber-50 text-amber-600 border-2 border-slate-900 w-fit mb-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight mb-2">Interactive Flashcards</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed flex-1">
                Study with beautiful interactive flashcards. Test your terminology and recall, using keyboard shortcuts and progress sliders.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F5F7FA] border-2 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              <div className="p-3 bg-rose-50 text-rose-600 border-2 border-slate-900 w-fit mb-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight mb-2">Timed Quiz Engine</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed flex-1">
                Evaluate your comprehension with MCQ quizzes. Keep tabs on time limit requirements and track grades automatically.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#F5F7FA] border-2 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              <div className="p-3 bg-indigo-50 text-indigo-650 border-2 border-slate-900 w-fit mb-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight mb-2">Weakness Diagnostics</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed flex-1">
                We track every response and flag sub-optimal performances. View priority lists of topics requiring urgent review.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#F5F7FA] border-2 border-slate-900 p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              <div className="p-3 bg-cyan-50 text-cyan-600 border-2 border-slate-900 w-fit mb-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black uppercase text-slate-900 tracking-tight mb-2">Document Chatbot</h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed flex-1">
                Ask questions directly to your PDF. Cite paragraphs, request explanations, and query formulas in a chat interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 text-white py-20 md:py-28 text-center border-b-2 border-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6 leading-none">
            Ready to flow through your study sheets?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-bold mb-10 max-w-2xl mx-auto uppercase tracking-wide">
            Join thousands of high-achieving students using StudyFlow to master complex concepts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="premium-button premium-button-primary bg-primary border-slate-900 text-white text-sm px-10 py-4.5 flex items-center gap-3 hover:bg-blue-750 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              Sign Up Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free forever basic tier</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Instant setup</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 border-t-2 border-slate-900 text-center">
        <p className="text-[10px] font-black text-slate-550 uppercase tracking-wider">
          &copy; {new Date().getFullYear()} StudyFlow AI. Designed for high-performance learning.
        </p>
      </footer>
    </div>
  )
}
