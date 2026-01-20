import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  ArrowRight,
  Building2,
  Loader2,
  KeyRound,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import PasswordInputField from "../PasswordInput/PasswordInput";

function ForgetPass() {
  const [formData, setFormData] = useState({ mobileNo: "", password: "" });
  const [foundUser, setFoundUser] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFindUser = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/check-user",
        { mobileNo: formData.mobileNo },
      );
      if (response.data.success) {
        setFoundUser(true);
      } else {
        setFoundUser(false);
        setError("Account not found. Please check the number.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server not responding");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/change-pass",
        { mobileNo: formData.mobileNo, password: formData.password },
      );
      // Success state
      setFormData({ mobileNo: "", password: "" });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      {/* ===== LEFT PANEL (Desktop Only) ===== */}
      <div className="relative hidden lg:flex lg:w-[65%] flex-col justify-between p-16 bg-[#0f172a] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[0%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            NestPay
          </span>
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-8 tracking-tight">
            Regain access to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              your dashboard.
            </span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            Securely reset your password using your registered mobile number.
          </p>
        </div>
        <p className="relative z-10 text-slate-500 text-sm">
          © 2026 NestPay Inc.
        </p>
      </div>

      {/* ===== RIGHT PANEL (Mobile Friendly) ===== */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-50 lg:bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-3">
            <KeyRound className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
        </div>

        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-sm lg:shadow-none border border-slate-100 lg:border-none">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              {foundUser ? "Create New Password" : "Find Your Account"}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {foundUser
                ? "Account verified! Set a strong password below."
                : "Enter your registered number to continue."}
            </p>
          </div>

          <form onSubmit={handleChangePass} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl text-sm font-medium border bg-rose-50 text-rose-700 border-rose-100 flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Step 1: Mobile Input */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  disabled={foundUser}
                  placeholder="09123456789"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNo: e.target.value })
                  }
                  className={`w-full pl-12 pr-4 py-3.5 sm:py-4 border rounded-2xl outline-none transition-all text-base
                    ${foundUser ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 lg:bg-white border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"}`}
                />
                {foundUser && (
                  <UserCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Step 2: Password Input (Appears only after user is found) */}
            {foundUser && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                    New Password
                  </label>
                  <PasswordInputField
                    formData={formData}
                    setformData={setFormData}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.96] flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            )}

            {/* Step 1 Button: Verify */}
            {!foundUser && (
              <button
                type="button"
                onClick={handleFindUser}
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-[0.96] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Verify Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-slate-500 text-sm font-bold hover:text-indigo-600 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPass;
