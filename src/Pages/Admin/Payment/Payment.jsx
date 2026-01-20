import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Calendar, Home, User, Clock, Wallet } from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const Payment = () => {
  const navigate = useNavigate();
  const [rentDues, setRentDues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/rentdue/alldue",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setRentDues(res.data.rentDues || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getDues();
  }, []);

  // ================= Razorpay =================
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
      handler: async function (response) {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "https://nestpay-backend.onrender.com/api/payment/verifyPayment",
            response,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          alert("Payment Successful");
          window.location.reload();
        } catch {
          alert("Payment verification failed");
        }
      },
    };

    new window.Razorpay(options).open();
  };

  const handlePay = async (rentDueId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://nestpay-backend.onrender.com/api/payment/create-order",
        { rentDueId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      openRazorpay(res.data);
    } catch {
      alert("Unable to initiate payment");
    }
  };

  const handleCash = async (rentDueId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://nestpay-backend.onrender.com/api/payment/cash",
        { rentDueId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Cash payment recorded");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Cash payment failed");
    }
  };

  if (loading)
    return <div className="p-4 text-slate-500">Loading rent dues…</div>;

  return (
    <div className="p-4 space-y-5 max-w-3xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Rent Dues</h1>
          <p className="text-xs text-slate-500">Pending & completed payments</p>
        </div>

        <button
          onClick={() => navigate("/admin-payment-history")}
          className="text-indigo-600 font-black text-sm"
        >
          History →
        </button>
      </div>

      {/* ===== LIST ===== */}
      {rentDues.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No rent dues found
        </div>
      ) : (
        <div className="space-y-4">
          {rentDues.map((due) => (
            <div
              key={due._id}
              className="bg-white border border-slate-200 rounded-lg p-3 space-y-2"
            >
              {/* Row 1: Amount + Status */}
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900 text-sm">
                  ₹{due.rentAmount}
                </p>
                <StatusBadge status={due.status} />
              </div>

              {/* Row 2: Tenant + Month */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="truncate flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {due.tenantId?.tenantName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatMonthYear(due.month)}
                </span>
              </div>

              {/* Row 3: Property + Due Date */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="truncate flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  {due.propertyId?.propertyName} · {due.unitId?.unitName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(due.dueDate).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              {due.status !== "Paid" && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handlePay(due._id)}
                    className="flex-1 bg-indigo-600 text-white font-black py-2 rounded-lg text-xs"
                  >
                    Pay
                  </button>

                  <button
                    onClick={() => handleCash(due._id)}
                    className="px-3 rounded-lg border border-slate-300 text-slate-600"
                  >
                    <Wallet className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== Small UI ===== */

const InfoRow = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{value || "—"}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Overdue"
        ? "bg-rose-50 text-rose-600"
        : "bg-amber-50 text-amber-600";

  return (
    <span className={`text-xs font-black px-3 py-1 rounded-full ${styles}`}>
      {status}
    </span>
  );
};

export default Payment;
