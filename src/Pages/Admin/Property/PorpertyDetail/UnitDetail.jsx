import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
        `http://localhost:5000/api/property/all-units/${propertyId}`,
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
    if (!unitName || !monthlyRent) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/unit/create-unit",
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

  // OPEN EDIT MODAL
  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setUnitName(unit.unitName);
    setMonthlyRent(unit.monthlyRent);
    setShowEditModal(true);
  };

  // UPDATE UNIT
  const handleUpdateUnit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/unit/update-unit`,
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
    <div>
      <h2>Units</h2>
      <p>Occupied: {occupiedCount}</p>
      <p>Vacant: {vacantCount}</p>

      <button
        onClick={() =>
          navigate(`/admin/property/unit-detail/${propertyId}/allocation`)
        }
      >
        Unit Allocation
      </button>

      <button onClick={() => setShowAddModal(true)}>Add Unit</button>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Unit Name</th>
            <th>Rent</th>
            <th>Tenant Name</th>
            <th>Tenant Mobile No</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {units.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">
                No units found
              </td>
            </tr>
          ) : (
            units.map((unit, index) => (
              <tr key={unit._id}>
                <td>{index + 1}</td>
                <td>{unit.unitName}</td>
                <td>₹{unit.monthlyRent}</td>
                <td>{unit.tenantId?.tenantName || "-"}</td>
                <td>{unit.tenantId?.tenantMobileNo || "-"}</td>
                <td>{unit.status === "occupied" ? "Occupied" : "Vacant"}</td>

                <td>
                  <button onClick={() => handleEditClick(unit)}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Add Unit</h3>

            <input
              placeholder="Unit Name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Monthly Rent"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
            />

            <button onClick={handleAddUnit}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Unit</h3>

            <input
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />

            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
            />

            <button onClick={handleUpdateUnit}>Update</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitDetail;
