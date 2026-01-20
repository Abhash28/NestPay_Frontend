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
  CreditCard,
  ChevronRight,
  ShieldCheck,
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
        // Fetching both APIs at once for better performance
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

        setData(statsRes.data.stats || {});
        setRecentPaid(paymentsRes.data.recentPayment || []);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-indigo-100">
      {/* ===== HEADER SECTION ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight lg:text-4xl">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back, Admin. Here is what’s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 text-sm font-bold w-fit">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          <span>Live System Status</span>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Properties"
          value={data?.totalProperty || 0}
          icon={<Building2 className="w-6 h-6" />}
          color="bg-indigo-600 shadow-indigo-200"
          trend="Portfolio Size"
        />
        <StatCard
          title="Total Units"
          value={data?.totalUnit || 0}
          icon={<Home className="w-6 h-6" />}
          color="bg-blue-600 shadow-blue-200"
          trend="Managed Spaces"
        />
        <StatCard
          title="Active Tenants"
          value={data?.totalActiveTenant || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-emerald-600 shadow-emerald-200"
          trend="Verified Living"
        />
      </div>

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT: Recent Payments List (Spans 2 columns on desktop) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="text-indigo-600" size={22} />
              Recent Transactions
            </h2>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
              View Analytics <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {recentPaid.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <CreditCard size={40} />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">
                  No payments yet
                </h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto mt-1">
                  Once tenants start paying rent, your transaction history will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentPaid.map((payment) => (
                  <div
                    key={payment._id}
                    className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                        <IndianRupee size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg tracking-tight">
                          {payment.tenantId?.tenantName || "Unknown Tenant"}
                        </h4>
                        <p className="text-sm text-slate-500 font-semibold flex items-center gap-1">
                          <Home size={14} className="text-slate-400" />
                          {payment.unitId?.unitName || "Unassigned Unit"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="font-black text-slate-900 text-xl tracking-tighter">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                          payment.status === "Paid"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {payment.status === "Paid" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
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

        {/* RIGHT: Security/Status Card (Matches Login Sidebar) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 px-2">
            Security Status
          </h2>
          <div className="bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 group">
            {/* Glow effect */}
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-indigo-600 rounded-full blur-[90px] opacity-40 group-hover:opacity-60 transition-opacity"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                System Secure
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                Your property data is protected with AES-256 encryption. No
                unauthorized access attempts detected.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Server Health</span>
                  <span className="text-emerald-400">99.9%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[99%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <button className="w-full py-4 bg-white border border-slate-200 rounded-[24px] text-slate-900 font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 shadow-sm transition-all flex items-center justify-center gap-2">
            <TrendingUp size={18} />
            Generate Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- UI Component: Stat Card --- */
const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white p-7 rounded-[32px] border border-slate-200/60 shadow-sm group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
    <div className="flex items-start justify-between mb-6 relative z-10">
      <div
        className={`w-16 h-16 rounded-[22px] ${color} text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
      >
        {icon}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
        {trend}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
        {title}
      </p>
      <h3 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">
        {value}
      </h3>
    </div>
    {/* Subtle card background pattern */}
    <div className="absolute -bottom-4 -right-4 text-slate-50/50 group-hover:text-indigo-50/50 transition-colors">
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
