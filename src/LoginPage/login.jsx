import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
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
    setError("");

    try {
      const response = await axios.post(
        "https://nestpay-backend.onrender.com/api/auth/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setformData({ mobileNo: "", password: "" });
      setError("Login Successfully");

      if (response.data.success) {
        setTimeout(() => {
          navigate(
            response.data.role === "admin"
              ? "/admin-dashboard"
              : "/tenant-home",
          );
        }, 1000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login Failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans selection:bg-indigo-100">
      {/* ===== LEFT PANEL (Desktop Only 65%) ===== */}
      <div className="relative hidden lg:flex lg:w-[65%] flex-col justify-between p-16 bg-[#0f172a] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px]"></div>
        </div>

        {/* Top Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            NestPay
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Zap className="w-3 h-3" /> v2.0 Now Live
          </div>
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-8 tracking-tight">
            The intelligent way to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              manage your rentals.
            </span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed mb-12">
            Automate your workflow, track every payment, and keep your tenants
            happy with our all-in-one ecosystem.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <FeatureSmall
              icon={<ShieldCheck />}
              title="Encrypted"
              desc="AES-256 data security"
            />
            <FeatureSmall
              icon={<CheckCircle2 />}
              title="Automated"
              desc="Instant rent receipts"
            />
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          <span>© 2026 NestPay Inc.</span>
        </div>
      </div>

      {/* ===== RIGHT PANEL (Mobile Friendly 35%) ===== */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-50 lg:bg-white">
        {/* Mobile Logo: Only visible on small screens */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 mb-3">
            <Building2 className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            NestPay
          </h1>
        </div>

        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-sm lg:shadow-none border border-slate-100 lg:border-none">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLoginBtn} className="space-y-5">
            {/* Status Alert */}
            {error && (
              <div
                className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 transition-all ${
                  error === "Login Successfully"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-rose-50 text-rose-700 border-rose-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${error === "Login Successfully" ? "bg-emerald-500" : "bg-rose-500"}`}
                />
                {error}
              </div>
            )}

            {/* Input Groups */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Enter mobile number"
                    value={formData.mobileNo}
                    onChange={(e) =>
                      setformData({ ...formData, mobileNo: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 lg:bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 text-base"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgetpass"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInputField
                  formData={formData}
                  setformData={setformData}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.96] flex items-center justify-center gap-3 group mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Signup Link */}
            <div className="text-center pt-2">
              <p className="text-slate-500 text-sm font-medium">
                New to NestPay?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-bold hover:text-indigo-800 border-b-2 border-indigo-50 pb-0.5"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const FeatureSmall = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-semibold text-sm">{title}</h4>
      <p className="text-slate-500 text-xs mt-1">{desc}</p>
    </div>
  </div>
);

export default Login;
