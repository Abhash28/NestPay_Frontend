import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

function PasswordInputField({ formData, setformData }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative group">
      {/* Left Lock Icon */}
      <Lock
        className="absolute left-4 top-1/2 -translate-y-1/2
                   w-5 h-5 text-slate-400
                   group-focus-within:text-indigo-600
                   transition-colors"
      />

      <input
        type={isVisible ? "text" : "password"}
        required
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setformData({ ...formData, password: e.target.value })}
        className="
          w-full pl-12 pr-14 py-4
          bg-slate-50 border border-slate-100 rounded-2xl
          focus:bg-white focus:border-indigo-600
          focus:ring-4 focus:ring-indigo-500/5
          outline-none transition-all
          font-bold text-slate-900 placeholder:text-slate-300 text-base
        "
      />

      {/* Eye Toggle */}
      <button
        type="button"
        aria-label="Toggle password visibility"
        onClick={() => setIsVisible(!isVisible)}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          p-2 rounded-xl
          text-slate-400 hover:text-indigo-600
          transition-all active:scale-90
        "
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
