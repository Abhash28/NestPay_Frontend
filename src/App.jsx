import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./LoginPage/login";
import Signup from "./LoginPage/SignupPage/Signup";
import ForgetPass from "./LoginPage/ForgetPass/ForgetPass";
import AdminLayout from "./layouts/AdminLayouts";
import Dashboard from "../src/Pages/Admin/Dashboard/Dashboard";
import Property from "./Pages/Admin/Property/Property";
import AddProperty from "./Pages/Admin/Property/AddProperty/AddProperty";
import UnitDetail from "./Pages/Admin/Property/PorpertyDetail/UnitDetail";
import Tenant from "./Pages/Admin/Tenant/Tenant";
import AddTenant from "./Pages/Admin/Tenant/AddTenant/AddTenant";
import UnitAllocation from "./Pages/Admin/Property/PorpertyDetail/UnitAllocation/UnitAllocation";
import TenantDetail from "./Pages/Admin/Tenant/TenantDetail/TenantDetail";
import DeactiveTenant from "./Pages/Admin/Tenant/DeactiveTenant";
import Payment from "./Pages/Admin/Payment/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*Public Routes login pages */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgetpass" element={<ForgetPass />}></Route>
        {/*Protected Admin Routes*/}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-dashboard" element={<Dashboard />} />
          {/*Property section */}
          <Route path="/admin-property" element={<Property />} />
          <Route
            path="/admin/property/add-property"
            element={<AddProperty />}
          />
          <Route
            path="/admin/property/:propertyId/unit-detail"
            element={<UnitDetail />}
          ></Route>
          <Route
            path="/admin/property/unit-detail/:propertyId/allocation"
            element={<UnitAllocation />}
          ></Route>
          {/*Tenants section */}
          <Route path="/admin-tenant" element={<Tenant />}></Route>
          <Route
            path="/admin-tenant/deactive"
            element={<DeactiveTenant />}
          ></Route>
          <Route
            path="/admin-tenant/detail/:tenantId"
            element={<TenantDetail />}
          ></Route>
          <Route
            path="/admin/tenant/add-tenant"
            element={<AddTenant />}
          ></Route>
          {/*Payment section */}
          <Route path="/admin-payment" element={<Payment />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
