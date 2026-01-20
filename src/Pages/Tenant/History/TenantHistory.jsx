import React, { useEffect, useState } from "react";
import axios from "axios";
import { IndianRupee, Calendar, CheckCircle2, Wallet } from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const TenantHistory = () => {
  const [rent, setRent] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="text-center text-slate-500 font-semibold">
        Loading payment history…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-lg font-black text-slate-900">Payment History</h1>
        <p className="text-xs text-slate-500">All completed rent payments</p>
      </div>

      {/* ===== HISTORY LIST ===== */}
      {paidRent.length === 0 ? (
        <div
          className="bg-slate-100 text-slate-500 text-sm
                        p-4 rounded-xl text-center"
        >
          No payment history found
        </div>
      ) : (
        <div className="space-y-3">
          {paidRent.map((payment) => (
            <div
              key={payment._id}
              className="bg-white border border-slate-200
                         rounded-xl p-4 space-y-2"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900">
                  {formatMonthYear(payment.rentDueId?.month)}
                </p>

                <span
                  className="flex items-center gap-1
                                 text-emerald-600 text-xs font-black"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Paid
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <IndianRupee className="w-4 h-4 text-slate-400" />₹
                {payment.amount}
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                Due:{" "}
                {payment.rentDueId?.dueDate
                  ? new Date(payment.rentDueId.dueDate).toLocaleDateString()
                  : "—"}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                Paid: {new Date(payment.paidAt).toLocaleDateString()}
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
    </div>
  );
};

export default TenantHistory;
