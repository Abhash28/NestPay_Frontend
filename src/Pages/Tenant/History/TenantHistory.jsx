import React, { useEffect, useState } from "react";
import axios from "axios";

const TenantHistory = () => {
  // set all paid rent
  const [rent, setRent] = useState([]);
  useEffect(() => {
    const showRentHistory = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/payment/tenant/history",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setRent(res.data.paymentHistory);
    };
    showRentHistory();
  }, []);

  // filter out all paid rent for history
  const paidRent = Array.isArray(rent)
    ? rent.filter((r) => r.status === "SUCCESS")
    : [];

  console.log(paidRent);
  return (
    <>
      <div>
        <h3>Payment History</h3>

        {paidRent.length > 0 ? (
          paidRent.map((payment) => (
            <div
              key={payment._id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <p>
                <strong>Month:</strong> {payment.rentDueId?.month}
              </p>

              <p>
                <strong>Rent Amount:</strong> ₹{payment.amount}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(payment.rentDueId?.dueDate).toDateString()}
              </p>

              <p>
                <strong>Paid Date:</strong>{" "}
                {new Date(payment.paidAt).toDateString()}
              </p>

              <p>
                <strong>Status:</strong> {payment.status}
              </p>

              <p>
                <strong>Payment Method:</strong>
                {payment.method}
              </p>
            </div>
          ))
        ) : (
          <p>No payment history found</p>
        )}
      </div>
    </>
  );
};

export default TenantHistory;
