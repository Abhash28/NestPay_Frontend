import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Home,
  User,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const UnitAllocation = () => {
  const { propertyId } = useParams();

  const [property, setProperty] = useState(null);
  const [vacantUnits, setVacantUnits] = useState([]);
  const [activeTenants, setActiveTenants] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    unitId: "",
    tenantId: "",
    tenantMobile: "",
    tenantAddress: "",
  });

  /* ================= FETCH PROPERTY ================= */
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("Session expired. Please login again.");

        const res = await axios.get(
          `https://nestpay-backend.onrender.com/api/property/single-property/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProperty(res.data.property);
      } catch {
        setError("Failed to load property");
      }
    };

    if (propertyId) fetchProperty();
  }, [propertyId]);

  /* ================= FETCH VACANT UNITS ================= */
  useEffect(() => {
    const fetchVacantUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `https://nestpay-backend.onrender.com/api/property/all-units/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setVacantUnits(
          res.data.units.filter((unit) => unit.status === "vacant"),
        );
      } catch {
        setError("Failed to load units");
      }
    };

    if (propertyId) fetchVacantUnits();
  }, [propertyId]);

  /* ================= FETCH ACTIVE TENANTS ================= */
  useEffect(() => {
    const fetchActiveTenants = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/tenant/all-tenant",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setActiveTenants(
          res.data.tenants.filter(
            (tenant) => tenant.status === "Active" && tenant.unitId === null,
          ),
        );
      } catch {
        setError("Failed to load tenants");
      }
    };

    fetchActiveTenants();
  }, []);

  /* ================= ALLOCATE ================= */
  const handleUnitAllocation = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔒 prevent double submit
    setError("");
    setSuccess("");

    if (!formData.unitId || !formData.tenantId) {
      setError("Please select unit and tenant");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please login again.");
        return;
      }

      await axios.post(
        "https://nestpay-backend.onrender.com/api/allocation/allocate",
        {
          propertyId,
          unitId: formData.unitId,
          tenantId: formData.tenantId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccess("Unit allocated successfully");

      setFormData({
        unitId: "",
        tenantId: "",
        tenantMobile: "",
        tenantAddress: "",
      });

      // 🔄 refresh lists (MAJOR FIX)
      setVacantUnits((prev) => prev.filter((u) => u._id !== formData.unitId));
      setActiveTenants((prev) =>
        prev.filter((t) => t._id !== formData.tenantId),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  const handleUnitChange = (e) =>
    setFormData({ ...formData, unitId: e.target.value });

  const handleTenantChange = (e) => {
    const tenant = activeTenants.find((t) => t._id === e.target.value);
    setFormData({
      ...formData,
      tenantId: e.target.value,
      tenantMobile: tenant?.tenantMobileNo || "",
      tenantAddress: tenant?.tenantAddress || "",
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-5 pb-24">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-900">Allocate Unit</h1>
        {property && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {property.propertyName}
          </p>
        )}
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleUnitAllocation}
        className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4"
      >
        <SectionTitle>Choose Vacant Unit</SectionTitle>
        <SelectField
          icon={<Home />}
          value={formData.unitId}
          onChange={handleUnitChange}
        >
          <option value="">Select unit</option>
          {vacantUnits.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.unitName}
            </option>
          ))}
        </SelectField>

        <SectionTitle>Select Tenant</SectionTitle>
        <SelectField
          icon={<User />}
          value={formData.tenantId}
          onChange={handleTenantChange}
        >
          <option value="">Select tenant</option>
          {activeTenants.map((tenant) => (
            <option key={tenant._id} value={tenant._id}>
              {tenant.tenantName}
            </option>
          ))}
        </SelectField>

        <ReadOnly
          icon={<Phone />}
          label="Tenant Mobile"
          value={formData.tenantMobile}
        />
        <ReadOnly
          icon={<MapPin />}
          label="Tenant Address"
          value={formData.tenantAddress}
        />

        <button
          type="submit"
          disabled={loading || !formData.unitId || !formData.tenantId}
          className="w-full bg-[#020617] text-white font-black py-3 rounded-xl
                     flex items-center justify-center gap-2
                     disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          {loading ? "Allocating..." : "Allocate Unit"}
        </button>
      </form>
    </div>
  );
};

/* ---------- SMALL UI PARTS ---------- */

const SectionTitle = ({ children }) => (
  <p className="text-[11px] uppercase tracking-widest font-black text-slate-400">
    {children}
  </p>
);

const SelectField = ({ icon, children, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </div>
    <select
      {...props}
      required
      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl
                 focus:bg-white focus:border-indigo-600 outline-none font-bold text-sm"
    >
      {children}
    </select>
  </div>
);

const ReadOnly = ({ icon, label, value }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        value={value}
        readOnly
        className="w-full pl-10 pr-3 py-3 bg-slate-100 border border-slate-200
                   rounded-xl font-bold text-sm text-slate-700"
      />
    </div>
  </div>
);

export default UnitAllocation;
