import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TenantDetail = () => {
  const { tenantId } = useParams();

  // tenant data
  const [tenant, setTenant] = useState(null);
  //error hanlder
  const [error, setError] = useState("");
  //success message
  const [success, setSuccess] = useState("");

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // form fields (backend-supported)
  const [endDate, setEndDate] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateRemark, setDeactivateRemark] = useState("");

  // fetch tenant
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/tenant/single-tenant/${tenantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTenant(res.data.tenant);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server not responding");
        }
      }
    };

    fetchTenant();
  }, [tenantId]);

  // confirm deallocate (MATCHES BACKEND)
  const confirmDeactivate = async () => {
    if (!endDate || !deactivateReason) {
      setError("All Field Require");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/allocation/deallocate/${tenantId}`,
        {
          endDate,
          deactivateReason,
          deactivateRemark,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Tenant deallocated successfully");

      // update UI instantly
      setTenant((prev) => ({
        ...prev,
        status: "Inactive",
        unitId: null,
      }));

      setShowModal(false);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server not responding");
      }
    }
  };

  if (!tenant) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tenant Details</h2>
      {/*Handle tenant detail  error*/}
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <p>
        <b>Name:</b> {tenant.tenantName}
      </p>
      <p>
        <b>Mobile:</b> {tenant.tenantMobileNo}
      </p>
      <p>
        <b>Address:</b> {tenant.tenantAddress}
      </p>
      <p>
        <b>Status:</b>{" "}
        <span style={{ color: tenant.status === "Active" ? "green" : "red" }}>
          {tenant.status}
        </span>
      </p>

      <hr />

      <h3>Unit Details</h3>
      <p>
        <b>Unit Number:</b> {tenant.unitId?.unitName}
      </p>
      <p>
        <b>Monthly Rent:</b> ₹{tenant.unitId?.monthlyRent || "-"}
      </p>
      <p>
        <b>Unit Status:</b> {tenant.unitId?.status || "-"}
      </p>

      <hr />

      <h3>Created By</h3>
      <p>
        <b>Name:</b> {tenant.createdBy?.name}
      </p>
      <p>
        <b>Mobile:</b> {tenant.createdBy?.mobileNo}
      </p>

      <button onClick={() => setShowModal(true)} disabled={!tenant.unitId}>
        Deactivate
      </button>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Deactivate Tenant</h3>
            {/*Hanlde model error */}
            {error && <p>{error}</p>}
            {/* Status (fixed) */}
            <div style={{ marginBottom: "10px" }}>
              <label>Status</label>
              <div>
                <input type="radio" checked disabled />
                <span style={{ marginLeft: "8px" }}>Inactive</span>
              </div>
            </div>

            {/* End Date */}
            <div style={{ marginBottom: "10px" }}>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Reason (optional) */}
            <div style={{ marginBottom: "10px" }}>
              <label>Reason</label>
              <select
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="Tenant Left">Tenant Left</option>
                <option value="Non Payment">Non Payment</option>
                <option value="Rule Violation">Rule Violation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Remark (optional) */}
            <div style={{ marginBottom: "10px" }}>
              <label>Remark</label>
              <textarea
                rows="3"
                value={deactivateRemark}
                onChange={(e) => setDeactivateRemark(e.target.value)}
                placeholder="Optional remark"
              />
            </div>

            <div style={{ textAlign: "right" }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button
                onClick={confirmDeactivate}
                disabled={loading}
                style={{
                  marginLeft: "10px",
                  background: "red",
                  color: "white",
                }}
              >
                {loading ? "Processing..." : "Confirm Deactivate"}
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
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "6px",
  width: "380px",
};

export default TenantDetail;
