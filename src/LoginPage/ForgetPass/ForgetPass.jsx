import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInputField from "../PasswordInput/PasswordInput";

function ForgetPass() {
  const [formData, setFormData] = useState({ mobileNo: "", password: "" });
  const [foundUser, setFoundUser] = useState(false);
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const handleFindUser = async () => {
    try {
      const response = await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/check-user",
        { mobileNo: formData.mobileNo },
      );
      if (response.data.success) {
        setFoundUser(true);
        seterror("");
      } else {
        setFoundUser(false);
        seterror("User Not found");
      }
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.message);
      } else {
        seterror("Server not responding");
      }
    }
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/change-pass",
        { mobileNo: formData.mobileNo, password: formData.password },
      );
      alert(response.data.message);
      setFormData({ mobileNo: "", password: "" });
      navigate("/login");
    } catch (error) {
      if (error.response) {
        seterror(error.response.data.message);
      } else {
        seterror("Server not responding");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <form
        onSubmit={handleChangePass}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border"
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-indigo-600">NestPay</h1>
          <p className="text-sm text-gray-500">Reset Admin Password</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* MOBILE NUMBER */}
        <div className="space-y-2">
          <label
            htmlFor="MobileNo"
            className="text-sm font-medium text-gray-700"
          >
            Registered Mobile Number
          </label>
          <input
            id="MobileNo"
            type="text"
            placeholder="Enter mobile number"
            value={formData.mobileNo}
            onChange={(e) =>
              setFormData({ ...formData, mobileNo: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* FIND USER BUTTON */}
        {!foundUser && (
          <button
            type="button"
            onClick={handleFindUser}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Verify Account
          </button>
        )}

        {/* PASSWORD RESET SECTION */}
        {foundUser && (
          <div className="space-y-4">
            <PasswordInputField formData={formData} setformData={setFormData} />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Change Password
            </button>
          </div>
        )}

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 pt-4 border-t">
          © 2026 NestPay · Secure Property Access
        </p>
      </form>
    </div>
  );
}

export default ForgetPass;
