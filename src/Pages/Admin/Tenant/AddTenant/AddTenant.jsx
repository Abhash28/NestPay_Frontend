import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTenant = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tenantName: "",
    tenantMobileNo: "",
    tenantAddress: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://nestpay-backend.onrender.com/api/tenant/add-tenant",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess("Tenant added successfully");

      setFormData({
        tenantName: "",
        tenantMobileNo: "",
        tenantAddress: "",
      });

      // Redirect after showing success
      setTimeout(() => {
        navigate("/admin-tenant");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Enter Tenant Name..."
          value={formData.tenantName}
          onChange={(e) =>
            setFormData({ ...formData, tenantName: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Enter Tenant Mobile No...."
          value={formData.tenantMobileNo}
          onChange={(e) =>
            setFormData({ ...formData, tenantMobileNo: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Enter Tenant Address"
          value={formData.tenantAddress}
          onChange={(e) =>
            setFormData({ ...formData, tenantAddress: e.target.value })
          }
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default AddTenant;
