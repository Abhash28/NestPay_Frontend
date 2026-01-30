import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, Home, IndianRupee, Clock } from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const PaymentHistory = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");

  const [rentHistory, setRentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] = useState(null);

  /* ===== FETCH PAYMENT HISTORY ===== */
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (month && year) {
        params.month = month;
        params.year = year;
      }
      if (status) params.status = status;

      const res = await axios.get(
        "https://nestpay-backend.onrender.com/api/payment/history",
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setRentHistory(res.data.rentDue || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  /* ===== FETCH TRANSACTION DETAIL ===== */
  const fetchTransactionDetail = async (rentDueId) => {
    try {
      const res = await axios.get(
        `https://nestpay-backend.onrender.com/api/payment/transaction-detail/${rentDueId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setTransaction(res.data.detail);
      setShowModal(true);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [month, year, status]);

  /* ===== LOADER ===== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading payment history…
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-5 pb-24">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Payment History</h1>
        <p className="text-xs text-slate-500">Track all rent payments</p>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-2 overflow-x-auto">
        <Select value={month} onChange={setMonth} placeholder="Month">
          <option value="01">Jan</option>
          <option value="02">Feb</option>
          <option value="03">Mar</option>
          <option value="04">Apr</option>
          <option value="05">May</option>
          <option value="06">Jun</option>
          <option value="07">Jul</option>
          <option value="08">Aug</option>
          <option value="09">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
        </Select>

        <Select value={year} onChange={setYear} placeholder="Year">
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </Select>

        <Select value={status} onChange={setStatus} placeholder="Status">
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </Select>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm font-bold p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ===== PAYMENT LIST ===== */}
      {rentHistory.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No payment records found
        </div>
      ) : (
        <div className="space-y-3">
          {rentHistory.map((rent) => {
            const isPaid = rent.status === "Paid";

            return (
              <div
                key={rent._id}
                onClick={
                  isPaid ? () => fetchTransactionDetail(rent._id) : undefined
                }
                className={`
                  bg-white border border-slate-200 rounded-xl p-3 space-y-2 transition
                  ${
                    isPaid
                      ? "cursor-pointer hover:border-indigo-400 hover:shadow-sm"
                      : "opacity-50 cursor-not-allowed pointer-events-none"
                  }
                `}
              >
                {/* Row 1 */}
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {rent.rentAmount}
                  </span>
                  <StatusBadge status={rent.status} />
                </div>

                {/* Row 2 */}
                <Row
                  icon={<User className="w-3.5 h-3.5" />}
                  text={rent.tenantId?.tenantName || "—"}
                />
                <Row
                  icon={<Home className="w-3.5 h-3.5" />}
                  text={
                    rent.propertyId?.propertyName
                      ? `${rent.propertyId.propertyName} · ${rent.unitId?.unitName}`
                      : "—"
                  }
                />

                {/* Row 3 */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatMonthYear(rent.month)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rent.paidAt
                      ? new Date(rent.paidAt).toLocaleDateString("en-IN")
                      : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== TRANSACTION MODAL ===== */}
      {showModal && transaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                Transaction Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">Amount</span>
              <span className="font-black text-slate-900 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {transaction.amount}
              </span>
            </div>

            <DetailRow label="Payment Method" value={transaction.method} />
            <DetailRow label="Status" value={transaction.status} />
            <DetailRow
              label="Paid On"
              value={new Date(transaction.paidAt).toLocaleDateString("en-IN")}
            />
            <DetailRow label="Transaction ID" value={transaction.paymentId} />

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

/* ===== SMALL COMPONENTS ===== */

const Select = ({ value, onChange, placeholder, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200
               text-xs font-bold text-slate-700 outline-none"
  >
    <option value="">{placeholder}</option>
    {children}
  </select>
);

const Row = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-xs text-slate-600">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600";

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${styles}`}>
      {status}
    </span>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-800 truncate max-w-[60%]">
      {value}
    </span>
  </div>
);

export default PaymentHistory;
