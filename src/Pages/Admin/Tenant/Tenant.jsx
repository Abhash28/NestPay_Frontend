import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Tenant = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/tenant/all-tenant",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTenants(res.data.tenants || []);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server not responding");
        }
      }
    };

    fetchTenants();
  }, []);

  return (
    <>
      <h2>Tenants</h2>

      <input type="text" placeholder="Search Tenants..." />

      <button onClick={() => navigate("/admin/tenant/add-tenant")}>
        Add Tenant
      </button>

      {error && <p>{error}</p>}

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Tenant Name</th>
            <th>Mobile No</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tenants.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No tenants found
              </td>
            </tr>
          ) : (
            tenants.map((tenant, index) => (
              <tr key={tenant._id}>
                <td>{index + 1}</td>
                <td>{tenant.tenantName}</td>
                <td>{tenant.tenantMobileNo}</td>
                <td>{tenant.tenantAddress}</td>
                <td>{tenant.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default Tenant;
