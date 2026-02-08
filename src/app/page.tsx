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
    <main className="h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">🎭 傀儡師の思考地図</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {data.nodes.length}のノート · {data.links.length}のつながり
          </p>
        </div>
        <Legend />
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <Graph data={data} onSelect={setSelected} selected={selected} />
        </div>
        {selected && (
          <NotePanel note={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </main>
  )
}
