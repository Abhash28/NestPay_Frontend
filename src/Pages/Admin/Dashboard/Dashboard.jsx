import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Users,
  Home,
  ArrowUpRight,
  Receipt,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [recentPaid, setRecentPaid] = useState([]);

  useEffect(() => {
    const dashboardStats = async () => {
      try {
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/property/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setData(res.data.stats);
      } catch (error) {
        console.log(error);
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
        setRecentPaid(res.data.recentPayment);
      } catch (error) {
        console.log(error);
      }
    };

    dashboardStats();
    fetchRecentPaid();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Portfolio <span className="text-indigo-600">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back, manager. Here is what's happening today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Properties"
          value={data.totalProperty || 0}
          icon={<Building2 size={24} />}
          accent="bg-indigo-600"
        />
        <StatCard
          label="Inventory Units"
          value={data.totalUnit || 0}
          icon={<Home size={24} />}
          accent="bg-slate-900"
        />
        <StatCard
          label="Active Tenants"
          value={data.totalActiveTenant || 0}
          icon={<Users size={24} />}
          accent="bg-emerald-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white shadow-sm rounded-xl text-indigo-600 border border-slate-200">
              <Receipt size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Recent Settlements
            </h2>
          </div>
        </div>

        <div className="p-2">
          {recentPaid.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium italic">
                No recent transactions detected in this cycle.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2 px-4">
                <thead>
                  <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                    <th className="px-6 py-3">Tenant Details</th>
                    <th className="px-6 py-3">Unit</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPaid.map((payment) => (
                    <tr
                      key={payment._id}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 bg-white first:rounded-l-2xl border-y border-l border-slate-100 group-hover:border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                            {payment.tenantId?.tenantName?.charAt(0) || "?"}
                          </div>
                          <span className="font-bold text-slate-900 uppercase text-sm">
                            {payment.tenantId?.tenantName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-y border-slate-100 group-hover:border-indigo-100 font-medium text-slate-500">
                        {payment.unitId?.unitName || "N/A"}
                      </td>
                      <td className="px-6 py-4 bg-white border-y border-slate-100 group-hover:border-indigo-100">
                        <span className="font-black text-slate-900">
                          ₹{payment.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-white last:rounded-r-2xl border-y border-r border-slate-100 group-hover:border-indigo-100 text-right">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            payment.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {payment.status === "Paid" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {payment.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Reusable Components --- */

const StatCard = ({ label, value, icon, accent }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm relative group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden">
    <div
      className={`absolute top-0 right-0 w-24 h-24 ${accent} opacity-[0.03] rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500`}
    ></div>

    <div
      className={`${accent} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20`}
    >
      {icon}
    </div>

    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-1">
      {label}
    </p>

    <div className="flex items-end justify-between">
      <h3 className="text-4xl font-black tracking-tighter text-slate-900">
        {value}
      </h3>
      <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
        <ArrowUpRight
          size={18}
          className="text-slate-300 group-hover:text-indigo-600"
        />
      </div>
    </div>
  </div>
);

export default AdminDashboard;
