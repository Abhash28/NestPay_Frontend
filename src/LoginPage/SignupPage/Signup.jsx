import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User,
  Phone,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
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
        "https://nestpay-backend.onrender.com/api/auth/signup",
        formData,
      );
      setformData({ name: "", mobileNo: "", password: "" });
      navigate("/login");
    } catch (error) {
      seterror(error.response?.data?.message || "SignUp failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans selection:bg-indigo-100">
      {/* ===== LEFT PANEL (Hidden on Mobile, 65% on Desktop) ===== */}
      <div className="relative hidden lg:flex lg:w-[65%] flex-col justify-between p-16 bg-[#0f172a] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] animate-pulse"></div>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3 h-3" /> Get started in 2 minutes
          </div>
          <h1 className="text-6xl font-extrabold text-white leading-tight mb-8 tracking-tight">
            Start your journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              as an Admin.
            </span>
          </h1>
          <div className="grid grid-cols-2 gap-8">
            <FeatureSmall
              icon={<ShieldCheck />}
              title="Privacy First"
              desc="Encrypted data"
            />
            <FeatureSmall
              icon={<CheckCircle2 />}
              title="Admin Portal"
              desc="Full control"
            />
          </div>
        </div>
        <p className="relative z-10 text-slate-500 text-sm">
          © 2026 NestPay Inc.
        </p>
      </div>

      {/* ===== RIGHT PANEL (Full width on Mobile, 35% on Desktop) ===== */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-slate-50 lg:bg-white">
        {/* Mobile-Only Header Logo */}
        <div className="lg:hidden flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 mb-4">
            <Building2 className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">NestPay</h1>
        </div>

        <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-sm lg:shadow-none border border-slate-100 lg:border-none">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              Join NestPay and simplify your management.
            </p>
          </div>

          <form onSubmit={handleSignupBtn} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-4 rounded-xl text-sm font-medium border bg-rose-50 text-rose-700 border-rose-100 flex items-center gap-3 animate-bounce-subtle">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                {error}
              </div>
            )}

            {/* Admin Name */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                Admin Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) =>
                    setformData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-base"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="09123456789"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setformData({ ...formData, mobileNo: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                Set Password
              </label>
              <PasswordInputField
                formData={formData}
                setformData={setformData}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.96] flex items-center justify-center gap-3 mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-bold hover:text-indigo-800"
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

export default Signup;
