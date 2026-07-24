import { TrendingUp, PieChart } from "lucide-react";
import type { ReportAnalytics } from "./types";
import { REPORT_TYPE_LABELS, REPORT_TYPE_COLORS } from "./types";

export function ReportAnalyticsView({ data }: { data: ReportAnalytics }) {
  const totalReports = data.summary.totalReports;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-ink-900">Recent Activity</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-4">
            <p className="text-sm text-ink-500">Last 24 hours</p>
            <p className="mt-2 text-2xl font-semibold text-ink-900">
              {data.recentActivity.last24Hours}
            </p>
          </div>
          <div className="rounded-lg bg-surface p-4">
            <p className="text-sm text-ink-500">Last 7 days</p>
            <p className="mt-2 text-2xl font-semibold text-ink-900">
              {data.recentActivity.last7Days}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-ink-900">By Type</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(data.byType).map(([type, count]) => {
              const pctNum = totalReports ? (count / totalReports) * 100 : 0;
              const pct = pctNum.toFixed(1);
              const color =
                REPORT_TYPE_COLORS[type as keyof typeof REPORT_TYPE_COLORS];
              const label =
                REPORT_TYPE_LABELS[type as keyof typeof REPORT_TYPE_LABELS];
              return (
                <div key={type}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {label}
                    </span>
                    <span className="font-semibold">
                      {count} <span className="text-ink-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-5">
          <h3 className="mb-4 font-semibold text-ink-900">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-500">Total Reports</span>
              <span className="text-xl font-bold">{totalReports}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-500">Active Reports</span>
              <span className="font-semibold text-emerald-600">
                {data.summary.activeReports}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-sm text-ink-500">Verified Reports</span>
              <span className="font-semibold text-blue-600">
                {data.summary.verifiedReports}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-ink-500">Unverified Reports</span>
              <span className="font-semibold text-rose-600">
                {data.summary.unverifiedReports}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-5">
        <h3 className="mb-4 font-semibold text-ink-900">Top Hotspot Areas</h3>
        <div className="space-y-3">
          {data.topHotspotAreas.length === 0 ? (
            <p className="text-sm text-ink-500">No hotspots available.</p>
          ) : (
            data.topHotspotAreas.map((area, idx) => (
              <div
                key={`${area.lat}-${area.lng}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {idx + 1}. {area.lat.toFixed(3)}, {area.lng.toFixed(3)}
                </span>
                <span className="font-semibold">{area.reportCount}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
