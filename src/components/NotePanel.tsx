'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { NoteData } from '@/types'

const typeColors: Record<string, string> = {
  learning: '#b8bb26',
  dialogue: '#83a598',
  journal: '#d3869b',
  clips: '#fabd2f',
}

const typeLabels: Record<string, string> = {
  learning: '学習',
  dialogue: '対話',
  journal: '思考',
  clips: 'クリップ',
}

export function NotePanel({ note, onClose }: { note: NoteData; onClose: () => void }) {
  return (
    <aside className="absolute bottom-0 left-0 right-0 max-h-[70dvh] sm:max-h-full sm:top-0 sm:left-auto sm:w-[480px] border-t sm:border-t-0 sm:border-l border-neutral-800 overflow-y-auto bg-neutral-950/95 backdrop-blur-sm z-20">
      <div className="sticky top-0 bg-neutral-950/95 backdrop-blur-sm px-5 pt-4 pb-3 border-b border-neutral-800/50 z-10">
        <div className="flex justify-between items-start">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: typeColors[note.type] + '22', color: typeColors[note.type] }}
          >
            {typeLabels[note.type]}
          </span>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 text-xl leading-none px-1">×</button>
        </div>
        <h2 className="text-base font-bold mt-2 leading-snug">{note.title}</h2>
        {note.date && <p className="text-xs text-neutral-500 mt-1">{note.date}</p>}
        {note.category && <p className="text-xs text-neutral-600">{note.category}</p>}
      </div>
      <div className="px-5 py-4">
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-neutral-200 prose-headings:font-bold prose-headings:mt-5 prose-headings:mb-2
          prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:my-2
          prose-blockquote:border-l-neutral-600 prose-blockquote:text-neutral-400 prose-blockquote:italic
          prose-strong:text-neutral-200
          prose-li:text-neutral-300 prose-li:my-0.5
          prose-code:text-neutral-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:rounded
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-hr:border-neutral-800
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.body}</ReactMarkdown>
        </div>
        {note.source && (
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 mb-1">出典</p>
            <p className="text-sm text-neutral-400">{note.source}</p>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1.5">キーワード</p>
          <div className="flex flex-wrap gap-1.5">
            {note.keywords.map(k => (
              <span key={k} className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
