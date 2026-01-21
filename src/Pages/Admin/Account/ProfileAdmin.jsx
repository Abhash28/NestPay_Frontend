import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, MapPin, Hash, ShieldCheck, Loader2 } from "lucide-react";

const ProfileAdmin = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ address: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/admin/profile",
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

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        "https://nestpay-backend.onrender.com/api/admin/profile-update",
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
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGE LOADER ================= */

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading admin profile…
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-rose-600 font-bold">
        Profile not found
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-8 pb-24">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Admin Profile
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your personal and contact details
        </p>
      </div>

      {/* ===== ACCOUNT INFO ===== */}
      <Card title="Account Information">
        <ReadOnlyField
          icon={<ShieldCheck className="w-5 h-5" />}
          label="Role"
          value={profile.adminId.role}
        />

        <ReadOnlyField
          icon={<User className="w-5 h-5" />}
          label="Name"
          value={profile.adminId.name}
        />

        <ReadOnlyField
          icon={<Phone className="w-5 h-5" />}
          label="Mobile Number"
          value={profile.adminId.mobileNo}
        />
      </Card>

      {/* ===== CONTACT INFO ===== */}
      <Card title="Contact Details">
        <InputField
          icon={<MapPin className="w-5 h-5" />}
          label="Address"
          placeholder="Enter your address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <InputField
          icon={<Hash className="w-5 h-5" />}
          label="Pincode"
          placeholder="Enter pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
      </Card>

      {/* ===== META ===== */}
      <p className="text-xs text-slate-500">
        Profile created on{" "}
        <span className="font-bold text-slate-700">
          {new Date(profile.createdAt).toLocaleDateString()}
        </span>
      </p>

      {/* ===== ACTION ===== */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800
                   disabled:bg-slate-300 text-white font-black
                   px-8 py-4 rounded-2xl shadow-lg
                   transition active:scale-[0.98]
                   flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Updating…
          </>
        ) : (
          "Update Profile"
        )}
      </button>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
    <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">
      {title}
    </h2>
    {children}
  </div>
);

const ReadOnlyField = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div
      className="w-11 h-11 rounded-xl bg-slate-100
                    flex items-center justify-center text-slate-600"
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="font-black text-slate-900">{value || "—"}</p>
    </div>
  </div>
);

const InputField = ({ icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-slate-50
                   border border-slate-200 rounded-2xl
                   focus:bg-white focus:border-indigo-600
                   focus:ring-4 focus:ring-indigo-500/10
                   outline-none transition
                   font-bold text-slate-900
                   placeholder:text-slate-300"
      />
    </div>
  </div>
);

export default ProfileAdmin;
