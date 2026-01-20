import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setProperty(res.data.allProperty || []);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error(error);
        }
      }
    };
    fetchProperties();
  }, [navigate]);

  const hanldeEdit = (e, property) => {
    e.stopPropagation();
    setSelectProperty(property);
    setShowModal(true);
  };

  const handleUpdateProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://nestpay-backend.onrender.com/api/property/update-property",
        { property: selectProperty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowModal(false);
      // Refresh data
      const res = await axios.get(
        "https://nestpay-backend.onrender.com/api/property/all-property",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProperty(res.data.allProperty || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Properties</h1>

      <div>
        <input type="text" placeholder="Search Property..." />
        <button onClick={() => navigate("/admin/property/add-property")}>
          Add Property
        </button>
        <select>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <table
        border="1"
        width="100%"
        style={{ marginTop: "20px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Property Name</th>
            <th>Address</th>
            <th>Monthly Rent</th>
            <th>Total Units</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {property.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No properties found
              </td>
            </tr>
          ) : (
            property.map((item, index) => (
              <tr
                key={item._id}
                onClick={() =>
                  navigate(`/admin/property/${item._id}/unit-detail`)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td>{item.propertyName}</td>
                <td>{item.propertyAddress}</td>
                <td>{item.monthlyRent}</td>
                <td>{item.totalUnit}</td>
                <td>
                  <button onClick={(e) => hanldeEdit(e, item)}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Edit Property</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                value={selectProperty.propertyName}
                onChange={(e) =>
                  setSelectProperty({
                    ...selectProperty,
                    propertyName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                value={selectProperty.propertyAddress}
                onChange={(e) =>
                  setSelectProperty({
                    ...selectProperty,
                    propertyAddress: e.target.value,
                  })
                }
              />
              <input
                type="number"
                value={selectProperty.monthlyRent}
                onChange={(e) =>
                  setSelectProperty({
                    ...selectProperty,
                    monthlyRent: e.target.value,
                  })
                }
              />
            </div>
            <div style={{ marginTop: "15px" }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleUpdateProperty}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Property;
