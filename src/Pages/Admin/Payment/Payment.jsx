import React, { useEffect, useState } from "react";
import axios from "axios";

const Payment = () => {
  const [rentDues, setRentDues] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch rent dues
  useEffect(() => {
    const getDues = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/rentdue/alldue",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setRentDues(res.data.rentDues || []);
      } catch (error) {
        console.error("Fetch dues error:", error);
      } finally {
        setLoading(false);
      }
    };

    getDues();
  }, []);

  // Open Razorpay popup
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

  // Handle Pay
  const handlePay = async (rentDueId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://nestpay-backend.onrender.com/api/payment/create-order",
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

  //handle cash btn
  const handleCash = async (rentDueId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://nestpay-backend.onrender.com/api/payment/cash",
        { rentDueId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Cash payment recorded");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Cash payment failed");
    }
  };

  if (loading) return <p>Loading rent dues...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rent Dues</h2>

      {rentDues.length === 0 ? (
        <p>No rent dues found</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>#</th>
              <th>Tenant</th>
              <th>Property</th>
              <th>Unit</th>
              <th>Month</th>
              <th>Due Date</th>
              <th>Rent</th>

              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rentDues.map((due, index) => (
              <tr key={due._id}>
                <td>{index + 1}</td>
                <td>{due.tenantId?.tenantName}</td>
                <td>{due.propertyId?.propertyName}</td>
                <td>{due.unitId?.unitName}</td>
                <td>{due.month}</td>
                <td>{new Date(due.dueDate).toDateString()}</td>

                <td>₹{due.rentAmount}</td>

                <td
                  style={{
                    color:
                      due.status === "Paid"
                        ? "green"
                        : due.status === "Overdue"
                          ? "red"
                          : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {due.status}
                </td>

                <td>
                  {due.status !== "Paid" ? (
                    <button onClick={() => handlePay(due._id)}>Pay Now</button>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {due.status !== "Paid" ? (
                    <button onClick={() => handleCash(due._id)}>Cash</button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payment;
