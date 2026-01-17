import { useState } from "react";
import axios from "axios";
import "./modal.css";

const AddUnitModal = ({ propertyId, onClose, onSuccess }) => {
  const [unitName, setUnitName] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddUnit = async () => {
    if (!unitName || !monthlyRent) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/unit/create-unit",
        {
          propertyId,
          unitName,
          monthlyRent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(); // refresh unit list
      onClose(); // close modal
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add unit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()} // prevent close on box click
      >
        <h3>Add Unit</h3>

        <input
          type="text"
          placeholder="Unit Name (e.g. Room 101)"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Monthly Rent"
          value={monthlyRent}
          onChange={(e) => setMonthlyRent(e.target.value)}
        />

        <div style={{ marginTop: "10px" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleAddUnit} disabled={loading}>
            {loading ? "Adding..." : "Add Unit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUnitModal;
