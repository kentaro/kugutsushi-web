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
    <aside className="absolute bottom-0 left-0 right-0 max-h-[60dvh] sm:max-h-full sm:top-0 sm:left-auto sm:w-96 border-t sm:border-t-0 sm:border-l border-neutral-800 p-5 overflow-y-auto bg-neutral-950/95 backdrop-blur-sm z-20">
      <div className="flex justify-between items-start mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ background: typeColors[note.type] + '22', color: typeColors[note.type] }}
        >
          {typeLabels[note.type]}
        </span>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 text-xl leading-none px-1">×</button>
      </div>
      <h2 className="text-base font-bold mb-1.5 leading-snug">{note.title}</h2>
      {note.date && <p className="text-xs text-neutral-500 mb-2">{note.date}</p>}
      {note.category && <p className="text-xs text-neutral-600 mb-3">{note.category}</p>}
      <p className="text-sm text-neutral-300 leading-relaxed mb-4">{note.excerpt}</p>
      {note.source && (
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-1">出典</p>
          <p className="text-sm text-neutral-400">{note.source}</p>
        </div>
      )}
      <div>
        <p className="text-xs text-neutral-500 mb-1.5">キーワード</p>
        <div className="flex flex-wrap gap-1.5">
          {note.keywords.map(k => (
            <span key={k} className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
              {k}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
