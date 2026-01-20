import "../../../components/Modal/modal.css";
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
          "http://localhost:5000/api/property/all-property",
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
  }, []); // ✅ FIXED HERE

  const hanldeEdit = (e, property) => {
    e.stopPropagation();
    setSelectProperty(property);
    setShowModal(true);
  };

  const handleUpdateProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/property/update-property",
        { property: selectProperty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Property</h1>

      <input type="text" placeholder="Search Property..." />

      <button onClick={() => navigate("/admin/property/add-property")}>
        Add Property
      </button>

      <select>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Property Name</th>
            <th>Property Address</th>
            <th>Monthly Rent</th>
            <th>Total Units</th>
            <th>Action</th>
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
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit Property</h3>

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

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleUpdateProperty}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Property;
