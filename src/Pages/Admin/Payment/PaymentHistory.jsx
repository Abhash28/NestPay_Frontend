import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, Home, IndianRupee, Clock } from "lucide-react";
import formatMonthYear from "../../../../utils/convertMonth";

const PaymentHistory = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [rentHistory, setRentHistory] = useState([]);

  const fetchPaymentHistory = async () => {
    try {
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
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [month, year, status]);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-5">
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
        </Select>
      </div>

      {/* ===== HISTORY LIST ===== */}
      {rentHistory.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No payment records found
        </div>
      ) : (
        <div className="space-y-3">
          {rentHistory.map((rent) => (
            <div
              key={rent._id}
              className="bg-white border border-slate-200 rounded-xl p-3 space-y-2"
            >
              {/* Row 1 */}
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">
                  ₹{rent.rentAmount}
                </span>
                <StatusBadge status={rent.status} />
              </div>

              {/* Row 2 */}
              <Row icon={<User />} text={rent.tenantId?.tenantName} />
              <Row
                icon={<Home />}
                text={`${rent.propertyId?.propertyName} · ${rent.unitId?.unitName}`}
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
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== Small UI Components ===== */

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

export default PaymentHistory;
