import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Building2,
  Users,
  CreditCard,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Class for Desktop Sidebar Links
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
         : "text-slate-400 hover:bg-slate-800 hover:text-white"
     }`;

  // Class for Mobile Bottom Nav Links
  const mobileLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 transition-all
     ${isActive ? "text-indigo-600" : "text-slate-400"}`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* ===== DESKTOP SIDEBAR (Hidden on Mobile) ===== */}
      <aside className="hidden lg:flex w-72 bg-[#0f172a] text-white flex-col sticky top-0 h-screen">
        <div className="px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NestPay</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 ml-1 font-medium uppercase tracking-widest">
            Administrator
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink to="/admin-dashboard" className={linkClass}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin-property" className={linkClass}>
            <Building2 size={20} /> Properties
          </NavLink>
          <NavLink to="/admin-tenant" className={linkClass}>
            <Users size={20} /> Tenants
          </NavLink>
          <NavLink to="/admin-payment" className={linkClass}>
            <CreditCard size={20} /> Payments
          </NavLink>
          <NavLink to="/admin-account" className={linkClass}>
            <User size={20} /> Account settings
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* TOP BAR (Visible on both, but styled differently) */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Management
            </h2>
            <p className="hidden sm:block text-xs text-slate-500 font-medium">
              Manage your properties and tenants
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={handleLogout}
              className="lg:hidden p-2.5 rounded-full bg-rose-50 text-rose-600"
            >
              <LogOut size={20} />
            </button>
            <div className="hidden sm:block w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm"></div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* ===== MOBILE BOTTOM NAVIGATION (Only visible on Mobile) ===== */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavLink to="/admin-dashboard" className={mobileLinkClass}>
            <LayoutDashboard size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Home
            </span>
          </NavLink>
          <NavLink to="/admin-property" className={mobileLinkClass}>
            <Building2 size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Units
            </span>
          </NavLink>
          <NavLink to="/admin-tenant" className={mobileLinkClass}>
            <Users size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Tenants
            </span>
          </NavLink>
          <NavLink to="/admin-payment" className={mobileLinkClass}>
            <CreditCard size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Pay
            </span>
          </NavLink>
          <NavLink to="/admin-account" className={mobileLinkClass}>
            <User size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Profile
            </span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
