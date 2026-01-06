import { useState } from "react";
import axios from "axios";
import PasswordInputField from "./PasswordInput/PasswordInput";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({ mobileNo: "", password: "" });
  const [error, setError] = useState("");

  const handleLoginBtn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );
      console.log(response.data.token);
      localStorage.setItem("token",response.data.token)
      setformData({ mobileNo: "", password: "" });
      setError("Login Successfully");
      if (response.data.success) {
        navigate("/admin-dashboard")
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login Failed");
      } else {
        setError("Server not responding");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <form
        onSubmit={handleLoginBtn}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border"
      >
        {/* BRAND HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-wide">
            NestPay
          </h1>
          <p className="text-sm text-gray-500">
            Rent & Property Management System
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* MOBILE INPUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="text"
            placeholder="Enter mobile number"
            value={formData.mobileNo}
            onChange={(e) =>
              setformData({ ...formData, mobileNo: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* PASSWORD INPUT (unchanged logic) */}
        <PasswordInputField formData={formData} setformData={setformData} />

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Login to Dashboard
        </button>

        {/* FOOTER LINKS */}
        <div className="text-center text-sm space-y-2">
          <p className="text-gray-600">
            New Admin?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create Account
            </Link>
          </p>

          <p>
            <Link
              to="/forgetpass"
              className="text-indigo-600 hover:underline"
            >
              Forgot Password
            </Link>
          </p>
        </div>

        {/* FOOTER BRAND */}
        <p className="text-xs text-center text-gray-400 pt-4 border-t">
          © 2026 NestPay · Secure Rent Management
        </p>
      </form>
    </div>
  );
}

export default Login;
