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
          "http://localhost:5000/api/rentdue/alldue",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRentDues(res.data.rentDues);
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
      key: orderData.key, // public key
      amount: orderData.amount, // paise
      currency: "INR",
      name: "NestPay",
      description: "Monthly Rent Payment",
      order_id: orderData.orderId,

      handler: async function (response) {
        try {
          const token = localStorage.getItem("token");
          //  Verify payment
          await axios.post(
            "http://localhost:5000/api/payment/verifyPayment",
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Payment Successful ");
          window.location.reload();
        } catch (err) {
          alert("Payment verification failed");
          console.error(err);
        }
      },

      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  //  Handle Pay button click
  const handlePay = async (rentDueId) => {
    try {
      const token = localStorage.getItem("token");

      //  Create order
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { rentDueId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //  Open Razorpay checkout
      openRazorpay(res.data);
    } catch (error) {
      console.error("Create order error:", error);
      alert("Unable to initiate payment");
    }
  };

  if (loading) return <p>Loading rent dues...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rent Dues</h2>

      {rentDues.length === 0 ? (
        <p>No rent dues found</p>
      ) : (
        rentDues.map((due) => (
          <div
            key={due._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Month:</strong> {due.month}
            </p>
            <p>
              <strong>Rent:</strong> ₹{due.rentAmount}
            </p>
            <p>
              <strong>Due Date:</strong> {new Date(due.dueDate).toDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    due.status === "Paid"
                      ? "green"
                      : due.status === "Overdue"
                      ? "red"
                      : "orange",
                }}
              >
                {due.status}
              </span>
            </p>

            {due.status !== "Paid" && (
              <button onClick={() => handlePay(due._id)}>Pay Now</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Payment;
