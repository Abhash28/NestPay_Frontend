import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { IndianRupee, User, Phone, Plus, Pencil } from "lucide-react";

const UnitDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);

  // add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  // edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://nestpay-backend.onrender.com/api/property/all-units/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUnits(res.data.units || []);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [propertyId]);

  const vacantCount = units.filter((u) => u.status === "vacant").length;
  const occupiedCount = units.filter((u) => u.status === "occupied").length;

  // ADD UNIT
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

  // EDIT
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

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Units</h1>
          <p className="text-xs text-slate-500">
            Occupied {occupiedCount} · Vacant {vacantCount}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/admin/property/${propertyId}/unit-detail/allocation`)
            }
            className="px-3 py-2 text-xs font-semibold rounded-lg
                       border border-slate-300 text-slate-700"
          >
            Allocate
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-2
                       text-xs font-semibold bg-indigo-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* ===== UNIT LIST ===== */}
      {units.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No units found
        </div>
      ) : (
        <div className="space-y-2">
          {units.map((unit) => (
            <div
              key={unit._id}
              className="bg-white border border-slate-200 rounded-lg
                         px-3 py-2.5 space-y-1.5"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[15px] text-slate-900">
                  {unit.unitName}
                </p>
                <StatusBadge status={unit.status} />
              </div>

              {/* Info */}
              <Row
                icon={<IndianRupee className="w-3.5 h-3.5" />}
                text={`₹${unit.monthlyRent}`}
              />
              <Row
                icon={<User className="w-3.5 h-3.5" />}
                text={unit.tenantId?.tenantName || "No tenant"}
              />
              <Row
                icon={<Phone className="w-3.5 h-3.5" />}
                text={unit.tenantId?.tenantMobileNo || "—"}
              />

              {/* Action */}
              <button
                onClick={() => handleEditClick(unit)}
                className="flex items-center gap-1
                           text-[12px] font-semibold text-indigo-600 pt-0.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
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

/* ===== SMALL UI COMPONENTS ===== */

const Row = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-[13px] text-slate-700">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const style =
    status === "occupied"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <span
      className={`text-[11px] font-semibold px-2 py-[2px] rounded-full ${style}`}
    >
      {status === "occupied" ? "Occupied" : "Vacant"}
    </span>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
    <div
      className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl
                 p-4 space-y-3 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
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

const ModalAction = ({ onConfirm, onCancel, label }) => (
  <div className="flex gap-2 pt-2">
    <button
      onClick={onCancel}
      className="flex-1 border border-slate-300 rounded-lg py-2
                 text-sm font-semibold"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 bg-indigo-600 text-white rounded-lg py-2
                 text-sm font-semibold"
    >
      {label}
    </button>
  </div>
);

export default UnitDetail;
