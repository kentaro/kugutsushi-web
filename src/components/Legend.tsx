export function Legend() {
  const items = [
    { label: '学習', color: '#b8bb26' },
    { label: '対話', color: '#83a598' },
    { label: '思考', color: '#d3869b' },
    { label: 'クリップ', color: '#fabd2f' },
  ]
  return (
    <div className="flex gap-4 text-sm text-neutral-400">
      {items.map(i => (
        <div key={i.label} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: i.color }} />
          {i.label}
        </div>
      ))}
    </div>
  )
}
