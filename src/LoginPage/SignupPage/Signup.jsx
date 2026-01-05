import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInputField from "../PasswordInput/PasswordInput";

function Signup() {
  const [formData, setformData] = useState({
    name: "",
    mobileNo: "",
    password: "",
  });
  const [error, seterror] = useState("");
  //navigate
  const navigate = useNavigate();
  const handleSignupBtn = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      const response = await axios.post(
        "https://nestpay.onrender.com/api/auth/signup",
        formData
      );
      alert(response.data.message);
      setformData({ name: "", mobileNo: "", password: "" });
      navigate("/");
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.message || "signUp failed");
      } else {
        seterror("Server not responding");
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSignupBtn}>
        <h1>SignUp</h1>
        {/* ERROR MESSAGE */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label htmlFor="AdminName">Admin Name : </label>
        <input
          id="AdminName"
          type="text"
          placeholder="Enter Name"
          value={formData.name}
          onChange={(e) => setformData({ ...formData, name: e.target.value })}
        />
        <label htmlFor="MobileNo">Admin Mobile no : </label>
        <input
          id="MobileNo"
          type="text"
          placeholder="Enter Mobile No "
          value={formData.mobileNo}
          onChange={(e) =>
            setformData({ ...formData, mobileNo: e.target.value })
          }
        />
        <PasswordInputField formData={formData} setformData={setformData} />
        <button type="submit">Signup</button>
      </form>
    </>
  );
}
export default Signup;
