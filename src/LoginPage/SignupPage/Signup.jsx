import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User,
  Phone,
  ArrowRight,
  Building2,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Loader2,
} from "lucide-react";
import PasswordInputField from "../PasswordInput/PasswordInput";

function Signup() {
  const [formData, setformData] = useState({
    name: "",
    mobileNo: "",
    password: "",
  });
  const [error, seterror] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupBtn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    seterror("");
    try {
      await axios.post(
        "https://nestpay-backend.onrender.comapi/auth/signup",
        formData,
      );
      setformData({ name: "", mobileNo: "", password: "" });
      navigate("/login");
    } catch (error) {
      seterror(error.response?.data?.message || "Signup failed. Try again.");
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

        {/* Trust Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-6xl font-black text-white leading-tight mb-6">
            Built for
            <br />
            <span className="text-indigo-400">Serious Admins.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Create your admin account and manage properties, tenants, and rent
            with complete confidence and enterprise-grade security.
          </p>

          <div className="space-y-5">
            <TrustRow
              icon={<ShieldCheck />}
              title="Secure by Default"
              desc="Encrypted data & protected access"
            />
            <TrustRow
              icon={<Lock />}
              title="Private Admin Access"
              desc="Only authorized users allowed"
            />
            <TrustRow
              icon={<BadgeCheck />}
              title="Reliable Platform"
              desc="Built for long-term usage"
            />
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm">
          © 2026 NestPay Inc. · Trusted Rent Management
        </p>
      </div>

      {/* ================= RIGHT SIGNUP PANEL (35%) ================= */}
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
            <h2 className="text-3xl font-black text-slate-900">
              Create Admin Account
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              Start managing with confidence
            </p>
          </div>

          <form onSubmit={handleSignupBtn} className="space-y-5">
            {error && (
              <div className="p-4 rounded-2xl text-[13px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                {error}
              </div>
            )}

            {/* Admin Name */}
            <div className="space-y-2">
              <label className={labelBase}>Admin Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) =>
                    setformData({ ...formData, name: e.target.value })
                  }
                  className={inputBase}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className={labelBase}>Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setformData({ ...formData, mobileNo: e.target.value })
                  }
                  className={inputBase}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className={labelBase}>Set Password</label>
              <PasswordInputField
                formData={formData}
                setformData={setformData}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#020617] hover:bg-indigo-700 disabled:bg-slate-300
                         text-white font-black py-5 rounded-2xl shadow-lg
                         transition-all active:scale-[0.98]
                         flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">
                    Create Account
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="pt-6 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-black hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= Shared UI ================= */

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

export default Signup;
