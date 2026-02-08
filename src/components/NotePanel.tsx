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
    <aside className="w-96 border-l border-neutral-800 p-6 overflow-y-auto bg-neutral-950/80">
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ background: typeColors[note.type] + '22', color: typeColors[note.type] }}
        >
          {typeLabels[note.type]}
        </span>
        <button onClick={onClose} className="text-neutral-600 hover:text-neutral-300 text-lg">×</button>
      </div>
      <h2 className="text-lg font-bold mb-2">{note.title}</h2>
      {note.date && <p className="text-sm text-neutral-500 mb-3">{note.date}</p>}
      {note.category && <p className="text-xs text-neutral-600 mb-4">{note.category}</p>}
      <p className="text-sm text-neutral-300 leading-relaxed mb-4">{note.excerpt}</p>
      {note.source && (
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-1">出典</p>
          <p className="text-sm text-neutral-400">{note.source}</p>
        </div>
      )}
      <div>
        <p className="text-xs text-neutral-500 mb-2">キーワード</p>
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
