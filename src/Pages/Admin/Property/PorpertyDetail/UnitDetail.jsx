import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { IndianRupee, User, Phone, Plus, Pencil } from "lucide-react";

const UnitDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitName, setUnitName] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const fetchUnits = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://nestpay-backend.onrender.com/api/property/all-units/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUnits(res.data.units || []);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [propertyId]);

  const vacantCount = units.filter((u) => u.status === "vacant").length;
  const occupiedCount = units.filter((u) => u.status === "occupied").length;

  const handleAddUnit = async () => {
    if (!unitName || !monthlyRent) return;

    try {
      await axios.post(
        "https://nestpay-backend.onrender.com/api/unit/create-unit",
        { propertyId, unitName, monthlyRent },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setUnitName("");
      setMonthlyRent("");
      setShowAddModal(false);
      fetchUnits();
    } catch {
      alert("Failed to add unit");
    }
  };

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setUnitName(unit.unitName);
    setMonthlyRent(unit.monthlyRent);
    setShowEditModal(true);
  };

  const handleUpdateUnit = async () => {
    try {
      await axios.put(
        "https://nestpay-backend.onrender.com/api/unit/update-unit",
        { unitId: selectedUnit._id, unitName, monthlyRent },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setShowEditModal(false);
      setSelectedUnit(null);
      fetchUnits();
    } catch {
      alert("Failed to update unit");
    }
  };

  /* ===== PAGE LOADER ===== */
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading units...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Units</h1>
          <p className="text-xs text-slate-500">
            Occupied {occupiedCount} · Vacant {vacantCount}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/admin/property/${propertyId}/unit-detail/allocation`)
            }
            className="px-3 py-2 text-xs font-bold rounded-xl
                       border border-slate-300 text-slate-700"
          >
            Allocate
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-2
                       text-xs font-black bg-indigo-600 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* UNIT LIST */}
      {units.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
          <p className="font-bold text-slate-600">No units yet</p>
          <p className="text-xs text-slate-500">
            Add units to start allocating tenants
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((unit) => (
            <div
              key={unit._id}
              className="bg-white border border-slate-200 rounded-2xl p-4
                         space-y-3 relative"
            >
              {/* TOP */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-extrabold text-slate-900">
                    {unit.unitName}
                  </p>
                  <StatusBadge status={unit.status} />
                </div>

                <button
                  onClick={() => handleEditClick(unit)}
                  className="bg-indigo-50 text-indigo-600 px-2.5 py-1.5
                             rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>

              {/* RENT HIGHLIGHT */}
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                <IndianRupee className="w-4 h-4 text-slate-500" />
                <p className="font-black text-slate-900">{unit.monthlyRent}</p>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              {/* INFO */}
              <InfoRow
                icon={<User className="w-4 h-4" />}
                text={unit.tenantId?.tenantName || "No tenant"}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                text={unit.tenantId?.tenantMobileNo || "—"}
              />
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal title="Add Unit" onClose={() => setShowAddModal(false)}>
          <Input
            placeholder="Unit name"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Monthly rent"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />

          <ModalAction
            label="Add Unit"
            onConfirm={handleAddUnit}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal title="Edit Unit" onClose={() => setShowEditModal(false)}>
          <Input
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
          <Input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />

          <ModalAction
            label="Update"
            onConfirm={handleUpdateUnit}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

/* ---------- UI COMPONENTS ---------- */

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-slate-700">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full
      ${
        status === "occupied"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
  >
    {status === "occupied" ? "Occupied" : "Vacant"}
  </span>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center">
    <div
      className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl
                 max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
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
    className="w-full px-3 py-3 bg-slate-50 border border-slate-200
               rounded-xl font-bold text-sm outline-none
               focus:ring-2 focus:ring-indigo-500"
  />
);

const ModalAction = ({ onConfirm, onCancel, label }) => (
  <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-2">
    <button
      onClick={onCancel}
      className="flex-1 border border-slate-300
                 rounded-xl py-3 text-sm font-bold"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 bg-indigo-600 text-white
                 rounded-xl py-3 text-sm font-black"
    >
      {label}
    </button>
  </div>
);

export default UnitDetail;
