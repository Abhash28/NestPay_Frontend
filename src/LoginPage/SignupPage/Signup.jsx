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
  const navigate = useNavigate();

  const handleSignupBtn = async (e) => {
    e.preventDefault();
    seterror("");
    try {
      const response = await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/signup",
        formData
      );
      alert(response.data.message);
      setformData({ name: "", mobileNo: "", password: "" });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.message || "signUp failed");
      } else {
        seterror("Server not responding");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <form
        onSubmit={handleSignupBtn}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border"
      >
        {/* BRAND HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-wide">
            NestPay
          </h1>
          <p className="text-sm text-gray-500">
            Create Admin Account
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* ADMIN NAME */}
        <div className="space-y-2">
          <label
            htmlFor="AdminName"
            className="text-sm font-medium text-gray-700"
          >
            Admin Name
          </label>
          <input
            id="AdminName"
            type="text"
            placeholder="Enter admin name"
            value={formData.name}
            onChange={(e) =>
              setformData({ ...formData, name: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* MOBILE NUMBER */}
        <div className="space-y-2">
          <label
            htmlFor="MobileNo"
            className="text-sm font-medium text-gray-700"
          >
            Admin Mobile Number
          </label>
          <input
            id="MobileNo"
            type="text"
            placeholder="Enter mobile number"
            value={formData.mobileNo}
            onChange={(e) =>
              setformData({ ...formData, mobileNo: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* PASSWORD FIELD (component unchanged) */}
        <PasswordInputField formData={formData} setformData={setformData} />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Create Admin Account
        </button>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 pt-4 border-t">
          © 2026 NestPay · Secure Rent Management Platform
        </p>
      </form>
    </div>
  );
}

export default Signup;
