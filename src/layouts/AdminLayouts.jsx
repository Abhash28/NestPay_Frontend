import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  User,
  LogOut,
  Bell,
  Search,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Premium Link Style: No heavy background, just a clean indicator
  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-4 px-6 py-4 transition-all duration-300 group
     ${
       isActive
         ? "text-indigo-600 font-bold"
         : "text-slate-500 hover:text-slate-900 font-medium"
     }`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* ===== DESKTOP NAVIGATION (Floating Glass Sidebar) ===== */}
      <aside className="hidden lg:flex w-80 flex-col p-6 sticky top-0 h-screen">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200/60 flex flex-col h-full overflow-hidden">
          {/* Logo Section */}
          <div className="p-8 pb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                NestPay
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            <SidebarLink
              to="/admin-dashboard"
              icon={<LayoutDashboard size={22} />}
              label="Dashboard"
              isActive={linkClass}
            />
            <SidebarLink
              to="/admin-property"
              icon={<Building2 size={22} />}
              label="Properties"
              isActive={linkClass}
            />
            <SidebarLink
              to="/admin-tenant"
              icon={<Users size={22} />}
              label="Tenants"
              isActive={linkClass}
            />
            <SidebarLink
              to="/admin-payment"
              icon={<CreditCard size={22} />}
              label="Payments"
              isActive={linkClass}
            />
            <SidebarLink
              to="/admin-account"
              icon={<User size={22} />}
              label="Settings"
              isActive={linkClass}
            />
          </nav>

          {/* Bottom Profile/Logout Section */}
          <div className="p-6 mt-auto">
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-500 truncate">nestpay.admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-100 text-rose-500 font-bold text-sm hover:bg-rose-50 transition-all active:scale-95"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Cinematic Header */}
        <header className="px-6 lg:px-12 py-6 flex justify-between items-center bg-[#f8fafc]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">NestPay</span>
          </div>

          <div className="hidden lg:flex items-center bg-white border border-slate-200 px-4 py-2 rounded-2xl w-96 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <Search className="text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties, tenants..."
              className="bg-transparent border-none outline-none px-3 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
            <div
              className="lg:hidden w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="px-6 lg:px-12 pb-24 lg:pb-12">
          <Outlet />
        </main>

        {/* ===== MOBILE DOCK (Bottom Nav) ===== */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
          <nav className="bg-slate-900/95 backdrop-blur-lg rounded-[24px] px-4 py-3 flex items-center justify-between shadow-2xl shadow-indigo-900/20">
            <MobileNavLink
              to="/admin-dashboard"
              icon={<LayoutDashboard size={22} />}
            />
            <MobileNavLink
              to="/admin-property"
              icon={<Building2 size={22} />}
            />
            <MobileNavLink to="/admin-tenant" icon={<Users size={22} />} />
            <MobileNavLink
              to="/admin-payment"
              icon={<CreditCard size={22} />}
            />
            <MobileNavLink to="/admin-account" icon={<User size={22} />} />
          </nav>
        </div>
      </div>
    </div>
  );
};

/* --- Helper Components for Cleanliness --- */

const SidebarLink = ({ to, icon, label, isActive }) => (
  <NavLink to={to} className={isActive}>
    {({ isActive }) => (
      <>
        {/* Active Indicator Bar */}
        {isActive && (
          <div className="absolute left-0 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
        )}
        <span
          className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-900"} transition-colors`}
        >
          {icon}
        </span>
        {label}
      </>
    )}
  </NavLink>
);

const MobileNavLink = ({ to, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/40" : "text-slate-400"}`
    }
  >
    {icon}
  </NavLink>
);

export default AdminLayout;
