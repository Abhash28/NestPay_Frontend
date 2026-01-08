import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UnitDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `https://nestpay-backend.onrender.com/api/property/all-units/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUnits(res.data.units || []);
        console.log(res.data.units);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUnits();
  }, [propertyId, navigate]);

  //check the seat allot or not
  const vacantCount = units.filter((unit) => unit.status === "vacant").length;
  const occupiedCount = units.filter(
    (unit) => unit.status === "occupied"
  ).length;
  return (
    <div>
      <h2>Units</h2>
      <h2>Occupied:{occupiedCount}</h2>
      <h2>Vacant:{vacantCount}</h2>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Unit Number</th>
            <th>Status</th>
            <th>Rent</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {units.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No units found
              </td>
            </tr>
          ) : (
            units.map((unit, index) => (
              <tr key={unit._id}>
                <td>{index + 1}</td>
                <td>{unit.unitNumber}</td>
                <td>{unit.status || "Vacant"}</td>
                <td>{unit.monthlyRent}</td>
                <td>
                  {unit.status === "vacant" ? (
                    <button>Allot</button>
                  ) : (
                    <button disabled>Occupied</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UnitDetail;
