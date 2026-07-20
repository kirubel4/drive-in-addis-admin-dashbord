import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface PreviewSegment {
  label: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
}

export function SegmentMapPreview({ segments, height = 240 }: { segments: PreviewSegment[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current) return
    if (!mapRef.current) {
      mapRef.current = L.map(ref.current, { zoomControl: true, attributionControl: false })
    }
    const map = mapRef.current

    // clear existing layers
    map.eachLayer((layer) => map.removeLayer(layer))

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const valid = segments.filter(
      (s) => Number.isFinite(s.startLat) && Number.isFinite(s.startLng) && Number.isFinite(s.endLat) && Number.isFinite(s.endLng)
    )

    if (valid.length === 0) {
      map.setView([8.9806, 38.7578], 12) // Addis Ababa fallback
      return
    }

    const bounds = L.latLngBounds([])
    valid.forEach((s) => {
      const line = L.polyline(
        [
          [s.startLat, s.startLng],
          [s.endLat, s.endLng],
        ],
        { color: '#5B5BD6', weight: 4, opacity: 0.85 }
      ).addTo(map)
      line.bindTooltip(s.label, { permanent: false, direction: 'top' })
      L.circleMarker([s.startLat, s.startLng], { radius: 4, color: '#5B5BD6', fillColor: '#fff', fillOpacity: 1, weight: 2 }).addTo(map)
      L.circleMarker([s.endLat, s.endLng], { radius: 4, color: '#5B5BD6', fillColor: '#fff', fillOpacity: 1, weight: 2 }).addTo(map)
      bounds.extend(line.getBounds())
    })
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 })
  }, [segments])

  useEffect(() => {
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={ref} style={{ height }} className="w-full rounded-md border border-border" />
}
