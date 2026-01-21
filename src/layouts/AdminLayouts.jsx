import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
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

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition
     ${isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}`;

  const sidebarLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3 rounded-xl font-semibold transition
     ${
       isActive
         ? "bg-indigo-50 text-indigo-600"
         : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
     }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200 px-4 py-6 fixed top-0 left-0 h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-900">NestPay</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <NavLink to="/admin-dashboard" className={sidebarLinkClass}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink to="/admin-property" className={sidebarLinkClass}>
            <Building2 className="w-5 h-5" />
            Properties
          </NavLink>

          <NavLink to="/admin-tenant" className={sidebarLinkClass}>
            <Users className="w-5 h-5" />
            Tenants
          </NavLink>

          <NavLink to="/admin-payment" className={sidebarLinkClass}>
            <CreditCard className="w-5 h-5" />
            Payments
          </NavLink>

          <NavLink to="/admin-account" className={sidebarLinkClass}>
            <User className="w-5 h-5" />
            Profile
          </NavLink>
        </nav>

        {/* Logout (Desktop) */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-5 py-3 text-rose-600 font-semibold hover:bg-rose-50 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* ================= MOBILE TOP NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white border-b border-slate-200 h-14 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-slate-900">NestPay</span>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 lg:ml-72 px-4 lg:px-8 pt-20 pb-28 lg:pt-6 lg:pb-6">
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200">
        <div className="grid grid-cols-6 h-16">
          <NavLink to="/admin-dashboard" className={navLinkClass}>
            <LayoutDashboard className="w-5 h-5" />
            Home
          </NavLink>

          <NavLink to="/admin-property" className={navLinkClass}>
            <Building2 className="w-5 h-5" />
            Property
          </NavLink>

          <NavLink to="/admin-tenant" className={navLinkClass}>
            <Users className="w-5 h-5" />
            Tenant
          </NavLink>

          <NavLink to="/admin-payment" className={navLinkClass}>
            <CreditCard className="w-5 h-5" />
            Pay
          </NavLink>

          <NavLink to="/admin-account" className={navLinkClass}>
            <User className="w-5 h-5" />
            Profile
          </NavLink>

          {/* Logout (Mobile Bottom) */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-rose-500"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminLayout;
