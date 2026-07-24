import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Shield,
  BarChart3,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { CreateReportDialog } from "./CreateReportDialog";
import { ReportDetailDialog } from "./ReportDetailDialog";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { ReportMap } from "./ReportMap";
import { ReportAnalyticsView } from "./ReportAnalyticsView";
import {
  fetchReports,
  fetchReportAnalytics,
  verifyReport,
  deactivateReport,
  deleteReport,
} from "../../api/report";
import { REPORT_TYPE_LABELS, REPORT_TYPE_COLORS } from "./types";
import type { Report, ReportAnalytics } from "./types";

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Report | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "verify" | "deactivate" | "delete";
    id: string;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "map" | "analytics">("list");

  const load = useCallback(async () => {
    setLoading(true);
    const [r, a] = await Promise.all([fetchReports(), fetchReportAnalytics()]);
    setReports(r);
    setAnalytics(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const params = useParams();
  useEffect(() => {
    if (!params.reportId) return;
    const id = params.reportId;
    const r = reports.find((x) => x.id === id);
    if (r) setSelected(r);
  }, [params.reportId, reports]);

  async function handleVerify(id: string) {
    setConfirmAction({ type: "verify", id });
  }

  async function handleDeactivate(id: string) {
    setConfirmAction({ type: "deactivate", id });
  }

  async function handleDelete(id: string) {
    setConfirmAction({ type: "delete", id });
  }

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.type.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.reporterIp?.includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Reports</h1>
          <p className="text-sm text-ink-500">Manage incident reports.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button
            variant={view === "map" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("map")}
          >
            <MapPin className="mr-1 h-3.5 w-3.5" /> Map
          </Button>
          <Button
            variant={view === "analytics" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("analytics")}
          >
            <BarChart3 className="mr-1 h-3.5 w-3.5" /> Analytics
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="mr-1 h-3.5 w-3.5" /> New
          </Button>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Reports"
            value={analytics.summary.totalReports}
            color="bg-blue-50"
            text="text-blue-700"
          />
          <StatCard
            label="Active Reports"
            value={analytics.summary.activeReports}
            color="bg-amber-50"
            text="text-amber-700"
          />
          <StatCard
            label="Verified Reports"
            value={analytics.summary.verifiedReports}
            color="bg-emerald-50"
            text="text-emerald-700"
          />
          <StatCard
            label="Unverified Reports"
            value={analytics.summary.unverifiedReports}
            color="bg-rose-50"
            text="text-rose-700"
          />
        </div>
      )}

      {view === "list" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-lg border border-border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-50 text-left text-xs font-semibold uppercase text-ink-500">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-ink-400"
                    >
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-ink-400"
                    >
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <ReportRow
                      key={r.id}
                      report={r}
                      busy={busyId === r.id}
                      onVerify={() => handleVerify(r.id)}
                      onDeactivate={() => handleDeactivate(r.id)}
                      onDelete={() => handleDelete(r.id)}
                      onOpenDetails={() => setSelected(r)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === "map" && <ReportMap reports={reports} />}
      {view === "analytics" && analytics && (
        <ReportAnalyticsView data={analytics} />
      )}

      <CreateReportDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={load}
      />
      <ReportDetailDialog
        report={selected}
        onClose={() => setSelected(null)}
        onVerify={async (id) => {
          setConfirmAction({ type: "verify", id });
        }}
        onDeactivate={async (id) => {
          setConfirmAction({ type: "deactivate", id });
        }}
        onDelete={async (id) => {
          setConfirmAction({ type: "delete", id });
        }}
      />

      <ConfirmDialog
        open={!!confirmAction}
        title={
          confirmAction?.type === "delete"
            ? "Delete report"
            : confirmAction?.type === "deactivate"
              ? "Deactivate report"
              : "Verify report"
        }
        description={
          confirmAction?.type === "delete"
            ? "This will permanently remove the report. This action cannot be undone."
            : confirmAction?.type === "deactivate"
              ? "This will mark the report as inactive."
              : "This will mark the report as verified."
        }
        confirmLabel={
          confirmAction?.type === "delete"
            ? "Delete"
            : confirmAction?.type === "deactivate"
              ? "Deactivate"
              : "Verify"
        }
        loading={confirmLoading}
        onCancel={() => setConfirmAction(null)}
        onConfirm={async () => {
          if (!confirmAction) return;
          setConfirmLoading(true);
          const { type, id } = confirmAction;
          try {
            if (type === "delete") await deleteReport(id);
            if (type === "deactivate") await deactivateReport(id);
            if (type === "verify") await verifyReport(id);
            await load();
          } finally {
            setConfirmLoading(false);
            setConfirmAction(null);
          }
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  text,
}: {
  label: string;
  value: number;
  color: string;
  text: string;
}) {
  return (
    <div className={`rounded-lg border border-border p-4 ${color}`}>
      <p className="text-xs font-medium text-ink-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${text}`}>{value}</p>
    </div>
  );
}

function ReportRow({
  report,
  busy,
  onVerify,
  onDeactivate,
  onDelete,
  onOpenDetails,
}: {
  report: Report;
  busy: boolean;
  onVerify: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onOpenDetails?: () => void;
}) {
  const color = REPORT_TYPE_COLORS[report.type];
  const label = REPORT_TYPE_LABELS[report.type];

  return (
    <tr
      className="hover:bg-surface-50"
      onClick={() => onOpenDetails?.()}
      style={{ cursor: "pointer" }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium text-ink-700">{label}</span>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-ink-500">
        {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
      </td>
      <td className="max-w-[200px] px-4 py-3 truncate text-ink-600">
        {report.description || "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1.5">
          {report.isActive ? (
            <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
          ) : (
            <Badge className="bg-ink-100 text-ink-500">Inactive</Badge>
          )}
          {report.isVerified && (
            <Badge className="bg-blue-100 text-blue-700">
              <Shield className="mr-1 h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-ink-500">
        {new Date(report.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          {busy && <Loader2 className="h-4 w-4 animate-spin text-ink-400" />}
          {!report.isVerified && report.isActive && !busy && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-emerald-600"
              onClick={(e) => {
                e.stopPropagation();
                onVerify();
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          {report.isActive && !busy && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-amber-600"
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate();
              }}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
          {!busy && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-rose-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
