'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import type { GraphData, NoteData } from '@/types'

const typeColors: Record<string, string> = {
  learning: '#b8bb26',
  dialogue: '#83a598',
  journal: '#d3869b',
  clips: '#fabd2f',
}

interface Props {
  data: GraphData
  onSelect: (note: NoteData | null) => void
  selected: NoteData | null
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string
  type: string
  title: string
  _note: NoteData
  linkCount: number
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  weight: number
}

export function Graph({ data, onSelect, selected }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null)

  const init = useCallback(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const rect = svgRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Count links per node
    const linkCount = new Map<string, number>()
    data.links.forEach(l => {
      linkCount.set(l.source, (linkCount.get(l.source) || 0) + 1)
      linkCount.set(l.target, (linkCount.get(l.target) || 0) + 1)
    })

    const nodes: SimNode[] = data.nodes.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      _note: n,
      linkCount: linkCount.get(n.id) || 0,
    }))

    const nodeMap = new Map(nodes.map(n => [n.id, n]))

    const links: SimLink[] = data.links
      .filter(l => nodeMap.has(l.source) && nodeMap.has(l.target))
      .map(l => ({
        source: l.source,
        target: l.target,
        weight: l.weight,
      }))

    const g = svg.append('g')

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (e) => g.attr('transform', e.transform))
    svg.call(zoom)

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#333')
      .attr('stroke-width', (d: SimLink) => Math.min(d.weight * 0.5, 3))
      .attr('stroke-opacity', 0.3)

    // Nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d: SimNode) => Math.max(3, Math.min(d.linkCount * 0.8 + 3, 15)))
      .attr('fill', (d: SimNode) => typeColors[d.type] || '#888')
      .attr('fill-opacity', 0.8)
      .attr('stroke', 'none')
      .attr('cursor', 'pointer')
      .on('click', (_e: any, d: any) => onSelect((d as SimNode)._note))
      .on('mouseover', function (_e: any, d: any) {
        d3.select(this as any).attr('stroke', '#fff').attr('stroke-width', 2)
        tooltip.style('opacity', 1).text((d as SimNode).title)
      })
      .on('mousemove', function (_e: any) {
        tooltip
          .style('left', `${_e.offsetX + 10}px`)
          .style('top', `${_e.offsetY - 10}px`)
      })
      .on('mouseout', function () {
        d3.select(this as any).attr('stroke', 'none')
        tooltip.style('opacity', 0)
      })

    // Drag
    const drag = d3.drag<SVGCircleElement, SimNode>()
      .on('start', (e, d) => {
        if (!e.active) sim.alphaTarget(0.3).restart()
        d.fx = d.x; d.fy = d.y
      })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
      .on('end', (e, d) => {
        if (!e.active) sim.alphaTarget(0)
        d.fx = null; d.fy = null
      })
    node.call(drag as any)

    // Tooltip
    const tooltip = d3.select(svgRef.current.parentElement!)
      .append('div')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', '#1a1a1a')
      .style('color', '#ddd')
      .style('font-size', '12px')
      .style('padding', '4px 8px')
      .style('border-radius', '4px')
      .style('opacity', '0')
      .style('z-index', '50')
      .style('max-width', '200px')
      .style('white-space', 'nowrap')
      .style('overflow', 'hidden')
      .style('text-overflow', 'ellipsis')

    // Simulation
    const sim = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-60))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(10))
      .on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y)
        node
          .attr('cx', (d: SimNode) => d.x!)
          .attr('cy', (d: SimNode) => d.y!)
      })

    simRef.current = sim

    // Initial zoom to fit
    svg.call(zoom.transform, d3.zoomIdentity.translate(width * 0.1, height * 0.1).scale(0.8))

    return () => {
      sim.stop()
      tooltip.remove()
    }
  }, [data, onSelect])

  useEffect(() => {
    const cleanup = init()
    const handleResize = () => init()
    window.addEventListener('resize', handleResize)
    return () => {
      cleanup?.()
      window.removeEventListener('resize', handleResize)
    }
  }, [init])

  return <svg ref={svgRef} className="w-full h-full" />
}
