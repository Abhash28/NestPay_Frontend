import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TenantDetail = () => {
  const { tenantId } = useParams();

  // allocation data (SOURCE OF TRUTH)
  const [allocation, setAllocation] = useState(null);

  // ui states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // form fields
  const [endDate, setEndDate] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateRemark, setDeactivateRemark] = useState("");

  // ================= FETCH TENANT + ALLOCATION =================
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://nestpay-backend.onrender.com/api/allocation/tenant-info/${tenantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAllocation(res.data.allocation);
      } catch (error) {
        setError(error.response?.data?.message || "Server not responding");
      } finally {
        setFetching(false);
      }
    };

    fetchTenant();
  }, [tenantId]);
  console.log(allocation);

  // ================= DEACTIVATE =================
  const confirmDeactivate = async () => {
    if (!endDate || !deactivateReason) {
      setError("End date and reason are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `https://nestpay-backend.onrender.com/api/allocation/deallocate/${tenantId}`,
        { endDate, deactivateReason, deactivateRemark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess("Tenant deactivated successfully");

      // update UI locally
      setAllocation((prev) => ({
        ...prev,
        status: "Inactive",
        endDate,
      }));

      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  //  UI GUARDS
  if (fetching) return <p>Loading tenant details...</p>;
  if (!allocation) return <p>No allocation found for this tenant</p>;

  //  SAFE DATA
  const tenant = allocation.tenantId;
  const unit = allocation.unitId;
  const property = allocation.propertyId;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tenant Details</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/*  TENANT  */}
      <p>
        <b>Name:</b> {tenant?.tenantName}
      </p>
      <p>
        <b>Mobile:</b> {tenant?.tenantMobileNo}
      </p>
      <p>
        <b>Address:</b> {tenant?.tenantAddress}
      </p>
      <p>
        <b>Status:</b>{" "}
        <span style={{ color: tenant?.status === "Active" ? "green" : "red" }}>
          {tenant?.status}
        </span>
      </p>

      <hr />

      {/* PROPERTY */}
      <h3>Property Details</h3>
      <p>
        <b>Property Name:</b> {property?.propertyName || "-"}
      </p>
      <p>
        <b>Property Address:</b> {property?.propertyAddress || "-"}
      </p>

      <hr />

      {/*  UNIT*/}
      <h3>Unit Details</h3>
      <p>
        <b>Unit Name:</b> {unit?.unitName || "-"}
      </p>
      <p>
        <b>Monthly Rent:</b> ₹{unit?.monthlyRent || "-"}
      </p>
      <p>
        <b>Unit Status:</b> {unit?.status || "-"}
      </p>

      <hr />

      {/* ALLOCATION  */}
      <h3>Allocation Details</h3>
      <p>
        <b>Billing Day:</b> {allocation.billingDay}
      </p>
      <p>
        <b>Rent Amount:</b> ₹{allocation.rentAmount}
      </p>
      <p>
        <b>Start Date:</b>{" "}
        {allocation.startDate
          ? new Date(allocation.startDate).toLocaleDateString()
          : "-"}
      </p>
      {tenant.status === "Inactive" && (
        <>
          <p>
            <b>End Date:</b>{" "}
            {allocation.endDate
              ? new Date(allocation.endDate).toLocaleDateString()
              : "-"}
          </p>

          <p>
            <b>Deactivate Reason:</b> {tenant.deactivateReason || "-"}
          </p>

          <p>
            <b>Deactivate Remark:</b> {tenant.deactivateRemark || "-"}
          </p>
        </>
      )}

      <button
        onClick={() => setShowModal(true)}
        disabled={allocation.status !== "Active"}
      >
        Deactivate
      </button>

      {/*  MODAL  */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Deactivate Tenant</h3>

            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <label>Reason</label>
            <select
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Tenant Left">Tenant Left</option>
              <option value="Non Payment">Non Payment</option>
              <option value="Rule Violation">Rule Violation</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              rows="3"
              placeholder="Remark (optional)"
              value={deactivateRemark}
              onChange={(e) => setDeactivateRemark(e.target.value)}
            />

            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={confirmDeactivate}
                disabled={loading}
                style={{ marginLeft: "10px", background: "red", color: "#fff" }}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= STYLES =================
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "6px",
  width: "380px",
};

export default TenantDetail;
