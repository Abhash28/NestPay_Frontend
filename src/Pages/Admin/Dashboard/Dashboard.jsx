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
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setPageLoading(true);

        const [statsRes, paymentsRes] = await Promise.all([
          axios.get("https://nest-pay.in/api/property/dashboard-stats", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("https://nest-pay.in/api/payment/recent-paid", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setStats(statsRes.data.stats);
        setRecentPaid(paymentsRes.data.recentPayment || []);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ===== SIMPLE PAGE LOADER ===== */
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Overview of your properties & payments
        </p>
      </div>

      {/* ===== STATS ===== */}
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
              <RecentPaymentCard key={payment._id} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== STAT CARD ===== */
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

/* ===== RECENT PAYMENT CARD ===== */
const RecentPaymentCard = ({ payment }) => {
  const paidDate = new Date(payment.paidAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
      {/* LEFT */}
      <div>
        <p className="font-extrabold text-slate-900">
          {payment.tenantId?.tenantName || "Unknown Tenant"}
        </p>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Unit {payment.unitId?.unitName || "N/A"} • {paidDate}
        </p>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <p className="font-black text-lg text-slate-900 flex items-center justify-end gap-1">
          <IndianRupee className="w-4 h-4" />
          {payment.amount}
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-1">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </span>
      </div>
    </div>
  );
};

export default AdminDashboard;
