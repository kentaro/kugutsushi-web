'use client'

import { useEffect, useState } from 'react'
import { Graph } from '@/components/Graph'
import { NotePanel } from '@/components/NotePanel'
import { Legend } from '@/components/Legend'
import type { GraphData, NoteData } from '@/types'

export default function Home() {
  const [data, setData] = useState<GraphData | null>(null)
  const [selected, setSelected] = useState<NoteData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const base = process.env.NODE_ENV === 'production' ? '/kugutsushi-web' : ''
    fetch(`${base}/data/graph.json`)
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  if (error) return <div className="p-8 text-red-400">Error: {error}</div>
  if (!data) return <div className="p-8 text-neutral-500">読み込み中...</div>

  return (
    <main className="h-[100dvh] flex flex-col">
      <header className="px-4 py-3 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">🎭 傀儡師の思考地図</h1>
          <p className="text-xs text-neutral-500">
            {data.nodes.length}のノート · {data.links.length}のつながり
          </p>
        </div>
        <Legend />
      </header>
      <div className="flex-1 relative overflow-hidden">
        <Graph data={data} onSelect={setSelected} selected={selected} />
        {selected && (
          <NotePanel note={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </main>
  )
}
