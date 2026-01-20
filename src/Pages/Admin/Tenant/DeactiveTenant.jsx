import "../../../components/Modal/modal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Tenant = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ================= FETCH TENANTS =================
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/tenant/all-tenant",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTenants(res.data.tenants || []);
      } catch (error) {
        setError(error.response?.data?.message || "Server not responding");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // ================= FILTER INACTIVE TENANTS =================
  const inactiveTenants = tenants
    .filter((tenant) => tenant.status === "Inactive")
    .filter((tenant) =>
      tenant.tenantName?.toLowerCase().includes(search.toLowerCase()),
    );

  // ================= LOADING =================
  if (loading) return <p>Loading tenants...</p>;

  return (
    <>
      <h2>Inactive Tenants</h2>

      <input
        type="text"
        placeholder="Search Tenants..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Tenant Name</th>
            <th>Mobile No</th>
            <th>Address</th>
            <th>Status</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {inactiveTenants.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No inactive tenants found
              </td>
            </tr>
          ) : (
            inactiveTenants.map((tenant, index) => (
              <tr key={tenant._id}>
                <td>{index + 1}</td>
                <td>{tenant.tenantName}</td>
                <td>{tenant.tenantMobileNo}</td>
                <td>{tenant.tenantAddress}</td>
                <td>{tenant.status}</td>

                <td>{tenant.unitId?.unitName || "-"}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin-tenant/detail/${tenant._id}`)
                    }
                  >
                    More
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default Tenant;
