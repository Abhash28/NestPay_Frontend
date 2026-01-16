import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UnitAllocation = () => {
  const { propertyId } = useParams();

  //  State
  const [property, setProperty] = useState(null);
  const [vacantUnits, setVacantUnits] = useState([]);
  const [activeTenants, setActiveTenants] = useState([]);
  //log Error
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    unitId: "",
    tenantId: "",
    tenantMobile: "",
    tenantAddress: "",
  });
  //  Fetch single property
  useEffect(() => {
    const fetchProperty = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/property/single-property/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProperty(res.data.property);
    };

    if (propertyId) fetchProperty();
  }, [propertyId]);

  //  Fetch vacant units
  useEffect(() => {
    const fetchVacantUnits = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/property/all-units/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const vacant = res.data.units.filter((unit) => unit.status === "vacant");

      setVacantUnits(vacant);
    };

    if (propertyId) fetchVacantUnits();
  }, [propertyId]);

  //  Fetch active + free tenants
  useEffect(() => {
    const fetchActiveTenants = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/tenant/all-tenant",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const freeActiveTenants = res.data.tenants.filter(
        (tenant) => tenant.status === "Active" && tenant.unitId === null
      );

      setActiveTenants(freeActiveTenants);
    };

    fetchActiveTenants();
  }, []);

  //unit allocation
  const handleUnitAllocation = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/allocation/allocate",
        {
          propertyId,
          unitId: formData.unitId,
          tenantId: formData.tenantId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData({
        unitId: "",
        tenantId: "",
        tenantMobile: "",
        tenantAddress: "",
      });
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server not Responding");
      }
    }
  };
  //  Handle unit change
  const handleUnitChange = (e) => {
    setFormData({
      ...formData,
      unitId: e.target.value,
    });
  };

  //  Handle tenant change + auto-fill mobile
  const handleTenantChange = (e) => {
    const selectedTenantId = e.target.value;

    const selectedTenant = activeTenants.find(
      (tenant) => tenant._id === selectedTenantId
    );

    setFormData({
      ...formData,
      tenantId: selectedTenantId,
      tenantMobile: selectedTenant?.tenantMobileNo || "",
      tenantAddress: selectedTenant?.tenantAddress || "",
    });
  };

  return (
    <div>
      <h2>Unit Allocation</h2>
      {error && <p>{error}</p>}

      {property && <h3>Property: {property.propertyName}</h3>}

      <form onSubmit={handleUnitAllocation}>
        {/* UNIT SELECT */}
        <label>Vacant Unit</label>
        <br />
        <select value={formData.unitId} onChange={handleUnitChange}>
          <option value="">--- Select Unit ---</option>
          {vacantUnits.map((unit) => (
            <option key={unit._id} value={unit._id}>
              Unit {unit.unitNumber}
            </option>
          ))}
        </select>

        <br />
        <br />

        {/* TENANT SELECT */}
        <label>Tenant</label>
        <br />
        <select value={formData.tenantId} onChange={handleTenantChange}>
          <option value="">--- Select Tenant ---</option>
          {activeTenants.map((tenant) => (
            <option key={tenant._id} value={tenant._id}>
              {tenant.tenantName}
            </option>
          ))}
        </select>

        <br />
        <br />

        {/* TENANT MOBILE */}
        <label>Tenant Mobile</label>
        <br />
        <input type="text" value={formData.tenantMobile} readOnly />
        {/* TENANT ADDRESS */}
        <label>Tenant Address</label>
        <br />
        <input type="text" value={formData.tenantAddress} readOnly />
        <button>Allot Unit</button>
      </form>
    </div>
  );
};

export default UnitAllocation;
