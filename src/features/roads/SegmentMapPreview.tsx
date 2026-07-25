import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { loadGoogleMaps } from "../../lib/googleMaps";

export interface PreviewSegment {
  label: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

const FALLBACK_CENTER = { lat: 8.9806, lng: 38.7578 };

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
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!ref.current) return;
    let mounted = true;
    setStatus("loading");
    loadGoogleMaps()
      .then(() => {
        if (!mounted || !ref.current) return;
        const google = (window as any).google;
        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(ref.current, {
            zoomControl: true,
            center: FALLBACK_CENTER,
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

        setStatus("ready");

        if (valid.length === 0) {
          map.setCenter(FALLBACK_CENTER);
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
      .catch((err) => {
        if (!mounted) return;
        console.error("Google Maps failed to load", err);
        setErrorMessage(err?.message || "Failed to load Google Maps");
        setStatus("error");
      });
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
      className="relative w-full overflow-hidden rounded-md border border-border"
      style={{ height }}
    >
      <div ref={ref} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 text-ink-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm">Loading map…</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white p-4 text-center">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-xs font-medium text-ink-700">Map couldn't load</p>
          <p className="max-w-xs text-[11px] text-ink-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}