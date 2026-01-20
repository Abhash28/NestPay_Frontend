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

  const [formData, setFormData] = useState({
    unitId: "",
    tenantId: "",
    tenantMobile: "",
    tenantAddress: "",
  });

  // ================= FETCH PROPERTY =================
  useEffect(() => {
    const fetchProperty = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://nestpay-backend.onrender.com/api/property/single-property/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProperty(res.data.property);
    };
    if (propertyId) fetchProperty();
  }, [propertyId]);

  // ================= FETCH VACANT UNITS =================
  useEffect(() => {
    const fetchVacantUnits = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://nestpay-backend.onrender.com/api/property/all-units/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setVacantUnits(res.data.units.filter((unit) => unit.status === "vacant"));
    };
    if (propertyId) fetchVacantUnits();
  }, [propertyId]);

  // ================= FETCH ACTIVE TENANTS =================
  useEffect(() => {
    const fetchActiveTenants = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://nestpay-backend.onrender.com/api/tenant/all-tenant",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setActiveTenants(
        res.data.tenants.filter(
          (tenant) => tenant.status === "Active" && tenant.unitId === null,
        ),
      );
    };
    fetchActiveTenants();
  }, []);

  // ================= ALLOCATE UNIT =================
  const handleUnitAllocation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://nestpay-backend.onrender.com/api/allocation/allocate",
        {
          propertyId,
          unitId: formData.unitId,
          tenantId: formData.tenantId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setFormData({
        unitId: "",
        tenantId: "",
        tenantMobile: "",
        tenantAddress: "",
      });
      alert("Unit allocated successfully ✅");
    } catch (error) {
      setError(error.response?.data?.message || "Server not responding");
    }
  };

  const handleUnitChange = (e) =>
    setFormData({ ...formData, unitId: e.target.value });

  const handleTenantChange = (e) => {
    const selectedTenant = activeTenants.find((t) => t._id === e.target.value);
    setFormData({
      ...formData,
      tenantId: e.target.value,
      tenantMobile: selectedTenant?.tenantMobileNo || "",
      tenantAddress: selectedTenant?.tenantAddress || "",
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-5">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Unit Allocation</h1>
        {property && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <Building2 className="w-4 h-4" />
            {property.propertyName}
          </p>
        )}
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleUnitAllocation}
        className="bg-white border border-slate-200 rounded-xl p-4 space-y-4"
      >
        {/* UNIT */}
        <SelectField
          icon={<Home />}
          label="Vacant Unit"
          value={formData.unitId}
          onChange={handleUnitChange}
        >
          <option value="">Select Unit</option>
          {vacantUnits.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.unitName}
            </option>
          ))}
        </SelectField>

        {/* TENANT */}
        <SelectField
          icon={<User />}
          label="Tenant"
          value={formData.tenantId}
          onChange={handleTenantChange}
        >
          <option value="">Select Tenant</option>
          {activeTenants.map((tenant) => (
            <option key={tenant._id} value={tenant._id}>
              {tenant.tenantName}
            </option>
          ))}
        </SelectField>

        {/* AUTO FILLED DETAILS */}
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

        {/* ACTION */}
        <button
          type="submit"
          disabled={!formData.unitId || !formData.tenantId}
          className="w-full bg-[#020617] text-white font-black py-3 rounded-lg
                     flex items-center justify-center gap-2
                     disabled:bg-slate-300 transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          Allocate Unit
        </button>
      </form>
    </div>
  );
};

/* ===== Small UI Components ===== */

const SelectField = ({ icon, label, children, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <select
        {...props}
        required
        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200
                   rounded-lg focus:bg-white focus:border-indigo-600
                   outline-none font-bold text-sm"
      >
        {children}
      </select>
    </div>
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
                   rounded-lg font-bold text-sm text-slate-700"
      />
    </div>
  </div>
);

export default UnitAllocation;
