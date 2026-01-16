import { useEffect, useState } from "react";
import axios from "axios";

const DeactiveTenant = () => {
  const [error, setError] = useState("");
  const [inactiveTenants, setInactiveTenants] = useState([]);

  useEffect(() => {
    const fetchInactiveTenants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/tenant/all-tenant/inactive",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInactiveTenants(res.data.tenants || []);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server not responding");
        }
      }
    };

    fetchInactiveTenants();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inactive Tenants</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {inactiveTenants.length === 0 ? (
        <p>No inactive tenants found</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Remark</th>
            </tr>
          </thead>

          <tbody>
            {inactiveTenants.map((tenant, index) => (
              <tr key={tenant._id}>
                <td>{index + 1}</td>
                <td>{tenant.tenantName}</td>
                <td>{tenant.tenantMobileNo}</td>
                <td>{tenant.tenantAddress}</td>
                <td style={{ color: "red" }}>{tenant.status}</td>
                <td>
                  {tenant.startDate ? tenant.startDate.slice(0, 10) : "-"}
                </td>
                <td>{tenant.endDate ? tenant.endDate.slice(0, 10) : "-"}</td>
                <td>{tenant.deactivateReason || "-"}</td>
                <td>{tenant.deactivateRemark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeactiveTenant;
