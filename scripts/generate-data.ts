import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const OBSIDIAN_DIR = path.join(
  process.env.HOME || '/home/kentaro',
  'src/github.com/kentaro/obsidian/kugutsushi'
)
const OUT_DIR = path.join(__dirname, '..', 'public', 'data')

interface NoteData {
  id: string
  title: string
  date: string
  category: string
  type: 'learning' | 'dialogue' | 'journal' | 'clips'
  source?: string
  excerpt: string
  keywords: string[]
}

interface GraphData {
  nodes: NoteData[]
  links: { source: string; target: string; weight: number; sharedKeywords: string[] }[]
}

function getAllMdFiles(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...getAllMdFiles(full))
    } else if (entry.name.endsWith('.md') && !entry.name.startsWith('template')) {
      results.push(full)
    }
  }
  return results
}

function extractKeywords(content: string): string[] {
  // Extract meaningful Japanese/English terms from content
  // Remove markdown syntax
  const clean = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*_`\[\]()>|]/g, ' ')
    .replace(/https?:\/\/\S+/g, '')

  // Extract terms that appear to be concepts (katakana words, quoted terms, bold terms from original)
  const katakana = clean.match(/[\u30A0-\u30FF]{3,}/g) || []
  const kanji = clean.match(/[\u4E00-\u9FFF]{2,6}/g) || []
  const english = clean.match(/[A-Z][a-z]{3,}/g) || []

  // Count frequency and keep top terms
  const freq = new Map<string, number>()
  for (const term of [...katakana, ...kanji, ...english]) {
    freq.set(term, (freq.get(term) || 0) + 1)
  }

  // Filter out common words
  const stopWords = new Set([
    'する', 'ある', 'いる', 'なる', 'できる', 'もの', 'こと', 'それ', 'これ', 'ため',
    'つまり', '以下', '以上', '場合', '問題', '必要', '可能', '自分', '意味', '理解',
    'The', 'This', 'That', 'From', 'With', 'And', 'For', 'Not', 'But', 'All',
    'What', 'How', 'Why', 'When', 'Where', 'Which', 'About', 'Into', 'Over',
    '概念', '構造', '関係', '存在', '世界', '人間', '思考', '言語', '文化', '社会',
  ])

  return Array.from(freq.entries())
    .filter(([term]) => !stopWords.has(term) && term.length >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([term]) => term)
}

function getExcerpt(content: string, maxLen = 200): string {
  const body = content.replace(/^---[\s\S]*?---/, '').trim()
  const lines = body.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('```'))
  const text = lines.slice(0, 5).join(' ').replace(/[#*_`\[\]()>|]/g, '').trim()
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}

function detectType(filePath: string): NoteData['type'] {
  if (filePath.includes('/learning/')) return 'learning'
  if (filePath.includes('/dialogue/')) return 'dialogue'
  if (filePath.includes('/journal/')) return 'journal'
  if (filePath.includes('/clips/')) return 'clips'
  return 'learning'
}

function main() {
  const dirs = ['learning', 'dialogue', 'journal', 'clips']
  const allNotes: NoteData[] = []

  for (const dir of dirs) {
    const files = getAllMdFiles(path.join(OBSIDIAN_DIR, dir))
    for (const file of files) {
      try {
        const raw = fs.readFileSync(file, 'utf-8')
        const { data: fm, content } = matter(raw)
        const id = path.basename(file, '.md')
        allNotes.push({
          id,
          title: fm.title || id.replace(/^\d{4}年\d{1,2}月\d{1,2}日-/, ''),
          date: fm.date || '',
          category: fm.category || dir,
          type: detectType(file),
          source: fm.source,
          excerpt: getExcerpt(content),
          keywords: extractKeywords(content),
        })
      } catch (e) {
        console.error(`Error parsing ${file}:`, e)
      }
    }
  }

  // Build links based on shared keywords
  const links: GraphData['links'] = []
  for (let i = 0; i < allNotes.length; i++) {
    for (let j = i + 1; j < allNotes.length; j++) {
      const shared = allNotes[i].keywords.filter(k => allNotes[j].keywords.includes(k))
      if (shared.length >= 2) {
        links.push({
          source: allNotes[i].id,
          target: allNotes[j].id,
          weight: shared.length,
          sharedKeywords: shared.slice(0, 5),
        })
      }
    }
  }

  const graphData: GraphData = { nodes: allNotes, links }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'graph.json'), JSON.stringify(graphData, null, 2))

  console.log(`Generated: ${allNotes.length} nodes, ${links.length} links`)
  console.log(`Types: learning=${allNotes.filter(n => n.type === 'learning').length}, clips=${allNotes.filter(n => n.type === 'clips').length}, dialogue=${allNotes.filter(n => n.type === 'dialogue').length}, journal=${allNotes.filter(n => n.type === 'journal').length}`)
}

main()
