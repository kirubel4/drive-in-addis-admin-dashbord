import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { RoadsPage } from "./features/roads/RoadsPage";
import { RoadDetailPage } from "./features/roads/RoadDetailPage";
import { SpeedLimitsPage } from "./features/speedLimits/SpeedLimitsPage";
import { ZonesPage } from "./features/zones/ZonesPage";
import { UsersPage } from "./features/users/UsersPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { ReportsPage } from "./features/reports/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/roads" element={<RoadsPage />} />
            <Route path="/roads/:roadId" element={<RoadDetailPage />} />
            <Route path="/speed-limits" element={<SpeedLimitsPage />} />
            <Route path="/zones" element={<ZonesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:reportId" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
