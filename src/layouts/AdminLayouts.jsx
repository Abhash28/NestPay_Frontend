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
  Zap,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Premium Link Style: Matches the "Sign In" button hover feel
  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-4 px-6 py-4 transition-all duration-300 group
     ${
       isActive
         ? "text-indigo-600 font-bold"
         : "text-slate-500 hover:text-slate-900 font-medium"
     }`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-indigo-100">
      {/* ===== DESKTOP NAVIGATION (Cinematic Sidebar) ===== */}
      <aside className="hidden lg:flex w-80 flex-col p-6 sticky top-0 h-screen">
        <div className="bg-[#0f172a] rounded-[32px] shadow-2xl shadow-slate-200 flex flex-col h-full overflow-hidden relative">
          {/* Animated Background Glow (Same as Login Page) */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-indigo-600 rounded-full blur-[80px]"></div>
          </div>

          {/* Logo Section */}
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Building2 className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                NestPay
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Admin v2.0
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="relative z-10 flex-1 px-4 space-y-1 mt-4">
            <SidebarLink
              to="/admin-dashboard"
              icon={<LayoutDashboard size={22} />}
              label="Dashboard"
            />
            <SidebarLink
              to="/admin-property"
              icon={<Building2 size={22} />}
              label="Properties"
            />
            <SidebarLink
              to="/admin-tenant"
              icon={<Users size={22} />}
              label="Tenants"
            />
            <SidebarLink
              to="/admin-payment"
              icon={<CreditCard size={22} />}
              label="Payments"
            />
            <SidebarLink
              to="/admin-account"
              icon={<User size={22} />}
              label="Profile"
            />
          </nav>

          {/* Bottom Logout Card */}
          <div className="relative z-10 p-6 mt-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-tighter">
                Current Session
              </p>
              <p className="text-white text-sm font-bold truncate">
                Admin Manager
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-sm transition-all active:scale-95"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Cinematic Header */}
        <header className="px-6 lg:px-12 py-6 flex justify-between items-center bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-indigo-400 w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              NestPay
            </span>
          </div>

          {/* Search Bar: Styled like your login inputs */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl w-96 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-600/20 transition-all group">
            <Search className="text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search data..."
              className="bg-transparent border-none outline-none px-3 text-sm w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 shadow-sm hover:text-indigo-600 hover:border-indigo-100 transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <div
              className="lg:hidden w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-6 lg:px-12 py-8 pb-32 lg:pb-12">
          <Outlet />
        </main>

        {/* ===== MOBILE DOCK (The iOS-Style floating bar) ===== */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
          <nav className="bg-[#0f172a]/95 backdrop-blur-xl rounded-[28px] p-2 flex items-center justify-between shadow-2xl shadow-indigo-950/40 border border-white/10">
            <MobileNavLink
              to="/admin-dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Home"
            />
            <MobileNavLink
              to="/admin-property"
              icon={<Building2 size={20} />}
              label="Units"
            />
            <MobileNavLink
              to="/admin-tenant"
              icon={<Users size={20} />}
              label="People"
            />
            <MobileNavLink
              to="/admin-payment"
              icon={<CreditCard size={20} />}
              label="Bills"
            />
            <MobileNavLink
              to="/admin-account"
              icon={<User size={20} />}
              label="Me"
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

/* --- Refined Sub-Components --- */

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group
     ${
       isActive
         ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
         : "text-slate-400 hover:text-white hover:bg-white/5"
     }`
    }
  >
    <span className="transition-transform group-hover:scale-110 duration-300">
      {icon}
    </span>
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </NavLink>
);

const MobileNavLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 px-4 py-3 rounded-[20px] transition-all duration-300
     ${
       isActive
         ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105"
         : "text-slate-500 hover:text-slate-300"
     }`
    }
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">
      {label}
    </span>
  </NavLink>
);

export default AdminLayout;
