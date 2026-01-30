import React, { useEffect, useState } from "react";
import axios from "axios";
import { IndianRupee, Calendar, CheckCircle2, Wallet } from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const TenantHistory = () => {
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] = useState(null);

  // ================= FETCH HISTORY =================
  useEffect(() => {
    const showRentHistory = async () => {
      try {
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/payment/tenant/history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setRent(res.data.paymentHistory || []);
      } catch (error) {
        console.error("Tenant history error:", error);
      } finally {
        setLoading(false);
      }
    };
    showRentHistory();
  }, []);

  // ================= FILTER PAID =================
  const paidRent = rent.filter((r) => r.status === "SUCCESS");

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-slate-500 font-semibold">
        Loading payment history…
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-5 pb-24">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-lg font-black text-slate-900">Payment History</h1>
        <p className="text-xs text-slate-500">All completed rent payments</p>
      </div>

      {/* ===== HISTORY LIST ===== */}
      {paidRent.length === 0 ? (
        <div className="bg-slate-100 text-slate-500 text-sm p-4 rounded-xl text-center">
          No payment history found
        </div>
      ) : (
        <div className="space-y-3">
          {paidRent.map((payment) => (
            <div
              key={payment._id}
              onClick={() => {
                setTransaction(payment);
                setShowModal(true);
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-2
                         cursor-pointer hover:border-indigo-400 hover:shadow-sm transition"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900">
                  {formatMonthYear(payment.rentDueId?.month)}
                </p>

                <span className="flex items-center gap-1 text-emerald-600 text-xs font-black">
                  <CheckCircle2 className="w-4 h-4" />
                  Paid
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <IndianRupee className="w-4 h-4 text-slate-400" />
                {payment.amount}
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                Due:{" "}
                {payment.rentDueId?.dueDate
                  ? new Date(payment.rentDueId.dueDate).toLocaleDateString(
                      "en-IN",
                    )
                  : "—"}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                Paid: {new Date(payment.paidAt).toLocaleDateString("en-IN")}
              </div>

              {/* Method */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <Wallet className="w-4 h-4" />
                {payment.method || "Online"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== TRANSACTION MODAL ===== */}
      {showModal && transaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                Payment Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            {/* Amount */}
            <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">Amount</span>
              <span className="font-black text-slate-900 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {transaction.amount}
              </span>
            </div>

            <DetailRow label="Payment Method" value={transaction.method} />
            <DetailRow label="Status" value="Paid" />
            <DetailRow
              label="Paid On"
              value={new Date(transaction.paidAt).toLocaleDateString("en-IN")}
            />
            <DetailRow
              label="Month"
              value={formatMonthYear(transaction.rentDueId?.month)}
            />
            <DetailRow label="Transaction ID" value={transaction._id} />

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== SMALL COMPONENT ===== */

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-800 truncate max-w-[60%]">
      {value}
    </span>
  </div>
);

export default TenantHistory;
