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
  ShieldCheck,
  Lock,
  BadgeCheck,
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
        {
          mobileNo: formData.mobileNo,
          password: formData.password,
        },
      );
      setFormData({ mobileNo: "", password: "" });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ================= LEFT TRUST PANEL (65%) ================= */}
      <div className="relative hidden lg:flex lg:w-[65%] flex-col justify-between p-20 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]" />
        </div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <Building2 className="text-white w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            NestPay
          </span>
        </div>

        {/* Trust Copy */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-6xl font-black text-white leading-tight mb-6">
            Account
            <br />
            <span className="text-indigo-400">Recovery.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            We take security seriously. Verify your account and safely reset
            your password in just a few steps.
          </p>

          <div className="space-y-5">
            <TrustRow
              icon={<ShieldCheck />}
              title="Identity Verification"
              desc="Confirm ownership before reset"
            />
            <TrustRow
              icon={<Lock />}
              title="Encrypted Passwords"
              desc="Secure password storage"
            />
            <TrustRow
              icon={<BadgeCheck />}
              title="Trusted Platform"
              desc="Used by property admins daily"
            />
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm">
          © 2026 NestPay Inc. · Secure Access
        </p>
      </div>

      {/* ================= RIGHT FORM PANEL (35%) ================= */}
      <div className="flex-1 lg:w-[35%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              {foundUser ? (
                <UserCheck className="text-white w-8 h-8" />
              ) : (
                <KeyRound className="text-white w-8 h-8" />
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900">NestPay</h2>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900">
              {foundUser ? "Create New Password" : "Reset Access"}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              {foundUser
                ? "Security verified. Set a new password."
                : "Verify your registered mobile number."}
            </p>
          </div>

          <form onSubmit={handleChangePass} className="space-y-5">
            {error && (
              <div className="p-4 rounded-2xl text-[13px] font-bold bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Mobile */}
            <div className="space-y-2">
              <label className={labelBase}>Mobile Number</label>
              <div className="relative">
                <Phone
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    foundUser ? "text-emerald-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="tel"
                  required
                  disabled={foundUser}
                  placeholder="Registered mobile number"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNo: e.target.value })
                  }
                  className={`${inputBase} ${
                    foundUser
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : ""
                  }`}
                />
                {foundUser && (
                  <UserCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Password */}
            {foundUser && (
              <div className="space-y-2">
                <label className={labelBase}>New Password</label>
                <PasswordInputField
                  formData={formData}
                  setformData={setFormData}
                />
              </div>
            )}

            {/* Buttons */}
            {!foundUser ? (
              <button
                type="button"
                onClick={handleFindUser}
                disabled={isLoading}
                className="w-full bg-[#020617] hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">
                      Verify Account
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            )}

            <div className="pt-6 text-center">
              <Link
                to="/login"
                className="text-slate-500 font-black text-sm hover:text-indigo-600"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= Shared ================= */

const inputBase =
  "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl " +
  "focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 " +
  "outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 text-base";

const labelBase =
  "text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1";

const TrustRow = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-semibold text-sm">{title}</h4>
      <p className="text-slate-400 text-xs mt-1">{desc}</p>
    </div>
  </div>
);

export default ForgetPass;
