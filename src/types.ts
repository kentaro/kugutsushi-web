export interface NoteData {
  id: string
  title: string
  date: string
  category: string
  type: 'learning' | 'dialogue' | 'journal' | 'clips'
  source?: string
  excerpt: string
  keywords: string[]
}

export interface LinkData {
  source: string
  target: string
  weight: number
  sharedKeywords: string[]
}

export interface GraphData {
  nodes: NoteData[]
  links: LinkData[]
}
