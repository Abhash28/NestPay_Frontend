import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

function PasswordInputField({ formData, setformData }) {
  const [isVisible, setisVisible] = useState(false);

  return (
    <div className="relative group">
      {/* Left Lock Icon */}
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />

      <input
        id="Password"
        type={isVisible ? "text" : "password"}
        required
        placeholder="Enter password"
        value={formData.password}
        onChange={(e) => setformData({ ...formData, password: e.target.value })}
        /* MATCHING LOGIC: 
           bg-slate-50 makes it that light grey look.
           lg:bg-white ensures it looks premium on desktop.
        */
        className="w-full pl-12 pr-14 py-3.5 sm:py-4 bg-slate-50 lg:bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 text-base"
      />

      {/* Eye Icon Toggle */}
      <button
        type="button"
        onClick={() => setisVisible(!isVisible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
      >
        {isVisible ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

export default PasswordInputField;
