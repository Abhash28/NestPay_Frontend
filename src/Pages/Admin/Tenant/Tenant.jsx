import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Phone, Home, Pencil, Plus, Info } from "lucide-react";

const Tenant = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/tenant/all-tenant",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTenants(res.data.tenants || []);
      } catch (err) {
        setError(err.response?.data?.message || "Server not responding");
      }
    };

    fetchTenants();
  }, []);

  const activeTenants = tenants.filter((t) => t.status === "Active");

  const handleUpdateTenant = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://nestpay-backend.onrender.com/api/tenant/update-tenant",
        { tenant: selectedTenant },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowEditModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tenants</h1>
          <p className="text-xs text-slate-500">Active tenants list</p>
        </div>

        <button
          onClick={() => navigate("/admin/tenant/add-tenant")}
          className="flex items-center gap-1 bg-indigo-600 text-white
                     px-3 py-2 rounded-lg text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm font-semibold p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ===== TENANT LIST ===== */}
      {activeTenants.length === 0 ? (
        <div
          className="bg-white border border-slate-200 rounded-xl
                        p-6 text-center text-slate-500"
        >
          No tenants found
        </div>
      ) : (
        <div className="space-y-2">
          {activeTenants.map((tenant) => (
            <div
              key={tenant._id}
              className="bg-white border border-slate-200 rounded-lg
                         p-3 space-y-2"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">
                  {tenant.tenantName}
                </p>

                <span
                  className="text-[11px] px-2 py-[2px] rounded-full
                                 bg-emerald-100 text-emerald-700 font-semibold"
                >
                  Active
                </span>
              </div>

              {/* Info */}
              <Row icon={<Phone />} text={tenant.tenantMobileNo} />
              <Row
                icon={<Home />}
                text={
                  tenant.unitId?.propertyId?.propertyName
                    ? `${tenant.unitId.propertyId.propertyName} · ${tenant.unitId.unitName}`
                    : "Not allocated"
                }
              />

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => navigate(`/admin-tenant/detail/${tenant._id}`)}
                  className="flex items-center gap-1 text-xs font-semibold
                             text-slate-700"
                >
                  <Info className="w-4 h-4" />
                  Info
                </button>

                <button
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setShowEditModal(true);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold
                             text-indigo-600"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && selectedTenant && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Tenant">
          <Input
            value={selectedTenant.tenantName}
            onChange={(e) =>
              setSelectedTenant({
                ...selectedTenant,
                tenantName: e.target.value,
              })
            }
            placeholder="Tenant name"
          />

          <Input
            value={selectedTenant.tenantMobileNo}
            onChange={(e) =>
              setSelectedTenant({
                ...selectedTenant,
                tenantMobileNo: e.target.value,
              })
            }
            placeholder="Mobile number"
          />

          <Input
            value={selectedTenant.tenantAddress}
            onChange={(e) =>
              setSelectedTenant({
                ...selectedTenant,
                tenantAddress: e.target.value,
              })
            }
            placeholder="Address"
          />

          <ModalAction
            label="Update"
            onConfirm={handleUpdateTenant}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

/* ===== SMALL UI ===== */

const Row = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-[13px] text-slate-700">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-black/40
                  flex items-end sm:items-center justify-center"
  >
    <div
      className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl
                 p-4 space-y-3 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <button onClick={onClose} className="text-slate-400">
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200
               rounded-lg font-semibold text-sm outline-none"
  />
);

const ModalAction = ({ label, onConfirm, onCancel }) => (
  <div className="flex gap-2 pt-2">
    <button
      onClick={onCancel}
      className="flex-1 border border-slate-300 rounded-lg
                 py-2 text-sm font-semibold"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 bg-indigo-600 text-white rounded-lg
                 py-2 text-sm font-semibold"
    >
      {label}
    </button>
  </div>
);

export default Tenant;
