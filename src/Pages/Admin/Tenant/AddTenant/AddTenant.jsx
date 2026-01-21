import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";

const AddTenant = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tenantName: "",
    tenantMobileNo: "",
    tenantAddress: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post("https://nest-pay.in/api/tenant/add-tenant", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Tenant added successfully");

      setFormData({
        tenantName: "",
        tenantMobileNo: "",
        tenantAddress: "",
      });

      setTimeout(() => {
        navigate("/admin-tenant");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-900">Add Tenant</h1>
        <p className="text-sm text-slate-500">Create a new tenant profile</p>
      </div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
      >
        {/* SUCCESS */}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* TENANT NAME */}
        <InputField
          icon={<User className="w-4 h-4" />}
          placeholder="Tenant name"
          value={formData.tenantName}
          onChange={(e) =>
            setFormData({ ...formData, tenantName: e.target.value })
          }
        />

        {/* MOBILE */}
        <InputField
          icon={<Phone className="w-4 h-4" />}
          type="number"
          placeholder="Mobile number"
          value={formData.tenantMobileNo}
          onChange={(e) =>
            setFormData({ ...formData, tenantMobileNo: e.target.value })
          }
        />

        {/* ADDRESS */}
        <InputField
          icon={<MapPin className="w-4 h-4" />}
          placeholder="Address"
          value={formData.tenantAddress}
          onChange={(e) =>
            setFormData({ ...formData, tenantAddress: e.target.value })
          }
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-black py-3 rounded-xl
                     flex items-center justify-center gap-2
                     disabled:bg-slate-300 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Tenant"
          )}
        </button>
      </form>
    </div>
  );
};

/* ---------- SMALL UI COMPONENT ---------- */

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      {...props}
      required
      className="w-full pl-10 pr-3 py-3 bg-slate-50
                 border border-slate-200 rounded-xl
                 font-bold text-sm outline-none
                 focus:bg-white focus:border-indigo-600"
    />
  </div>
);

export default AddTenant;
