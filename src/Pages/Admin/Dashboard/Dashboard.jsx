import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Home,
  Users,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperty: 0,
    totalUnit: 0,
    totalActiveTenant: 0,
  });

  const [thisMonthSum, setThisMonthSum] = useState(0);
  const [recentPaid, setRecentPaid] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("token");

        const [statsRes, paymentsRes, collectionRes] = await Promise.all([
          axios.get(
            "https://nestpay-backend.onrender.com/api/property/dashboard-stats",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          axios.get(
            "https://nestpay-backend.onrender.com/api/payment/recent-paid",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          axios.get(
            "https://nestpay-backend.onrender.com/api/rentdue/collection",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);

        setStats(statsRes.data.stats);
        setRecentPaid(paymentsRes.data.recentPayment || []);
        setThisMonthSum(collectionRes.data.thisMonthSum || 0);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="p-4 sm:p-6 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">
          Overview of your properties, tenants & revenue
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

        {/* CURRENT MONTH COLLECTION */}
        <StatCard
          icon={<IndianRupee />}
          label={`${currentMonthName} Collection`}
          value={thisMonthSum}
          highlight
          isCurrency
        />
      </div>

      {/* RECENT PAYMENTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">Recent Payments</h2>

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
const StatCard = ({ icon, label, value, highlight, isCurrency }) => (
  <div
    className={`rounded-2xl p-5 flex items-center gap-4 transition
    ${
      highlight
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-white border border-slate-200 hover:shadow-sm"
    }`}
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center
      ${highlight ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}
    >
      {icon}
    </div>

    <div>
      <p
        className={`text-sm font-medium ${
          highlight ? "text-indigo-100" : "text-slate-500"
        }`}
      >
        {label}
      </p>

      <p className="text-2xl font-black">{isCurrency ? ` ${value}` : value}</p>
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
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition">
      <div className="space-y-1">
        <span className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          {payment.rentDueId?.month
            ? formatMonthYear(payment.rentDueId.month)
            : "Unknown Month"}
        </span>

        <p className="font-extrabold text-slate-900 text-sm">
          {payment.tenantId?.tenantName || "Unknown Tenant"}
        </p>

        <p className="text-xs font-semibold text-slate-500">
          {payment.unitId?.unitName || "N/A"} • {paidDate}
        </p>
      </div>

      <div className="text-right space-y-1">
        <p className="font-black text-lg text-slate-900">₹ {payment.amount}</p>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3 h-3" />
          Paid
        </span>
      </div>
    </div>
  );
};

export default AdminDashboard;
