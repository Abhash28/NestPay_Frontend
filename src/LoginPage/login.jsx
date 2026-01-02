import { useState } from "react";
import axios from "axios";
import PasswordInputField from "./PasswordInput/PasswordInput";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({ mobileNo: "", password: "" });
  const [error, setError] = useState("");

  const handleLoginBtn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://nestpay.onrender.com/api/auth/login",
        formData,
        { withCredentials: true }
      );
      //empty from data
      setformData({ mobileNo: "", password: "" });
      setError("Signup Successfully");
      navigate("/admin-dashboard");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login Failed");
      } else {
        setError("Server not responding");
      }
    }
  };
  return (
    <>
      <form onSubmit={handleLoginBtn}>
        <h1>NestPay,Login</h1>
        {/* ERROR MESSAGE */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label htmlFor="MobileNo">Mobile No : </label>
        <input
          id="MobileNo"
          type="text"
          placeholder="Enter Mobile no"
          value={formData.mobileNo}
          onChange={(e) => {
            setformData({ ...formData, mobileNo: e.target.value });
          }}
        />
        <PasswordInputField formData={formData} setformData={setformData} />
        <button type="submit">Login</button>
        <p>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
        <p>
          <Link to="/forgetpass">Forget Password</Link>
        </p>
      </form>
    </>
  );
}
export default Login;
