import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Input";
import { createReport } from "../../api/report";
import { ReportType, REPORT_TYPE_LABELS, REPORT_TYPE_COLORS } from "./types";

const TYPES = Object.values(ReportType);

export function CreateReportDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [type, setType] = useState<ReportType>(ReportType.CRASH);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setType(ReportType.CRASH);
    setLat("");
    setLng("");
    setDescription("");
  }

  async function handleSubmit() {
    if (!lat || !lng) return;
    setSubmitting(true);
    await createReport({
      type,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      description: description || undefined,
    });
    setSubmitting(false);
    reset();
    onCreated();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Submit Report"
      description="Report an incident with location details."
      size="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!lat || !lng}
          >
            Submit
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Incident Type</Label>
          <div
            className="mt-1.5 grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label="Incident type"
          >
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  type === t
                    ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/30 shadow-sm"
                    : "border-border bg-white text-ink-600 hover:bg-surface-50"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: REPORT_TYPE_COLORS[t] }}
                />
                {REPORT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="8.9800"
            />
          </div>
          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="0.0001"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="38.7500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="desc">Description</Label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident..."
            maxLength={300}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-right text-xs text-ink-400">
            {description.length}/300
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Reports are reviewed by administrators. False reports may result in
            restrictions.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
