import { Outlet, NavLink, useNavigate } from "react-router-dom";

const TenantLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-indigo-600 text-white shadow"
         : "text-gray-600 hover:bg-gray-100"
     }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        {/* Brand */}
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">NestPay</h1>
          <p className="text-sm text-gray-500">Tenant Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/tenant-home" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/tenant-history" className={linkClass}>
            History
          </NavLink>
          <NavLink to="/tenant-notification" className={linkClass}>
            Notification
          </NavLink>
          <NavLink to="/tenant-account" className={linkClass}>
            Account
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Tenant Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              T
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;
