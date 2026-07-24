import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "../../lib/googleMaps";

export interface PreviewSegment {
  label: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

export function SegmentMapPreview({
  segments,
  height = 240,
}: {
  segments: PreviewSegment[];
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const overlaysRef = useRef<any[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    let mounted = true;
    loadGoogleMaps()
      .then((g) => {
        if (!mounted || !ref.current) return;
        const google = (window as any).google;
        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(ref.current, {
            zoomControl: true,
            center: { lat: 8.9806, lng: 38.7578 },
            zoom: 12,
          });
        }
        const map = mapRef.current;

        // clear existing overlays
        overlaysRef.current.forEach((o) => o.setMap && o.setMap(null));
        overlaysRef.current = [];

        const valid = segments.filter(
          (s) =>
            Number.isFinite(s.startLat) &&
            Number.isFinite(s.startLng) &&
            Number.isFinite(s.endLat) &&
            Number.isFinite(s.endLng),
        );

        if (valid.length === 0) {
          map.setCenter({ lat: 8.9806, lng: 38.7578 });
          map.setZoom(12);
          return;
        }

        const bounds = new google.maps.LatLngBounds();
        valid.forEach((s) => {
          const line = new google.maps.Polyline({
            path: [
              { lat: s.startLat, lng: s.startLng },
              { lat: s.endLat, lng: s.endLng },
            ],
            strokeColor: "#5B5BD6",
            strokeWeight: 4,
            strokeOpacity: 0.85,
            map,
          });
          overlaysRef.current.push(line);
          const marker1 = new google.maps.Marker({
            position: { lat: s.startLat, lng: s.startLng },
            map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: "#5B5BD6",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            },
          });
          const marker2 = new google.maps.Marker({
            position: { lat: s.endLat, lng: s.endLng },
            map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: "#5B5BD6",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
            },
          });
          overlaysRef.current.push(marker1);
          overlaysRef.current.push(marker2);
          bounds.extend(new google.maps.LatLng(s.startLat, s.startLng));
          bounds.extend(new google.maps.LatLng(s.endLat, s.endLng));
        });
        try {
          map.fitBounds(bounds, { padding: 24, maxZoom: 16 });
        } catch {
          map.fitBounds(bounds);
        }
      })
      .catch((err) => console.error("Google Maps failed to load", err));
    return () => {
      mounted = false;
    };
  }, [segments]);

  useEffect(() => {
    return () => {
      overlaysRef.current.forEach((o) => o.setMap && o.setMap(null));
      overlaysRef.current = [];
      if (mapRef.current && (mapRef.current as any).panTo)
        mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ height }}
      className="w-full rounded-md border border-border"
    />
  );
}
