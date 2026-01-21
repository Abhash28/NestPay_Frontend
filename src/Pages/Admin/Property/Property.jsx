import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, Layers, Plus } from "lucide-react";

const Property = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectProperty, setSelectProperty] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/property/all-property",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProperty(res.data.allProperty || []);
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setPageLoading(false);
      }
    };
    fetchProperties();
  }, [navigate]);

  const handleEdit = (e, item) => {
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

  /* ===== PAGE LOADER ===== */
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading properties...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-24">
      {/* HEADER */}
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
                     px-3 py-2 rounded-xl text-xs font-black active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* LIST */}
      {property.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
          <p className="font-bold text-slate-600">No properties yet</p>
          <p className="text-xs text-slate-500">
            Add your first property to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {property.map((item) => (
            <div
              key={item._id}
              tabIndex={0}
              role="button"
              onClick={() =>
                navigate(`/admin/property/${item._id}/unit-detail`)
              }
              className="bg-white border border-slate-200 rounded-2xl p-4
                         space-y-3 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         active:scale-[0.98]"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <p className="text-base font-extrabold text-slate-900 truncate">
                    {item.propertyName}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.propertyAddress}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleEdit(e, item)}
                  className="bg-indigo-50 text-indigo-600 px-2 py-1
                             rounded-lg text-xs font-bold shrink-0"
                >
                  Edit
                </button>
              </div>

              {/* STATS */}
              <div className="flex gap-2">
                <StatCard
                  icon={<IndianRupee className="w-4 h-4" />}
                  value={`₹${item.monthlyRent}`}
                  label="Avg Rent"
                />
                <StatCard
                  icon={<Layers className="w-4 h-4" />}
                  value={item.totalUnit}
                  label="Units"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {showModal && (
        <Modal title="Edit Property" onClose={() => setShowModal(false)}>
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

          {/* ACTIONS – VISIBLE ON ALL DEVICES */}
          <ModalAction
            label="Update"
            onCancel={() => setShowModal(false)}
            onConfirm={handleUpdateProperty}
          />
        </Modal>
      )}
    </div>
  );
};

/* ---------- SMALL COMPONENTS ---------- */

const StatCard = ({ icon, value, label }) => (
  <div className="flex-1 bg-slate-50 rounded-xl p-3 flex items-center gap-2">
    <span className="text-slate-500">{icon}</span>
    <div>
      <p className="text-sm font-black text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  </div>
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

const ModalAction = ({ onCancel, onConfirm, label }) => (
  <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-2">
    <button
      onClick={onCancel}
      className="flex-1 border border-slate-300 rounded-xl
                 py-3 text-sm font-bold"
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

export default Property;
