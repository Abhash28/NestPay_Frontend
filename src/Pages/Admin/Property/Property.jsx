import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Property = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState([]);

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
          }
        );

        console.log("API data:", res.data.allProperty);
        setProperty(res.data.allProperty || []);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchProperties();
  }, []);

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
                <button>Action</button>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default Property;
