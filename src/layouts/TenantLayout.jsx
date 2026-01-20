import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  History,
  Bell,
  User,
  LogOut,
  Zap,
  ChevronRight,
} from "lucide-react";

const TenantLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Mobile Bottom Tab Style
  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 transition-all duration-300 relative
     ${isActive ? "text-indigo-600 scale-110" : "text-slate-400"}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-indigo-100">
      {/* ===== MOBILE HEADER ===== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            NestPay
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/tenant-notification")}
            className="p-2 relative text-slate-500"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-slate-600" />
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT AREA ===== */}
      {/* pb-24 ensures content isn't hidden behind the floating bottom dock */}
      <main className="flex-1 px-5 py-6 pb-28">
        <div className="max-w-md mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ===== MOBILE BOTTOM DOCK (The iOS Style Bar) ===== */}
      <div className="fixed bottom-6 left-5 right-5 z-50">
        <nav className="bg-slate-900/95 backdrop-blur-xl rounded-[28px] p-3 flex items-center justify-around shadow-2xl shadow-indigo-950/20 border border-white/10">
          <NavLink to="/tenant-home" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Home
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/tenant-history" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <History size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  History
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/tenant-notification" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <Bell size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Alerts
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>

          <NavLink to="/tenant-account" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <User size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Profile
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></span>
                )}
              </>
            )}
          </NavLink>

          {/* Vertical Divider */}
          <div className="w-px h-6 bg-white/10 mx-1"></div>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Exit
            </span>
          </button>
        </nav>
      </div>

      {/* Aesthetic helper for "Notch" or bottom safe area */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TenantLayout;
