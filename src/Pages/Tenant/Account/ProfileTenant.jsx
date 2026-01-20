import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileTenant = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const profileData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/tenant/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setProfile(res.data.profile);
      } catch (err) {
        console.error(err);
        setError("Failed to load tenant profile");
      } finally {
        setLoading(false);
      }
    };

    profileData();
  }, []);
  // ================= UI STATES =================
  if (loading) return <p>Loading tenant profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div>
      <h2>Tenant Profile</h2>

      <label>Name</label>
      <input value={profile.tenantName || ""} readOnly />

      <label>Mobile No</label>
      <input value={profile.tenantMobileNo || ""} readOnly />

      <label>Status</label>
      <input value={profile.status || ""} readOnly />

      <label>Address</label>
      <input value={profile.tenantAddress || "-"} readOnly />

      <p>Joined On: {new Date(profile.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ProfileTenant;
