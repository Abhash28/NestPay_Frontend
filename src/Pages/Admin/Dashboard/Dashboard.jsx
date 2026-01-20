import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Home,
  Users,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperty: 0,
    totalUnit: 0,
    totalActiveTenant: 0,
  });
  const [recentPaid, setRecentPaid] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/property/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setStats(res.data.stats);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    const fetchRecentPaid = async () => {
      try {
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/payment/recent-paid",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setRecentPaid(res.data.recentPayment || []);
      } catch (err) {
        console.error("Recent payment error:", err);
      }
    };

    fetchDashboardStats();
    fetchRecentPaid();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* ===== PAGE HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Overview of your properties & payments
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Building2 />}
          label="Total Properties"
          value={stats.totalProperty}
        />
        <StatCard icon={<Home />} label="Total Units" value={stats.totalUnit} />
        <StatCard
          icon={<Users />}
          label="Active Tenants"
          value={stats.totalActiveTenant}
        />
      </div>

      {/* ===== RECENT PAYMENTS ===== */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">Recent Payments</h2>

        {recentPaid.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 font-medium">
            No recent payments
          </div>
        ) : (
          <div className="space-y-3">
            {recentPaid.map((payment) => (
              <div
                key={payment._id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">
                    {payment.tenantId?.tenantName || "Unknown Tenant"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Unit: {payment.unitId?.unitName || "N/A"}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-black text-slate-900 flex items-center gap-1 justify-end">
                    <IndianRupee className="w-4 h-4" />
                    {payment.amount}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== Reusable Stat Card ===== */
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
