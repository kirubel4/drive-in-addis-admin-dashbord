import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { REPORT_TYPE_COLORS, REPORT_TYPE_LABELS } from "./types";
import type { Report } from "./types";
import { loadGoogleMaps } from "../../lib/googleMaps";

export function ReportMap({ reports }: { reports: Report[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const infoRef = useRef<any[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    if (!containerRef.current || mapRef.current) return;

    setStatus("loading");
    loadGoogleMaps()
      .then((g) => {
        if (!mounted || !containerRef.current) return;
        const map = new g.maps.Map(containerRef.current, {
          center: { lat: 8.98, lng: 38.75 },
          zoom: 13,
        });
        mapRef.current = map;
        setStatus("ready");
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Google Maps failed to load", err);
        setErrorMessage(err?.message || "Failed to load Google Maps");
        setStatus("error");
      });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof window === "undefined" || !(window as any).google)
      return;

    // clear existing
    markersRef.current.forEach((m) => m.setMap(null));
    infoRef.current.forEach((i) => i.close && i.close());
    markersRef.current = [];
    infoRef.current = [];

    const g = (window as any).google;
    const bounds = new g.maps.LatLngBounds();

    reports.forEach((r) => {
      const color = REPORT_TYPE_COLORS[r.type];
      const label = REPORT_TYPE_LABELS[r.type];

      const size = r.isVerified ? 24 : 16;
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${size / 2}' cy='${size / 2}' r='${size / 2 - 2}' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
      const icon = {
        url: "data:image/svg+xml;utf8," + encodeURIComponent(svg),
        scaledSize: new g.maps.Size(size, size),
        anchor: new g.maps.Point(size / 2, size / 2),
      };

      const marker = new g.maps.Marker({
        position: { lat: r.lat, lng: r.lng },
        map,
        icon,
        title: label,
      });

      const info = new g.maps.InfoWindow({
        content: `<div style="min-width:180px"><strong style="color:${color}">${label}</strong><div style="margin-top:6px">${r.description || "No description"}</div><div style="margin-top:6px;color:#6b7280;font-size:12px">${r.isVerified ? "✓ Verified" : "Pending"}</div></div>`,
      });

      marker.addListener("click", () => info.open({ anchor: marker, map }));

      markersRef.current.push(marker);
      infoRef.current.push(info);
      bounds.extend(new g.maps.LatLng(r.lat, r.lng));
    });

    if (reports.length) {
      try {
        map.fitBounds(bounds, { padding: 40 });
      } catch (e) {
        map.fitBounds(bounds);
      }
    }
  }, [reports]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div
        ref={containerRef}
        style={{ width: "100%", height: "400px" }}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 text-ink-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm">Loading map…</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white p-6 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <p className="text-sm font-medium text-ink-700">Map couldn't load</p>
          <p className="max-w-xs text-xs text-ink-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}