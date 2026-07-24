import { useEffect, useRef } from "react";
import { REPORT_TYPE_COLORS, REPORT_TYPE_LABELS } from "./types";
import type { Report } from "./types";
import { loadGoogleMaps } from "../../lib/googleMaps";

export function ReportMap({ reports }: { reports: Report[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const infoRef = useRef<any[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!containerRef.current || mapRef.current) return;

    loadGoogleMaps()
      .then((g) => {
        if (!mounted || !containerRef.current) return;
        const map = new g.maps.Map(containerRef.current, {
          center: { lat: 8.98, lng: 38.75 },
          zoom: 13,
        });
        mapRef.current = map;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Google Maps failed to load", err);
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
    <div
      ref={containerRef}
      style={{ width: "100%", height: "400px" }}
      className="rounded-lg border border-border"
    />
  );
}
