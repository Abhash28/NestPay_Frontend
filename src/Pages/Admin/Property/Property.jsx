import "../../../components/Modal/modal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Property = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState([]);
  //modal for edit property
  const [showModal, setShowModal] = useState(false);
  //set property in this for edit
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
          }
        );

        setProperty(res.data.allProperty || []);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchProperties();
  }, [property]);

  //edit property modal
  const hanldeEdit = (e, property) => {
    e.stopPropagation();
    setSelectProperty(property);
    setShowModal(true);
  };

  //update property
  const handleUpdateProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/property/update-property",
        {
          property: selectProperty,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Property</h1>

      <input type="text" placeholder="Search Property..." />

      <button onClick={() => navigate("/admin/property/add-property")}>
        Add Property
      </button>
      <select name="" id="">
        <option value="">Active</option>
        <option value="">Inactive</option>
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
              <td colSpan="4" style={{ textAlign: "center" }}>
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
                <td>{item.totalUnits}</td>
                <button onClick={(e) => hanldeEdit(e, item)}>edit</button>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*when click on edit property then open modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit Property</h3>

            <input
              type="text"
              defaultValue={selectProperty.propertyName}
              onChange={(e) => {
                setSelectProperty({
                  ...selectProperty,
                  propertyName: e.target.value,
                });
              }}
            />

            <input
              type="text"
              defaultValue={selectProperty.propertyAddress}
              onChange={(e) => {
                setSelectProperty({
                  ...selectProperty,
                  propertyAddress: e.target.value,
                });
              }}
            />

            <input
              type="number"
              defaultValue={selectProperty.monthlyRent}
              onChange={(e) => {
                setSelectProperty({
                  ...selectProperty,
                  monthlyRent: e.target.value,
                });
              }}
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
