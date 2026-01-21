import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  Calendar,
  Home,
  User,
  Clock,
  Wallet,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const Payment = () => {
  const navigate = useNavigate();

  const [rentDues, setRentDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCashModal, setShowCashModal] = useState(false);
  const [selectedDue, setSelectedDue] = useState(null);
  const [cashLoading, setCashLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const getDues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/rentdue/alldue",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setRentDues(res.data.rentDues || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load rent dues");
      } finally {
        setLoading(false);
      }
    };
    getDues();
  }, []);

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
      handler: async (response) => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "https://nestpay-backend.onrender.com/api/payment/verifyPayment",
            response,
            { headers: { Authorization: `Bearer ${token}` } },
          );
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      openRazorpay(res.data);
    } catch {
      alert("Unable to initiate payment");
    }
  };

  /* ================= CASH ================= */
  const confirmCashPayment = async () => {
    try {
      setCashLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "https://nestpay-backend.onrender.com/api/payment/cash",
        { rentDueId: selectedDue._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Cash payment failed");
    } finally {
      setCashLoading(false);
      setShowCashModal(false);
    }
  };

  /* ================= PAGE LOADER ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading rent dues…
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 max-w-3xl mx-auto pb-24">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Rent Dues</h1>
          <p className="text-xs text-slate-500">
            Pending, overdue & completed payments
          </p>
        </div>

        <button
          onClick={() => navigate("/admin-payment-history")}
          className="text-indigo-600 font-black text-sm"
        >
          History →
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm font-bold p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ===== LIST ===== */}
      {rentDues.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No rent dues found
        </div>
      ) : (
        <div className="space-y-4">
          {rentDues.map((due) => {
            return (
              <div
                key={due._id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2"
              >
                {/* Amount + Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-black text-slate-900">
                    <IndianRupee className="w-4 h-4" />
                    {due.rentAmount}
                  </div>
                  <StatusBadge status={due.status} />
                </div>

                {/* Tenant + Month */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="truncate flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {due.tenantId?.tenantName || "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatMonthYear(due.month)}
                  </span>
                </div>

                {/* Property + Due date */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    {due.propertyId?.propertyName} · {due.unitId?.unitName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Due {new Date(due.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                {due.status !== "Paid" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handlePay(due._id)}
                      className="flex-1 bg-indigo-600 text-white
                                 font-black py-2 rounded-lg text-xs"
                    >
                      Pay Online
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDue(due);
                        setShowCashModal(true);
                      }}
                      className="px-3 rounded-lg border border-slate-300 text-slate-600"
                      title="Mark as cash payment"
                    >
                      <Wallet className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CASH CONFIRM MODAL (BOTTOM NAV SAFE) ===== */}
      {showCashModal && selectedDue && (
        <div
          className="fixed inset-0 z-50 bg-black/40
                     flex items-end sm:items-center justify-center
                     pb-24 sm:pb-0"
        >
          <div
            className="bg-white w-full sm:max-w-sm
                          rounded-t-2xl sm:rounded-2xl relative"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-black">Confirm Cash Payment</h3>
            </div>

            {/* Body */}
            <div className="p-4 space-y-2 text-sm text-slate-700">
              <p>
                Are you sure you want to mark this rent as <b>paid by cash</b>?
              </p>

              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1">
                <p>
                  <b>Tenant:</b> {selectedDue.tenantId?.tenantName}
                </p>
                <p>
                  <b>Amount:</b> ₹{selectedDue.rentAmount}
                </p>
                <p>
                  <b>Month:</b> {formatMonthYear(selectedDue.month)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t px-4 py-3 pb-6 flex gap-2 bg-white">
              <button
                onClick={() => setShowCashModal(false)}
                className="flex-1 border border-slate-300
                           rounded-xl py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                onClick={confirmCashPayment}
                disabled={cashLoading}
                className="flex-1 bg-amber-600 text-white
                           rounded-xl py-3 text-sm font-black
                           flex items-center justify-center gap-2"
              >
                {cashLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== STATUS BADGE ===== */
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
