import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Users,
  Home,
  IndianRupee,
  Clock,
  CheckCircle2,
  CreditCard,
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium">
          Real-time overview of your property ecosystem.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Property"
          value={data.totalProperty || 0}
          icon={<Building2 className="text-indigo-600" />}
        />
        <StatCard
          label="Total Unit"
          value={data.totalUnit || 0}
          icon={<Home className="text-blue-600" />}
        />
        <StatCard
          label="Active Tenants"
          value={data.totalActiveTenant || 0}
          icon={<Users className="text-emerald-600" />}
        />
      </div>

      {/* RECENT PAYMENTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock size={20} className="text-indigo-600" />
          Recent Payments
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {recentPaid.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center">
              <CreditCard className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 font-medium">
                No recent payments found
              </p>
            </div>
          ) : (
            recentPaid.map((payment) => (
              <div
                key={payment._id}
                className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Tenant Name
                    </p>
                    <h3 className="font-bold text-slate-900">
                      {payment.tenantId?.tenantName || "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-8 sm:gap-12">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Unit
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {payment.unitId?.unitName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Amount
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      ₹{payment.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        payment.status === "Paid"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {payment.status === "Paid" && <CheckCircle2 size={10} />}
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* Internal UI Component for Stats */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
      {label}
    </p>
    <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

export default AdminDashboard;
