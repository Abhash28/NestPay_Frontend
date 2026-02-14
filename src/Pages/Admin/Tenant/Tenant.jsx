import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Phone, Home, Pencil, Plus, Info, Search } from "lucide-react";

const Tenant = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("Active");
  const [search, setSearch] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/tenant/all-tenant",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setTenants(res.data.tenants || []);
      } catch (err) {
        setError(err.response?.data?.message || "Server not responding");
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  /* ================= SAFE SEARCH FILTER ================= */
  const filteredTenants = tenants.filter((t) => {
    const searchText = search.trim().toLowerCase();

    const name = t.tenantName?.toLowerCase() || "";
    const mobile = String(t.tenantMobileNo || "");
    const property = t.unitId?.propertyId?.propertyName?.toLowerCase() || "";

    return (
      name.includes(searchText) ||
      mobile.includes(searchText) ||
      property.includes(searchText)
    );
  });

  const activeTenants = filteredTenants.filter((t) => t.status === "Active");

  const inactiveTenants = filteredTenants.filter((t) => t.status !== "Active");

  /* ================= UPDATE ================= */
  const handleUpdateTenant = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://nestpay-backend.onrender.com/api/tenant/update-tenant",
        { tenant: selectedTenant },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // instant UI update
      setTenants((prev) =>
        prev.map((t) => (t._id === selectedTenant._id ? selectedTenant : t)),
      );

      setShowEditModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= PAGE LOADER ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading tenant...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Tenants</h1>
          <p className="text-xs text-slate-500">
            Manage active & inactive tenants
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/tenant/add-tenant")}
          className="flex items-center gap-1 bg-indigo-600 text-white
                     px-3 py-2 rounded-xl text-xs font-black"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tenant, mobile, property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200
                     rounded-xl text-sm font-semibold outline-none
                     focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm font-bold p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ================= TABS ================= */}
      <div className="flex bg-slate-100 rounded-xl p-1">
        {["Active", "Inactive"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-black transition
              ${
                tab === t ? "bg-white text-indigo-600 shadow" : "text-slate-500"
              }`}
          >
            {t} (
            {t === "Active" ? activeTenants.length : inactiveTenants.length})
          </button>
        ))}
      </div>

      {/* ================= LIST ================= */}
      {tab === "Active" ? (
        activeTenants.length === 0 ? (
          <EmptyState text="No active tenants" />
        ) : (
          <TenantList
            tenants={activeTenants}
            onEdit={(t) => {
              setSelectedTenant(t);
              setShowEditModal(true);
            }}
            onInfo={(id) => navigate(`/admin-tenant/detail/${id}`)}
          />
        )
      ) : inactiveTenants.length === 0 ? (
        <EmptyState text="No inactive tenants" />
      ) : (
        <TenantList
          tenants={inactiveTenants}
          inactive
          onEdit={(t) => {
            setSelectedTenant(t);
            setShowEditModal(true);
          }}
          onInfo={(id) => navigate(`/admin-tenant/detail/${id}`)}
        />
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && selectedTenant && (
        <Modal title="Edit Tenant" onClose={() => setShowEditModal(false)}>
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

/* ================= COMPONENTS ================= */

const EmptyState = ({ text }) => (
  <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-500 text-sm">
    {text}
  </div>
);

const TenantList = ({ tenants, inactive, onEdit, onInfo }) => (
  <div className="space-y-3">
    {tenants.map((tenant) => (
      <div
        key={tenant._id}
        className={`bg-white border border-slate-200 rounded-2xl p-4 space-y-2 ${
          inactive ? "opacity-70" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-extrabold text-slate-900">
              {tenant.tenantName}
            </p>
            <StatusBadge status={tenant.status} />
          </div>

          <button
            onClick={() => onEdit(tenant)}
            className="bg-indigo-50 text-indigo-600 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        <InfoRow icon={<Phone />} text={tenant.tenantMobileNo} />
        <InfoRow
          icon={<Home />}
          text={
            tenant.unitId?.propertyId?.propertyName
              ? `${tenant.unitId.propertyId.propertyName} · ${tenant.unitId.unitName}`
              : "Not allocated"
          }
        />

        <button
          onClick={() => onInfo(tenant._id)}
          className="text-xs font-bold text-slate-700 pt-1 flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
          View Details
        </button>
      </div>
    ))}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
      status === "Active"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-200 text-slate-700"
    }`}
  >
    {status}
  </span>
);

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-slate-700">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center">
    <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-lg font-black">{title}</h3>
        <button onClick={onClose} className="text-slate-400 text-lg">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">{children}</div>
    </div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
  />
);

const ModalAction = ({ label, onConfirm, onCancel }) => (
  <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-2">
    <button
      onClick={onCancel}
      className="flex-1 border border-slate-300 rounded-xl py-3 text-sm font-bold"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 bg-indigo-600 text-white rounded-xl py-3 text-sm font-black"
    >
      {label}
    </button>
  </div>
);

export default Tenant;
