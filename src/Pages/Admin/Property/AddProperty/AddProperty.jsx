import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  //navigate
  const navigate = useNavigate();
  // Field names must match DB schema
  const [formData, setFormData] = useState({
    propertyName: "",
    propertyAddress: "",
    monthlyRent: "",
    totalUnits: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setError("");
    try {
      //fetching token form local storage
      const token = localStorage.getItem("token");
      await axios.post(
        "https://nestpay-backend.onrender.com/api/property/add-property",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({
        propertyName: "",
        propertyAddress: "",
        monthlyRent: "",
        totalUnits: "",
      });
      //show success message
      setSuccess("Property added successfully!");
      //after 3 sec success message gone
      setTimeout(() => {
        setSuccess("");
        //navigate to main property page
        navigate("/admin-property");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server not Responding");
      }
    }
  };

  return (
    <>
      <h2>Add Property</h2>
      {/*Success Message */}
      {success && <p>{success}</p>}
      {/*Error log while Adding property */}
      {error && <p>{error}</p>}
      <form onSubmit={handleAddProperty}>
        <p>Property Details</p>

        <label>Property Name</label>
        <input
          type="text"
          value={formData.propertyName}
          placeholder="Enter Property Name..."
          onChange={(e) =>
            setFormData({ ...formData, propertyName: e.target.value })
          }
        />

        <label>Property Address</label>
        <input
          type="text"
          value={formData.propertyAddress}
          placeholder="Enter Property Address"
          onChange={(e) =>
            setFormData({ ...formData, propertyAddress: e.target.value })
          }
        />

        <label>Monthly Rent</label>
        <input
          type="number"
          value={formData.monthlyRent}
          placeholder="Enter Rent Amount..."
          onChange={(e) =>
            setFormData({ ...formData, monthlyRent: e.target.value })
          }
        />

        <label>Total Units</label>
        <input
          type="number"
          value={formData.totalUnits}
          placeholder="How Many Room/Flat/Shop"
          onChange={(e) =>
            setFormData({ ...formData, totalUnits: e.target.value })
          }
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default AddProperty;
