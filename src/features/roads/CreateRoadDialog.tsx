import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, Trash2, MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { useCreateRoad } from "./hooks";
import type { NewSegmentInput } from "../../api/roads";
import { loadGoogleMaps } from "../../lib/googleMaps";

const MAP_CENTER: [number, number] = [8.98, 38.75];
const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
];

function emptySegment(order: number): NewSegmentInput {
  return {
    label: `Segment ${String.fromCharCode(65 + order)}`,
    startLat: 8.98,
    startLng: 38.75,
    endLat: 8.985,
    endLng: 38.755,
    speedLimit: 40,
    order,
  };
}

export function CreateRoadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [segments, setSegments] = useState<NewSegmentInput[]>([
    emptySegment(0),
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickMode, setClickMode] = useState<"start" | "end">("start");

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");
  const [mapError, setMapError] = useState<string>("");

  const createRoad = useCreateRoad();
  const activeSegment = segments[activeIndex];

  // Initialize Google map
  useEffect(() => {
    if (!open || !mapRef.current || googleMapRef.current) return;
    let mounted = true;
    setMapStatus("loading");
    loadGoogleMaps()
      .then((g) => {
        if (!mounted || !mapRef.current) return;
        const map = new g.maps.Map(mapRef.current, {
          center: { lat: MAP_CENTER[0], lng: MAP_CENTER[1] },
          zoom: 15,
        });
        map.addListener("click", (e: any) => {
          const lat = parseFloat(e.latLng.lat().toFixed(6));
          const lng = parseFloat(e.latLng.lng().toFixed(6));

          setSegments((prev) => {
            const seg = prev[activeIndex];
            if (!seg) return prev;
            const updated = [...prev];
            if (clickMode === "start") {
              updated[activeIndex] = { ...seg, startLat: lat, startLng: lng };
              setClickMode("end");
            } else {
              updated[activeIndex] = { ...seg, endLat: lat, endLng: lng };
              setClickMode("start");
            }
            return updated;
          });
        });

        googleMapRef.current = map;
        setMapStatus("ready");
        updateMapMarkers();
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Google Maps failed to load", err);
        setMapError(err?.message || "Failed to load Google Maps");
        setMapStatus("error");
      });

    return () => {
      mounted = false;
      if (googleMapRef.current) {
        googleMapRef.current = null;
      }
    };
  }, [open]);

  // Update markers when segments change
  useEffect(() => {
    if (!googleMapRef.current) return;
    updateMapMarkers();
  }, [segments, activeIndex]);

  function updateMapMarkers() {
    const map = googleMapRef.current;
    if (!map || typeof window === "undefined" || !(window as any).google)
      return;

    const g = (window as any).google;

    // Clear existing
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const bounds = new g.maps.LatLngBounds();

    segments.forEach((seg, i) => {
      const start = { lat: seg.startLat, lng: seg.startLng };
      const end = { lat: seg.endLat, lng: seg.endLng };
      const color = COLORS[i % COLORS.length];

      // marker factory
      const makeIcon = (labelChar: string, opacity = 1) => {
        const size = 28;
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${size / 2}' cy='${size / 2}' r='${size / 2 - 3}' fill='${color}' fill-opacity='${opacity}' stroke='white' stroke-width='3'/><text x='50%' y='52%' text-anchor='middle' fill='white' font-size='12' font-weight='700' font-family='Arial' dy='.2em'>${labelChar}</text></svg>`;
        return {
          url: "data:image/svg+xml;utf8," + encodeURIComponent(svg),
          scaledSize: new g.maps.Size(size, size),
          anchor: new g.maps.Point(size / 2, size / 2),
        };
      };

      const m1 = new g.maps.Marker({
        position: start,
        map,
        draggable: true,
        icon: makeIcon(String.fromCharCode(65 + i) + "S"),
      });
      m1.addListener("dragend", (ev: any) => {
        const latlng = ev.latLng;
        updateSegment(i, {
          startLat: parseFloat(latlng.lat().toFixed(6)),
          startLng: parseFloat(latlng.lng().toFixed(6)),
        });
      });
      markersRef.current.push(m1);
      bounds.extend(new g.maps.LatLng(start.lat, start.lng));

      const m2 = new g.maps.Marker({
        position: end,
        map,
        draggable: true,
        icon: makeIcon(String.fromCharCode(65 + i) + "E", 0.85),
      });
      m2.addListener("dragend", (ev: any) => {
        const latlng = ev.latLng;
        updateSegment(i, {
          endLat: parseFloat(latlng.lat().toFixed(6)),
          endLng: parseFloat(latlng.lng().toFixed(6)),
        });
      });
      markersRef.current.push(m2);
      bounds.extend(new g.maps.LatLng(end.lat, end.lng));

      const polyline = new g.maps.Polyline({
        path: [start, end],
        strokeColor: "#3b82f6",
        strokeOpacity: 0.85,
        strokeWeight: 3,
        map,
      });
      polylinesRef.current.push(polyline);
    });

    if (markersRef.current.length > 0) {
      try {
        map.fitBounds(bounds, { padding: 40 });
      } catch {
        map.fitBounds(bounds);
      }
    }
  }

  function reset() {
    setName("");
    setSegments([emptySegment(0)]);
    setActiveIndex(0);
    setClickMode("start");
  }

  const updateSegment = useCallback(
    (index: number, patch: Partial<NewSegmentInput>) => {
      setSegments((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  function addSegment() {
    setSegments((prev) => [...prev, emptySegment(prev.length)]);
    setActiveIndex((prev) => prev + 1);
    setClickMode("start");
  }

  function removeSegment(index: number) {
    setSegments((prev) => {
      const filtered = prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order: i }));
      return filtered;
    });
    setActiveIndex((prev) =>
      prev >= segments.length - 1 ? Math.max(0, segments.length - 2) : prev,
    );
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    await createRoad.mutateAsync({ name: name.trim(), segments });
    reset();
    onClose();
  }

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Create road"
      description="Add the road name, then define one or more segments. Click the map to place markers."
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            loading={createRoad.isPending}
            disabled={!name.trim()}
          >
            Create road
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="road-name">Road name</Label>
          <Input
            id="road-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bole Road"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="mb-0">Segments</Label>
            <Button
              variant="secondary"
              size="sm"
              onClick={addSegment}
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              Add segment
            </Button>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {segments.map((seg, i) => {
              const isActive = i === activeIndex;
              const color = COLORS[i % COLORS.length];
              return (
                <div
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setClickMode("start");
                  }}
                  className={`rounded-md border p-3 cursor-pointer transition-all ${
                    isActive
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-ink-300"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <Input
                        value={seg.label}
                        onChange={(e) =>
                          updateSegment(i, { label: e.target.value })
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 max-w-[180px] border-0 bg-transparent p-0 font-medium focus-visible:ring-0"
                      />
                    </div>
                    {segments.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSegment(i);
                        }}
                        className="text-ink-400 hover:text-danger"
                        aria-label="Remove segment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {(
                      [
                        "startLat",
                        "startLng",
                        "endLat",
                        "endLng",
                        "speedLimit",
                      ] as const
                    ).map((field) => (
                      <div key={field}>
                        <Label className="text-[11px]">
                          {field === "speedLimit"
                            ? "Speed limit"
                            : field.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Input
                          type="number"
                          step={field === "speedLimit" ? 1 : 0.0001}
                          value={seg[field]}
                          onChange={(e) =>
                            updateSegment(i, {
                              [field]: Number(e.target.value),
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 font-mono text-[13px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label>Map preview</Label>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-ink-500">
              <MapPin className="h-3 w-3" />
              {clickMode === "start"
                ? `Click map to set START for ${activeSegment?.label}`
                : `Click map to set END for ${activeSegment?.label}`}
            </span>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-border">
            <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
            {mapStatus === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 text-ink-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="text-sm">Loading map…</p>
              </div>
            )}
            {mapStatus === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white p-6 text-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <p className="text-sm font-medium text-ink-700">Map couldn't load</p>
                <p className="max-w-xs text-xs text-ink-500">{mapError}</p>
              </div>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-400">
            💡 Click a segment card to select it. Click the map to place Start →
            End points. Drag markers to fine-tune.
          </p>
        </div>
      </div>
    </Dialog>
  );
}