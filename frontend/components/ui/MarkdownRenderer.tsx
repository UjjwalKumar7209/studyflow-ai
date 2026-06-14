'use client'

import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null

  // Helper to parse inline styles like bold, inline code, and links
  const parseInlineStyles = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    let currentText = text
    let index = 0

    // Match bold (**bold**) and inline code (`code`)
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g
    const matches = currentText.split(regex)

    return matches.map((match, idx) => {
      if (match.startsWith('**') && match.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-950">{match.slice(2, -2)}</strong>
      }
      if (match.startsWith('`') && match.endsWith('`')) {
        return (
          <code key={idx} className="bg-slate-100 border border-slate-300 text-rose-600 px-1.5 py-0.5 font-mono text-xs font-bold">
            {match.slice(1, -1)}
          </code>
        )
      }
      const linkMatch = match.match(/\[(.*?)\]\((.*?)\)/)
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-bold"
          >
            {linkMatch[1]}
          </a>
        )
      }
      return match
    })
  }

  // Parse markdown blocks (H1, H2, H3, lists, quotes, tables, paragraphs)
  const parseBlocks = (markdownText: string) => {
    const lines = markdownText.split('\n')
    const blocks: React.ReactNode[] = []
    let listItems: { text: string; type: 'ul' | 'ol' }[] = []
    let inCodeBlock = false
    let codeContent: string[] = []
    let tableRows: string[][] = []
    let isTable = false

    const flushList = (key: number) => {
      if (listItems.length === 0) return null
      const type = listItems[0].type
      const items = listItems.map((item, idx) => (
        <li key={idx} className="pl-1 mb-1 leading-relaxed">
          {parseInlineStyles(item.text)}
        </li>
      ))
      listItems = []
      return type === 'ol' ? (
        <ol key={`ol-${key}`} className="list-decimal list-inside pl-4 text-slate-800 space-y-1.5 font-medium mb-4">
          {items}
        </ol>
      ) : (
        <ul key={`ul-${key}`} className="list-disc list-inside pl-4 text-slate-800 space-y-1.5 font-medium mb-4">
          {items}
        </ul>
      )
    }

    const flushCodeBlock = (key: number) => {
      if (codeContent.length === 0) return null
      const codeText = codeContent.join('\n')
      codeContent = []
      return (
        <pre key={`code-${key}`} className="bg-slate-900 text-slate-100 p-4 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] font-mono text-xs overflow-x-auto leading-relaxed mb-6">
          <code>{codeText}</code>
        </pre>
      )
    }

    const flushTable = (key: number) => {
      if (tableRows.length === 0) return null
      const rows = [...tableRows]
      tableRows = []
      isTable = false

      // Check if second row is divider
      const hasDivider = rows.length > 1 && rows[1].every((cell) => cell.trim().startsWith('-') || cell.trim() === '')
      const finalRows = hasDivider ? [rows[0], ...rows.slice(2)] : rows

      const headerCols = finalRows[0]
      const bodyRows = finalRows.slice(1)

      return (
        <div key={`table-wrapper-${key}`} className="overflow-x-auto mb-6 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#0F172A] bg-white">
          <table className="w-full text-left border-collapse text-xs md:text-sm font-semibold">
            <thead>
              <tr className="bg-slate-900 text-white font-black uppercase">
                {headerCols.map((col, idx) => (
                  <th key={idx} className="p-3 border-b-2 border-slate-950">
                    {col.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b last:border-0 border-slate-200 hover:bg-slate-50 text-slate-700">
                  {headerCols.map((_, colIdx) => (
                    <td key={colIdx} className="p-3">
                      {parseInlineStyles(row[colIdx] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Handle Code Block
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false
          blocks.push(flushCodeBlock(i))
        } else {
          // Flush list or table before entering code block
          if (listItems.length > 0) blocks.push(flushList(i))
          if (tableRows.length > 0) blocks.push(flushTable(i))
          inCodeBlock = true
        }
        continue
      }

      if (inCodeBlock) {
        codeContent.push(line)
        continue
      }

      // Handle Table Row
      if (trimmed.startsWith('|')) {
        if (listItems.length > 0) blocks.push(flushList(i))
        isTable = true
        const cells = trimmed
          .split('|')
          .slice(1, -1) // remove empty cells from start and end
        tableRows.push(cells)
        continue
      } else if (isTable && !trimmed.startsWith('|')) {
        // Table ended
        blocks.push(flushTable(i))
      }

      // Handle Dividers
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        if (listItems.length > 0) blocks.push(flushList(i))
        blocks.push(<hr key={i} className="border-b-2 border-slate-950 my-6" />)
        continue
      }

      // Handle Headings
      if (trimmed.startsWith('# ')) {
        if (listItems.length > 0) blocks.push(flushList(i))
        blocks.push(
          <h1 key={i} className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 border-b-2 border-slate-950 pb-2 mb-4 mt-8">
            {parseInlineStyles(trimmed.slice(2))}
          </h1>
        )
        continue
      }

      if (trimmed.startsWith('## ')) {
        if (listItems.length > 0) blocks.push(flushList(i))
        blocks.push(
          <h2 key={i} className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-955 mt-6 mb-3">
            {parseInlineStyles(trimmed.slice(3))}
          </h2>
        )
        continue
      }

      if (trimmed.startsWith('### ')) {
        if (listItems.length > 0) blocks.push(flushList(i))
        blocks.push(
          <h3 key={i} className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-slate-950 mt-5 mb-2.5">
            {parseInlineStyles(trimmed.slice(4))}
          </h3>
        )
        continue
      }

      // Handle Blockquotes
      if (trimmed.startsWith('>')) {
        if (listItems.length > 0) blocks.push(flushList(i))
        blocks.push(
          <blockquote key={i} className="border-l-4 border-slate-900 bg-slate-100 p-4 font-mono text-xs md:text-sm text-slate-700 italic mb-4">
            {parseInlineStyles(trimmed.slice(1).trim())}
          </blockquote>
        )
        continue
      }

      // Handle Unordered Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listItems.push({ text: trimmed.slice(2), type: 'ul' })
        continue
      }

      // Handle Ordered Lists
      const numListMatch = trimmed.match(/^(\d+)\.\s(.*)/)
      if (numListMatch) {
        listItems.push({ text: numListMatch[2], type: 'ol' })
        continue
      }

      // Handle Empty Line
      if (trimmed === '') {
        if (listItems.length > 0) {
          blocks.push(flushList(i))
        }
        continue
      }

      // Plain Paragraphs
      if (listItems.length > 0) blocks.push(flushList(i))
      blocks.push(
        <p key={i} className="text-slate-800 text-sm md:text-base leading-relaxed mb-4 font-medium">
          {parseInlineStyles(trimmed)}
        </p>
      )
    }

    // Flush any remaining elements at EOF
    if (listItems.length > 0) blocks.push(flushList(lines.length))
    if (inCodeBlock) blocks.push(flushCodeBlock(lines.length))
    if (tableRows.length > 0) blocks.push(flushTable(lines.length))

    return blocks
  }

  return (
    <div className="w-full prose prose-slate max-w-none">
      {parseBlocks(content)}
    </div>
  )
}
