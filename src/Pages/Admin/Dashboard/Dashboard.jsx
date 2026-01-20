import { useEffect, useState } from "react";
import axios from "axios";

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
    <>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p>Total Property: {data.totalProperty || 0}</p>
      <p>Total Unit: {data.totalUnit || 0}</p>
      <p>Total Active Tenant: {data.totalActiveTenant || 0}</p>

      {/* Recent Payments */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recent Payments</h2>

        {recentPaid.length === 0 ? (
          <p>No recent payments</p>
        ) : (
          recentPaid.map((payment) => (
            <div key={payment._id} className="border p-3 rounded mb-2">
              <p>
                <strong>Name:</strong> {payment.tenantId?.tenantName || "N/A"}
              </p>
              <p>
                <strong>Unit:</strong> {payment.unitId?.unitName || "N/A"}
              </p>
              <p>
                <strong>Amount:</strong> ₹{payment.amount}
              </p>
              <p>
                <strong>Status:</strong> {payment.status}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
