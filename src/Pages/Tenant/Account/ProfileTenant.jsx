import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, MapPin, ShieldCheck, Calendar } from "lucide-react";

const ProfileTenant = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const controller = new AbortController();

    const profileData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/tenant/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          },
        );

        setProfile(res.data.profile);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Tenant profile error:", err);
          setError("Failed to load tenant profile");
        }
      } finally {
        setLoading(false);
      }
    };

    profileData();
    return () => controller.abort();
  }, []);

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading profile…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-rose-600 font-semibold">{error}</div>
    );
  }

  if (!profile) {
    return <div className="text-center text-slate-500">No profile found</div>;
  }

  return (
    <div className="space-y-6">
      {/* ===== PROFILE HEADER ===== */}
      <div className="flex flex-col items-center text-center">
        <div
          className="w-20 h-20 rounded-full bg-indigo-100
                     flex items-center justify-center"
        >
          <User className="w-9 h-9 text-indigo-600" />
        </div>

        <h1 className="mt-3 text-xl font-black text-slate-900">
          {profile.tenantName}
        </h1>

        <span
          className={`mt-1 text-xs font-black px-3 py-1 rounded-full
            ${
              profile.status === "Active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
        >
          {profile.status}
        </span>
      </div>

      {/* ===== DETAILS CARD ===== */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <InfoRow
          icon={<Phone />}
          label="Mobile Number"
          value={profile.tenantMobileNo}
        />

        <InfoRow
          icon={<MapPin />}
          label="Address"
          value={profile.tenantAddress || "—"}
        />

        <InfoRow icon={<ShieldCheck />} label="Account Type" value="Tenant" />

        <InfoRow
          icon={<Calendar />}
          label="Joined On"
          value={new Date(profile.createdAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
};

/* ================= SMALL UI ================= */

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-10 h-10 rounded-lg bg-slate-100
                 flex items-center justify-center text-slate-500"
    >
      {icon}
    </div>

    <div className="flex-1">
      <p
        className="text-[11px] font-black text-slate-400
                   uppercase tracking-widest"
      >
        {label}
      </p>
      <p className="font-bold text-slate-800 text-sm">{value}</p>
    </div>
  </div>
);

export default ProfileTenant;
