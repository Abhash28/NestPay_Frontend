import React, { useEffect, useState } from "react";
import axios from "axios";

const TenantDashboard = () => {
  const [tenant, setTenant] = useState();
  const [rent, setRent] = useState([]);
  const [lastPay, setLastPay] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH TENANT INFO =================
  const fetchTenantDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/allocation/tenant/home",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTenant(res.data.tenantInfo);
    } catch (error) {
      console.error("Tenant fetch error:", error);
    }
  };

  // ================= FETCH RENT DUES =================
  const fetchRentDue = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/rentdue/tenant/rent",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRent(res.data.allRent || []);
    } catch (error) {
      console.error("Rent fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  //fetch last payment
  const lastPayment = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/payment/recent/tenant/paid",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setLastPay(res.data.recentPayment);
    } catch (error) {
      console.error("Rent fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTenantDetail();
    fetchRentDue();
    lastPayment();
  }, []);
  console.log(lastPay);
  // ================= FILTER PENDING RENT =================
  const pendingRent = Array.isArray(rent)
    ? rent.filter((r) => r.status === "Pending")
    : [];

  // ================= RAZORPAY =================
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
            "http://localhost:5000/api/payment/verifyPayment",
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          alert("Payment Successful");
          window.location.reload();
        } catch (err) {
          alert("Payment verification failed");
          console.error(err);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ================= PAY HANDLER =================
  const handlePay = async (rentDueId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { rentDueId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      openRazorpay(res.data);
    } catch (error) {
      console.error("Create order error:", error);
      alert("Unable to initiate payment");
    }
  };

  if (loading || !tenant) {
    return <h2>Loading tenant dashboard...</h2>;
  }
  console.log(lastPay);
  return (
    <div style={{ padding: "20px" }}>
      {/* ================= PROPERTY INFO ================= */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Welcome to {tenant.propertyId.propertyName}</h2>

        <p>
          <strong>Unit:</strong> {tenant.unitId.unitName}
        </p>
        <p>
          <strong>Rent:</strong> ₹{tenant.rentAmount}
        </p>
        <p>
          <strong>Address:</strong> {tenant.propertyId.propertyAddress}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(tenant.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Owner Info:</strong> {tenant.adminId.name} (
          {tenant.adminId.mobileNo})
        </p>
      </div>

      {/* ================= RENT DUE ================= */}
      <div>
        <h3>Rent Due</h3>

        {pendingRent.length > 0 ? (
          pendingRent.map((r) => (
            <div
              key={r._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>Month:</strong> {r.month}
              </p>
              <p>
                <strong>Amount:</strong> ₹{r.rentAmount}
              </p>
              <p>
                <strong>Due Date:</strong> {new Date(r.dueDate).toDateString()}
              </p>

              <button onClick={() => handlePay(r._id)}>Pay Now</button>
            </div>
          ))
        ) : (
          <p>No pending rent 🎉</p>
        )}
      </div>

      {/* ================= LAST PAYMENT ================= */}
      <div style={{ marginTop: "30px" }}>
        <h3>Last Payment</h3>

        {lastPay.length > 0 ? (
          lastPay.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                background: "#f9fafb",
              }}
            >
              <p>
                <strong>Month:</strong> {p.rentDueId?.month || "N/A"}
              </p>

              <p>
                <strong>Rent Amount:</strong> ₹{p.amount}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {p.rentDueId?.dueDate
                  ? new Date(p.rentDueId.dueDate).toDateString()
                  : "N/A"}
              </p>

              <p>
                <strong>Paid Date:</strong> {new Date(p.paidAt).toDateString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: p.status === "SUCCESS" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {p.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No payment history available</p>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
