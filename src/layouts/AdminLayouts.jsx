import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  //manage state when logout without refreashing not go to login page that whay adding state
  const [loggedOut, setloggedOut] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setloggedOut(true);
  };

  if (loggedOut) {
    return navigate("/login");
  }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <nav className="flex flex-col gap-4">
          <Link to="/admin-dashboard" className="hover:text-yellow-400">
            Dashboard
          </Link>
          <Link to="/admin-property" className="hover:text-yellow-400">
            Property
          </Link>
          <Link to="/admin-tenant" className="hover:text-yellow-400">
            Tenant
          </Link>
          <Link to="/admin-payment" className="hover:text-yellow-400">
            Payment
          </Link>
          <Link className="hover:text-yellow-400">Notification</Link>{" "}
          <Link className="hover:text-yellow-400">Report</Link>{" "}
          <Link className="hover:text-yellow-400">Account</Link>
          <Link className="hover:text-yellow-400" onClick={handleLogout}>
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
