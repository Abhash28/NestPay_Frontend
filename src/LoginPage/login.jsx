import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  ArrowRight,
  Building2,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import PasswordInputField from "./PasswordInput/PasswordInput";

function Login() {
  const navigate = useNavigate();
  const [formData, setformData] = useState({ mobileNo: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginBtn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (response.data.success) {
        response.data.role === "admin"
          ? navigate("/admin-dashboard")
          : navigate("/tenant-home");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Unable to login. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ================= LEFT TRUST PANEL (65%) ================= */}
      <div className="relative hidden lg:flex lg:w-[65%] flex-col justify-between p-20 bg-[#020617] overflow-hidden">
        {/* Soft trust glow */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]" />
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

        {/* Trust Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-6xl font-black text-white leading-tight mb-6">
            Secure.
            <br />
            Reliable.
            <br />
            <span className="text-indigo-400">Built for Admins.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            NestPay is trusted by property owners to manage rent, tenants, and
            payments with complete confidence and security.
          </p>

          {/* Trust points */}
          <div className="space-y-5">
            <TrustRow
              icon={<ShieldCheck />}
              title="Enterprise-grade Security"
              desc="Encrypted data & protected access"
            />
            <TrustRow
              icon={<Lock />}
              title="Private & Secure Login"
              desc="Only authorized admins can access"
            />
            <TrustRow
              icon={<BadgeCheck />}
              title="Reliable Platform"
              desc="Built for long-term property management"
            />
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm">
          © 2026 NestPay Inc. · Trusted Rent Management
        </p>
      </div>

      {/* ================= RIGHT LOGIN PANEL (35%) ================= */}
      <div className="flex-1 lg:w-[35%] flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <Building2 className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">NestPay</h2>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900">Admin Login</h2>
            <p className="text-slate-500 font-medium mt-2">
              Access your secure dashboard
            </p>
          </div>

          <form onSubmit={handleLoginBtn} className="space-y-5">
            {error && (
              <div className="p-4 rounded-2xl text-[13px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                {error}
              </div>
            )}

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="09123456789"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setformData({ ...formData, mobileNo: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
                Password
              </label>
              <PasswordInputField
                formData={formData}
                setformData={setformData}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#020617] hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">
                    Secure Login
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="pt-6 text-center space-y-2">
              <p className="text-slate-500 text-sm font-medium">
                New Admin?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-black hover:underline"
                >
                  Create Account
                </Link>
              </p>

              <Link
                to="/forgetpass"
                className="text-sm font-bold text-indigo-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===== Trust Row ===== */
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

export default Login;
