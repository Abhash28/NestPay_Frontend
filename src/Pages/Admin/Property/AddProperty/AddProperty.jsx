import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const AddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyAddress: "",
    monthlyRent: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProperty = async (e) => {
    e.preventDefault();

    // 🔒 prevent double submit
    if (loading) return;

    setError("");
    setSuccess("");

    // ✅ basic validation (MAJOR FIX)
    if (
      !formData.propertyName.trim() ||
      !formData.propertyAddress.trim() ||
      !formData.monthlyRent
    ) {
      setError("All fields are required");
      return;
    }

    if (Number(formData.monthlyRent) <= 0) {
      setError("Monthly rent must be greater than 0");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://nestpay-backend.onrender.com/api/property/add-property",
        {
          ...formData,
          monthlyRent: Number(formData.monthlyRent), // 🔧 major fix
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFormData({
        propertyName: "",
        propertyAddress: "",
        monthlyRent: "",
      });

      setSuccess("Property added successfully");

      setTimeout(() => {
        navigate("/admin-property");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Something went wrong");
      } else {
        setError("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-5">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Add Property</h1>
        <p className="text-xs text-slate-500">Create a new rental property</p>
      </div>

      {/* ===== FEEDBACK ===== */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-lg px-4 py-3">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleAddProperty}
        className="bg-white border border-slate-200 rounded-xl p-4 space-y-4"
      >
        <Input
          icon={<Building2 />}
          label="Property Name"
          placeholder="e.g. Green Residency"
          value={formData.propertyName}
          onChange={(e) =>
            setFormData({ ...formData, propertyName: e.target.value })
          }
        />

        <Input
          icon={<MapPin />}
          label="Property Address"
          placeholder="Full address"
          value={formData.propertyAddress}
          onChange={(e) =>
            setFormData({ ...formData, propertyAddress: e.target.value })
          }
        />

        <Input
          icon={<IndianRupee />}
          label="Monthly Rent"
          type="number"
          placeholder="Rent amount"
          value={formData.monthlyRent}
          onChange={(e) =>
            setFormData({ ...formData, monthlyRent: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#020617] hover:bg-indigo-700 text-white
                     font-black py-3 rounded-lg transition
                     flex items-center justify-center gap-2
                     disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Add Property"
          )}
        </button>
      </form>
    </div>
  );
};

/* ===== Reusable Input ===== */
const Input = ({ icon, label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        {...props}
        required
        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200
                   rounded-lg focus:bg-white focus:border-indigo-600
                   focus:ring-2 focus:ring-indigo-500/10 outline-none
                   font-bold text-slate-900 text-sm placeholder:text-slate-300"
      />
    </div>
  </div>
);

export default AddProperty;
