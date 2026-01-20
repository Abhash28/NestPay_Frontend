import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth pages
import Login from "./LoginPage/login";
import Signup from "./LoginPage/SignupPage/Signup";
import ForgetPass from "./LoginPage/ForgetPass/ForgetPass";

// Admin
import AdminLayout from "./layouts/AdminLayouts";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import Property from "./Pages/Admin/Property/Property";
import AddProperty from "./Pages/Admin/Property/AddProperty/AddProperty";
import UnitDetail from "./Pages/Admin/Property/PorpertyDetail/UnitDetail";
import UnitAllocation from "./Pages/Admin/Property/PorpertyDetail/UnitAllocation/UnitAllocation";
import Tenant from "./Pages/Admin/Tenant/Tenant";
import AddTenant from "./Pages/Admin/Tenant/AddTenant/AddTenant";
import TenantDetail from "./Pages/Admin/Tenant/TenantDetail/TenantDetail";
import DeactiveTenant from "./Pages/Admin/Tenant/DeactiveTenant";
import Payment from "./Pages/Admin/Payment/Payment";
import AccountAdmin from "./Pages/Admin/Account/ProfileAdmin";

// Tenant
import TenantLayout from "./layouts/TenantLayout";
import TenantDashboard from "./Pages/Tenant/Dashboard";
import TenantHistory from "./Pages/Tenant/History/TenantHistory";
import TenantNotification from "./Pages/Tenant/Notification/TenantNotification";
import ProfileTenant from "./Pages/Tenant/Account/ProfileTenant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              localStorage.getItem("role") === "admin" ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/tenant" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpass" element={<ForgetPass />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route
          path="/admin-property"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Property />} />
        </Route>

        <Route
          path="/admin/property/add-property"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AddProperty />} />
        </Route>

        <Route
          path="/admin/property/:propertyId/unit-detail"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UnitDetail />} />
        </Route>

        <Route
          path="/admin/property/unit-detail/:propertyId/allocation"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UnitAllocation />} />
        </Route>

        <Route
          path="/admin-tenant"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Tenant />} />
        </Route>

        <Route
          path="/admin-tenant/deactive"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DeactiveTenant />} />
        </Route>

        <Route
          path="/admin-tenant/detail/:tenantId"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantDetail />} />
        </Route>

        <Route
          path="/admin/tenant/add-tenant"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AddTenant />} />
        </Route>

        <Route
          path="/admin-payment"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Payment />} />
        </Route>
        <Route
          path="/admin-account"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountAdmin />} />
        </Route>

        {/* ================= TENANT ROUTES ================= */}
        <Route
          path="/tenant-home"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantDashboard />} />
        </Route>
        <Route
          path="/tenant-history"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantHistory />} />
        </Route>
        <Route
          path="/tenant-notification"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantNotification />} />
        </Route>
        {/*tenant account */}
        <Route
          path="/tenant-account"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileTenant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
