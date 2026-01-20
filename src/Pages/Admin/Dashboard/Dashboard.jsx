import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Users,
  Home,
  ArrowUpRight,
  IndianRupee,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [recentPaid, setRecentPaid] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [statsRes, paymentsRes] = await Promise.all([
          axios.get(
            "https://nestpay-backend.onrender.com/api/property/dashboard-stats",
            config,
          ),
          axios.get(
            "https://nestpay-backend.onrender.com/api/payment/recent-paid",
            config,
          ),
        ]);

        setData(statsRes.data.stats);
        setRecentPaid(paymentsRes.data.recentPayment);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* ===== WELCOME SECTION ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back! Here's what's happening with your properties today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 text-sm font-bold">
          <TrendingUp size={16} />
          <span>Real-time Updates</span>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Properties"
          value={data.totalProperty || 0}
          icon={<Building2 className="w-6 h-6" />}
          color="bg-indigo-600"
          trend="+2 this month"
        />
        <StatCard
          title="Total Units"
          value={data.totalUnit || 0}
          icon={<Home className="w-6 h-6" />}
          color="bg-blue-600"
          trend="84% Occupancy"
        />
        <StatCard
          title="Active Tenants"
          value={data.totalActiveTenant || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-emerald-600"
          trend="Verified Users"
        />
      </div>

      {/* ===== RECENT PAYMENTS SECTION ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Payment List (Spans 2 columns) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="text-indigo-600" size={20} />
              Recent Transactions
            </h2>
            <button className="text-sm font-bold text-indigo-600 hover:underline">
              View All
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200/60 overflow-hidden shadow-sm">
            {recentPaid.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <CreditCard size={32} />
                </div>
                <p className="text-slate-400 font-medium">
                  No recent payments recorded yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentPaid.map((payment) => (
                  <div
                    key={payment._id}
                    className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                        <IndianRupee size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {payment.tenantId?.tenantName || "Guest"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {payment.unitId?.unitName || "Unknown Unit"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="font-extrabold text-slate-900 text-lg">
                        ₹{payment.amount}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          payment.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {payment.status === "Paid" && (
                          <CheckCircle2 size={10} />
                        )}
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips or Stats (Spans 1 column) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">System Health</h2>
          <div className="bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
            <div className="relative z-10">
              <CheckCircle2 className="text-indigo-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">
                Everything looks great!
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                All systems are operational. You have 0 pending maintenance
                requests today.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all border border-white/10">
                Generate Report
              </button>
            </div>
            {/* Glow effect matching login page */}
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Refined Stat Card Component --- */
const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
      >
        {icon}
      </div>
      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} />
        {trend}
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
        {value}
      </h3>
    </div>
  </div>
);

export default AdminDashboard;
