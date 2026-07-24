import { Shield, MapPin, Clock } from "lucide-react";
import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { REPORT_TYPE_LABELS, REPORT_TYPE_COLORS } from "./types";
import type { Report } from "./types";

export function ReportDetailDialog({
  report,
  onClose,
  onVerify,
  onDeactivate,
  onDelete,
}: {
  report: Report | null;
  onClose: () => void;
  onVerify: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (!report) return null;

  const label = REPORT_TYPE_LABELS[report.type];
  const color = REPORT_TYPE_COLORS[report.type];

  return (
    <Dialog
      open={!!report}
      onClose={onClose}
      title={`${label} — Report ${report.id}`}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          {!report.isVerified && report.isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerify(report.id)}
            >
              Verify
            </Button>
          )}
          {report.isActive && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDeactivate(report.id)}
            >
              Deactivate
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(report.id)}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-lg font-semibold">{label}</h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-ink-500">
          <MapPin className="h-4 w-4" />
          <div className="font-mono text-xs">
            {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
          </div>
        </div>

        <div>
          <p className="text-sm text-ink-600">
            {report.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-ink-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>
              {report.isVerified ? (
                <Badge className="bg-blue-100 text-blue-700">Verified</Badge>
              ) : (
                <Badge className="bg-ink-100 text-ink-500">Unverified</Badge>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-xs">
              {new Date(report.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
