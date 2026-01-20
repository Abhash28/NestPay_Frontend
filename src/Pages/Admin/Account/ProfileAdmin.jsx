import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, MapPin, Hash, ShieldCheck, Loader2 } from "lucide-react";

const ProfileAdmin = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    address: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://nestpay-backend.onrender.comapi/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setProfile(res.data.profile);
        setForm({
          address: res.data.profile.address || "",
          pincode: res.data.profile.pincode || "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        "https://nestpay-backend.onrender.comapi/admin/profile-update",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setProfile(res.data.profile);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI STATES =================
  if (pageLoading)
    return (
      <div className="p-6 text-slate-500 font-medium">
        Loading admin profile...
      </div>
    );

  if (!profile)
    return <div className="p-6 text-rose-600 font-bold">Profile not found</div>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl space-y-8">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Admin Profile
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage your personal and contact details
        </p>
      </div>

      {/* ===== READ ONLY INFO ===== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">
          Account Info
        </h2>

        <ReadOnlyField
          icon={<ShieldCheck />}
          label="Role"
          value={profile.adminId.role}
        />

        <ReadOnlyField
          icon={<User />}
          label="Name"
          value={profile.adminId.name}
        />

        <ReadOnlyField
          icon={<Phone />}
          label="Mobile Number"
          value={profile.adminId.mobileNo}
        />
      </div>

      {/* ===== EDITABLE INFO ===== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">
          Contact Details
        </h2>

        <InputField
          icon={<MapPin />}
          label="Address"
          placeholder="Enter address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <InputField
          icon={<Hash />}
          label="Pincode"
          placeholder="Enter pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
      </div>

      {/* ===== META INFO ===== */}
      <div className="text-sm text-slate-500 font-medium">
        Profile created on{" "}
        <span className="font-bold text-slate-700">
          {new Date(profile.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* ===== ACTION ===== */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full sm:w-auto bg-[#020617] hover:bg-indigo-700 disabled:bg-slate-300
                   text-white font-black px-8 py-4 rounded-2xl shadow-lg
                   transition-all active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Profile"
        )}
      </button>
    </div>
  );
};

/* ================= REUSABLE UI ================= */

const ReadOnlyField = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const InputField = ({ icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        {...props}
        className="
          w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl
          focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5
          outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300
        "
      />
    </div>
  </div>
);

export default ProfileAdmin;
