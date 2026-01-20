import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  IndianRupee,
  Layers,
  Plus,
  Pencil,
} from "lucide-react";

const Property = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectProperty, setSelectProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/property/all-property",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProperty(res.data.allProperty || []);
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      }
    };
    fetchProperties();
  }, [navigate]);

  const hanldeEdit = (e, item) => {
    e.stopPropagation();
    setSelectProperty(item);
    setShowModal(true);
  };

  const handleUpdateProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://nestpay-backend.onrender.com/api/property/update-property",
        { property: selectProperty },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowModal(false);

      const res = await axios.get(
        "https://nestpay-backend.onrender.com/api/property/all-property",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProperty(res.data.allProperty || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Properties</h1>
          <p className="text-xs text-slate-500">
            Manage your rental properties
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/property/add-property")}
          className="flex items-center gap-1 bg-indigo-600 text-white
                     px-3 py-2 rounded-lg text-xs font-black"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* ===== PROPERTY LIST ===== */}
      {property.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No properties found
        </div>
      ) : (
        <div className="space-y-3">
          {property.map((item) => (
            <div
              key={item._id}
              onClick={() =>
                navigate(`/admin/property/${item._id}/unit-detail`)
              }
              className="bg-white border border-slate-200 rounded-xl p-4
                         space-y-2 cursor-pointer active:scale-[0.99]"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900">{item.propertyName}</p>

                <button
                  onClick={(e) => hanldeEdit(e, item)}
                  className="text-indigo-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <InfoRow icon={<MapPin />} text={item.propertyAddress} />

              <div className="flex items-center justify-between pt-1">
                <InfoRow icon={<IndianRupee />} text={`₹${item.monthlyRent}`} />
                <InfoRow icon={<Layers />} text={`${item.totalUnit} Units`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Edit Property">
          <Input
            value={selectProperty.propertyName}
            onChange={(e) =>
              setSelectProperty({
                ...selectProperty,
                propertyName: e.target.value,
              })
            }
            placeholder="Property Name"
          />

          <Input
            value={selectProperty.propertyAddress}
            onChange={(e) =>
              setSelectProperty({
                ...selectProperty,
                propertyAddress: e.target.value,
              })
            }
            placeholder="Address"
          />

          <Input
            type="number"
            value={selectProperty.monthlyRent}
            onChange={(e) =>
              setSelectProperty({
                ...selectProperty,
                monthlyRent: e.target.value,
              })
            }
            placeholder="Monthly Rent"
          />

          <ModalAction
            onCancel={() => setShowModal(false)}
            onConfirm={handleUpdateProperty}
            label="Update"
          />
        </Modal>
      )}
    </div>
  );
};

/* ===== Small UI Components ===== */

const InfoRow = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-xs text-slate-600">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
    <div
      className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 space-y-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black">{title}</h3>
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
    className="w-full px-3 py-3 bg-slate-50 border border-slate-200
               rounded-lg font-bold text-sm outline-none"
  />
);

const ModalAction = ({ onCancel, onConfirm, label }) => (
  <div className="flex gap-2 pt-2">
    <button
      onClick={onCancel}
      className="flex-1 border border-slate-300 rounded-lg py-2 text-sm font-bold"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-black"
    >
      {label}
    </button>
  </div>
);

export default Property;
