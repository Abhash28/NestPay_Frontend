import "../../../components/Modal/modal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Tenant = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");

  // modal for edit tenant
  const [showEditModal, setShowEditModal] = useState(false);

  // selected tenant (same role as selectProperty)
  const [selectedTenant, setSelectedTenant] = useState(null);

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
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server not responding");
        }
      }
    };

    fetchTenants();
  }, []);

  // only active tenants
  const activeTenants = tenants.filter((tenant) => tenant.status === "Active");

  // update tenant (same pattern as property update)
  const handleUpdateTenant = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/tenant/update-tenant",
        { tenant: selectedTenant },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowEditModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Tenants</h2>

      <input type="text" placeholder="Search Tenants..." />

      <button onClick={() => navigate("/admin/tenant/add-tenant")}>
        Add Tenant
      </button>

      <button onClick={() => navigate("/admin-tenant/deactive")}>
        Deactive Tenants
      </button>

      {error && <p>{error}</p>}

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Tenant Name</th>
            <th>Mobile No</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {activeTenants.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No tenants found
              </td>
            </tr>
          ) : (
            activeTenants.map((tenant, index) => (
              <tr key={tenant._id}>
                <td>{index + 1}</td>
                <td>{tenant.tenantName}</td>
                <td>{tenant.tenantMobileNo}</td>
                <td>{tenant.unitId?.propertyId?.propertyName || "-"}</td>
                <td>{tenant.unitId?.unitName || "-"}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin-tenant/detail/${tenant._id}`)
                    }
                  >
                    Info
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTenant(tenant);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Tenant Modal */}
      {showEditModal && selectedTenant && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Tenant</h3>

            <input
              type="text"
              value={selectedTenant.tenantName}
              onChange={(e) =>
                setSelectedTenant({
                  ...selectedTenant,
                  tenantName: e.target.value,
                })
              }
              placeholder="Tenant Name"
            />

            <input
              type="number"
              value={selectedTenant.tenantMobileNo}
              onChange={(e) =>
                setSelectedTenant({
                  ...selectedTenant,
                  tenantMobileNo: e.target.value,
                })
              }
              placeholder="Mobile No"
            />

            <input
              type="text"
              value={selectedTenant.tenantAddress}
              onChange={(e) =>
                setSelectedTenant({
                  ...selectedTenant,
                  tenantAddress: e.target.value,
                })
              }
              placeholder="Address"
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
              <button onClick={handleUpdateTenant}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tenant;
