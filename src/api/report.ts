import { apiClient } from "./client";
import { MOCK_API, mockResolve } from "./mock";
import type {
  Report,
  CreateReportInput,
  ReportAnalytics,
} from "../features/reports/types";

let mockReports: Report[] = [
  {
    id: "rep_001",
    type: "CRASH",
    lat: 8.9812,
    lng: 38.7545,
    description: "Car accident near Bole Road",
    reporterIp: "192.168.1.1",
    isActive: true,
    isVerified: true,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "rep_002",
    type: "TRAFFIC_JAM",
    lat: 8.9856,
    lng: 38.7601,
    description: "Heavy traffic due to construction",
    reporterIp: "192.168.1.2",
    isActive: true,
    isVerified: false,
    createdAt: "2025-01-16T14:20:00Z",
  },
  {
    id: "rep_003",
    type: "HAZARD",
    lat: 8.9789,
    lng: 38.7489,
    description: "Pothole causing vehicle damage",
    reporterIp: "192.168.1.3",
    isActive: false,
    isVerified: false,
    createdAt: "2025-01-14T09:15:00Z",
  },
];

function getMockAnalytics(): ReportAnalytics {
  const totalReports = mockReports.length;
  const activeReports = mockReports.filter((report) => report.isActive).length;
  const verifiedReports = mockReports.filter(
    (report) => report.isVerified,
  ).length;
  const inactiveReports = totalReports - activeReports;
  const byType = mockReports.reduce<Record<string, number>>((acc, report) => {
    acc[report.type] = (acc[report.type] || 0) + 1;
    return acc;
  }, {});

  const now = new Date();
  const reportsLast24h = mockReports.filter(
    (report) =>
      new Date(report.createdAt) >=
      new Date(now.valueOf() - 24 * 60 * 60 * 1000),
  ).length;
  const reportsLast7Days = mockReports.filter(
    (report) =>
      new Date(report.createdAt) >=
      new Date(now.valueOf() - 7 * 24 * 60 * 60 * 1000),
  ).length;

  const areaClusters: Record<string, number> = {};
  for (const report of mockReports.filter((report) => report.isActive)) {
    const key = `${report.lat.toFixed(3)},${report.lng.toFixed(3)}`;
    areaClusters[key] = (areaClusters[key] || 0) + 1;
  }

  const topHotspotAreas = Object.entries(areaClusters)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([coords, count]) => {
      const [lat, lng] = coords.split(",").map(Number);
      return { lat, lng, reportCount: count };
    });

  return {
    summary: {
      totalReports,
      activeReports,
      inactiveReports,
      verifiedReports,
      unverifiedReports: totalReports - verifiedReports,
    },
    byType,
    recentActivity: {
      last24Hours: reportsLast24h,
      last7Days: reportsLast7Days,
    },
    topHotspotAreas,
  };
}

export async function fetchReports(): Promise<Report[]> {
  if (MOCK_API) return mockResolve([...mockReports]);
  const { data } = await apiClient.get<Report[]>("/reports/all");
  return data;
}

export async function fetchReportAnalytics(): Promise<ReportAnalytics> {
  if (MOCK_API) return mockResolve(getMockAnalytics());
  const { data } = await apiClient.get<ReportAnalytics>("/reports/analytics");
  return data;
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  if (MOCK_API) {
    const report: Report = {
      id: `rep_${Math.random().toString(36).slice(2, 8)}`,
      type: input.type,
      lat: input.lat,
      lng: input.lng,
      description: input.description ?? null,
      reporterIp: "127.0.0.1",
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    mockReports.unshift(report);
    return mockResolve(report);
  }
  const { data } = await apiClient.post<Report>("/reports", input);
  return data;
}

export async function verifyReport(id: string): Promise<Report> {
  if (MOCK_API) {
    const report = mockReports.find((r) => r.id === id);
    if (report) {
      report.isVerified = true;
    }
    return mockResolve(report as Report);
  }
  const { data } = await apiClient.patch<Report>(`/reports/${id}/verify`);
  return data;
}

export async function deactivateReport(id: string): Promise<Report> {
  if (MOCK_API) {
    const report = mockReports.find((r) => r.id === id);
    if (report) {
      report.isActive = false;
    }
    return mockResolve(report as Report);
  }
  const { data } = await apiClient.patch<Report>(`/reports/${id}/deactivate`);
  return data;
}

export async function deleteReport(id: string): Promise<void> {
  if (MOCK_API) {
    const idx = mockReports.findIndex((r) => r.id === id);
    if (idx >= 0) {
      mockReports.splice(idx, 1);
    }
    return mockResolve(undefined);
  }
  await apiClient.delete(`/reports/${id}`);
}
