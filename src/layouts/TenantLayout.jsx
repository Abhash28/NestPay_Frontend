import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, History, Bell, User, LogOut, Zap } from "lucide-react";
import { memo } from "react";

const TenantLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  /* ===== Bottom Tab Style ===== */
  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 transition-all relative
     ${isActive ? "text-indigo-400 scale-110" : "text-slate-400"}`;

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans">
      {/* ================= FIXED HEADER ================= */}
      <header
        className="fixed top-0 left-0 right-0 z-40
                   bg-white/80 backdrop-blur-xl
                   border-b border-slate-100"
      >
        <div className="max-w-md mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black text-slate-900">NestPay</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/tenant/notification")}
              className="relative p-2 text-slate-500"
            >
              <Bell size={22} />
              <span
                className="absolute top-2 right-2 w-2 h-2
                           bg-rose-500 rounded-full
                           border-2 border-white"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main
        className="flex-1 overflow-y-auto
                   pt-[76px] pb-[130px]"
      >
        <div className="max-w-md mx-auto px-5 py-6">
          <Outlet />
        </div>
      </main>

      {/* ================= FIXED BOTTOM DOCK ================= */}
      <div className="fixed bottom-4 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4">
          <nav
            className="bg-slate-900/95 backdrop-blur-xl
                       rounded-[28px] px-4 py-3
                       flex items-center justify-between
                       shadow-2xl border border-white/10"
          >
            <NavLink to="/tenant" end className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase">Home</span>
                </>
              )}
            </NavLink>

            <NavLink to="/tenant/history" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <History size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase">
                    History
                  </span>
                </>
              )}
            </NavLink>

            <NavLink to="/tenant/notification" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <Bell size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase">
                    Alerts
                  </span>
                </>
              )}
            </NavLink>

            <NavLink to="/tenant/account" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <User size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase">
                    Profile
                  </span>
                </>
              )}
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1
                         text-rose-400 hover:text-rose-300"
            >
              <LogOut size={22} />
              <span className="text-[10px] font-bold uppercase">Exit</span>
            </button>
          </nav>
        </div>
      </div>

      {/* ================= SAFE AREA GRADIENT ================= */}
      <div
        className="fixed bottom-0 left-0 right-0 h-6
                   bg-gradient-to-t from-white to-transparent
                   pointer-events-none"
      />
    </div>
  );
};

/*  Prevent unnecessary re-renders */
export default memo(TenantLayout);
