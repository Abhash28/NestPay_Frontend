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
import PaymentHistory from "./Pages/Admin/Payment/PaymentHistory";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            token ? (
              role === "admin" ? (
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
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/admin-property" element={<Property />} />
          <Route
            path="/admin/property/add-property"
            element={<AddProperty />}
          />
          <Route
            path="/admin/property/:propertyId/unit-detail"
            element={<UnitDetail />}
          />
          <Route
            path="/admin/property/:propertyId/unit-detail/allocation"
            element={<UnitAllocation />}
          />
          <Route path="/admin-tenant" element={<Tenant />} />
          <Route path="/admin-tenant/deactive" element={<DeactiveTenant />} />
          <Route
            path="/admin-tenant/detail/:tenantId"
            element={<TenantDetail />}
          />
          <Route path="/admin/tenant/add-tenant" element={<AddTenant />} />
          <Route path="/admin-payment" element={<Payment />} />
          <Route path="/admin-payment-history" element={<PaymentHistory />} />
          <Route path="/admin-account" element={<AccountAdmin />} />
        </Route>

        {/* ================= TENANT ROUTES ================= */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantDashboard />} />
          <Route path="history" element={<TenantHistory />} />
          <Route path="notification" element={<TenantNotification />} />
          <Route path="account" element={<ProfileTenant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
