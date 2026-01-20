import React, { useEffect, useState } from "react";
import axios from "axios";

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
        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile(res.data.profile);
        console.log(res.data.profile);
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
        "http://localhost:5000/api/admin/profile-update",
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
  if (pageLoading) return <p>Loading admin profile...</p>;
  if (!profile) return <p>Profile not found</p>;

  return (
    <div>
      <h2>Admin Profile</h2>

      {/* ===== READ ONLY INFO ===== */}
      <div>
        <label>Role</label>
        <input value={profile.adminId.role} readOnly />

        <label>Name</label>
        <input value={profile.adminId.name} readOnly />

        <label>Mobile No</label>
        <input value={profile.adminId.mobileNo} readOnly />
      </div>

      {/* ===== EDITABLE INFO ===== */}
      <div>
        <label>Address</label>
        <input
          value={form.address}
          placeholder="Enter address"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <label>Pincode</label>
        <input
          value={form.pincode}
          placeholder="Enter pincode"
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
      </div>

      {/* ===== META INFO ===== */}
      <p>
        Profile Created On: {new Date(profile.createdAt).toLocaleDateString()}
      </p>

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default ProfileAdmin;
