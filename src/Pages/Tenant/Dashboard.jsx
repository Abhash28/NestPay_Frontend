import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Home, IndianRupee, Calendar, User, Phone, Wallet } from "lucide-react";
import formatMonthYear from "../../../utils/convertMonth";

/* ================= COMPONENT ================= */

const TenantDashboard = () => {
  const [tenant, setTenant] = useState(null);
  const [rent, setRent] = useState([]);
  const [lastPay, setLastPay] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH ALL DATA ================= */
  const fetchAll = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        const [tenantRes, rentRes, payRes] = await Promise.all([
          axios.get(
            "https://nestpay-backend.onrender.com/api/allocation/tenant/home",
            {
              headers: { Authorization: `Bearer ${token}` },
              signal,
            },
          ),
          axios.get(
            "https://nestpay-backend.onrender.com/api/rentdue/tenant/rent",
            {
              headers: { Authorization: `Bearer ${token}` },
              signal,
            },
          ),
          axios.get(
            "https://nestpay-backend.onrender.com/api/payment/recent/tenant/paid",
            {
              headers: { Authorization: `Bearer ${token}` },
              signal,
            },
          ),
        ]);

        setTenant(tenantRes.data.tenantInfo);
        setRent(rentRes.data.allRent || []);
        setLastPay(payRes.data.recentPayment || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Tenant dashboard error:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const controller = new AbortController();
    fetchAll(controller.signal);
    return () => controller.abort();
  }, [fetchAll]);

  /* ================= FILTER ================= */
  const pendingRent = rent.filter(
    (r) => r.status === "Pending" || r.status === "Overdue",
  );

  /* ================= RAZORPAY ================= */
  const openRazorpay = (orderData) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: "INR",
      name: "NestPay",
      description: "Monthly Rent Payment",
      order_id: orderData.orderId,
      prefill: {
        name: tenant?.tenantName || "",
        contact: tenant?.tenantMobileNo || "",
      },
      readonly: { contact: true },
      handler: async (response) => {
        try {
          await axios.post(
            "https://nestpay-backend.onrender.com/api/payment/verifyPayment",
            response,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          // 🔥 Refresh data only (NO PAGE RELOAD)
          fetchAll();
        } catch {
          alert("Payment verification failed");
        }
      },
    };

    new window.Razorpay(options).open();
  };

  const handlePay = async (rentDueId) => {
    try {
      const res = await axios.post(
        "https://nestpay-backend.onrender.com/api/payment/create-order",
        { rentDueId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      openRazorpay(res.data);
    } catch {
      alert("Unable to initiate payment");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center text-slate-500 font-semibold">
        Unable to load dashboard
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= PROPERTY CARD ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
        <h2 className="text-lg font-black text-slate-900">
          {tenant.propertyId.propertyName}
        </h2>

        <Info icon={<Home />} text={`Unit ${tenant.unitId.unitName}`} />
        <Info icon={<IndianRupee />} text={`₹${tenant.rentAmount} / month`} />
        <Info
          icon={<Calendar />}
          text={`Started on ${new Date(tenant.startDate).toLocaleDateString()}`}
        />
        <Info icon={<User />} text={`Owner: ${tenant.adminId.name}`} />
        <Info icon={<Phone />} text={tenant.adminId.mobileNo} />
      </div>

      {/* ================= RENT DUE ================= */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
          Rent Due
        </h3>

        {pendingRent.length === 0 ? (
          <div className="bg-emerald-50 text-emerald-700 font-semibold p-4 rounded-xl">
            No pending rent 🎉
          </div>
        ) : (
          pendingRent.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <p className="font-black text-slate-900">
                  {formatMonthYear(r.month)}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">
                    ₹{r.totalAmount || r.rentAmount}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Due on{" "}
                <span className="font-bold">
                  {new Date(r.dueDate).toLocaleDateString()}
                </span>
              </p>

              {r.status === "Overdue" && r.fineAmount > 0 && (
                <p className="text-xs text-rose-600 font-semibold">
                  Late fee included: ₹{r.fineAmount}
                </p>
              )}

              <button
                onClick={() => handlePay(r._id)}
                className="w-full bg-indigo-600 text-white font-black py-3 rounded-xl
                           flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Wallet className="w-5 h-5" />
                Pay Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* ================= LAST PAYMENT ================= */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">
          Last Payment
        </h3>

        {lastPay.length === 0 ? (
          <p className="text-slate-500 text-sm">No payment history available</p>
        ) : (
          lastPay.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-2"
            >
              <p className="font-black text-slate-900">
                {formatMonthYear(p.rentDueId?.month)}
              </p>

              <p className="text-sm text-slate-600">
                Paid ₹{p.amount} on {new Date(p.paidAt).toLocaleDateString()}
              </p>

              <p
                className={`text-xs font-black ${
                  p.status === "SUCCESS" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {p.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ================= SMALL UI COMPONENTS ================= */

const Info = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-slate-400">{icon}</span>
    <span>{text}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const base =
    "px-2 py-1 rounded-full text-xs font-black uppercase tracking-wide";

  const styles = {
    Pending: "bg-amber-100 text-amber-700",
    Overdue: "bg-rose-100 text-rose-700",
    Paid: "bg-emerald-100 text-emerald-700",
  };

  return <span className={`${base} ${styles[status]}`}>{status}</span>;
};

export default TenantDashboard;
