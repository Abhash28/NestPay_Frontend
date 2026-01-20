import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Users,
  CreditCard,
  Bell,
  FileText,
  User,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-blue-600 text-white shadow"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🏠 <span>NestPay</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <NavLink to="/admin-dashboard" className={linkClass}>
            <Home size={18} /> Dashboard
          </NavLink>

          <NavLink to="/admin-property" className={linkClass}>
            <Building2 size={18} /> Properties
          </NavLink>

          <NavLink to="/admin-tenant" className={linkClass}>
            <Users size={18} /> Tenants
          </NavLink>

          <NavLink to="/admin-payment" className={linkClass}>
            <CreditCard size={18} /> Payments
          </NavLink>

          <NavLink to="/" className={linkClass}>
            <Bell size={18} /> Notifications
          </NavLink>

          <NavLink to="/" className={linkClass}>
            <FileText size={18} /> Reports
          </NavLink>

          <NavLink to="/admin-account" className={linkClass}>
            <User size={18} /> Account
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
