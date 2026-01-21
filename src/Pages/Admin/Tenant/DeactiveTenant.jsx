import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Home, Info } from "lucide-react";

const InactiveTenant = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ================= FETCH TENANTS =================
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://nestpay-backend.onrender.com/api/tenant/all-tenant",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTenants(res.data.tenants || []);
      } catch (err) {
        setError(err.response?.data?.message || "Server not responding");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // ================= FILTER =================
  const inactiveTenants = tenants
    .filter((t) => t.status === "Inactive")
    .filter((t) => t.tenantName?.toLowerCase().includes(search.toLowerCase()));

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading inactive tenants…
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Inactive Tenants</h1>
        <p className="text-xs text-slate-500">
          Tenants who have exited or been deactivated
        </p>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search tenant name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200
                   rounded-lg text-sm font-semibold outline-none"
      />

      {error && (
        <div
          className="bg-rose-50 text-rose-600 text-sm
                        font-semibold p-3 rounded-lg"
        >
          {error}
        </div>
      )}

      {/* ===== LIST ===== */}
      {inactiveTenants.length === 0 ? (
        <div
          className="bg-white border border-slate-200 rounded-xl
                        p-6 text-center text-slate-500 text-sm"
        >
          No inactive tenants found
        </div>
      ) : (
        <div className="space-y-2">
          {inactiveTenants.map((tenant) => (
            <div
              key={tenant._id}
              className="bg-white border border-slate-200
                         rounded-lg p-3 space-y-2"
            >
              {/* Top */}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">
                  {tenant.tenantName}
                </p>

                <span
                  className="text-[11px] px-2 py-[2px]
                                 rounded-full bg-slate-200
                                 text-slate-700 font-semibold"
                >
                  Inactive
                </span>
              </div>

              {/* Info */}
              <Row icon={<Phone />} text={tenant.tenantMobileNo} />
              <Row icon={<MapPin />} text={tenant.tenantAddress || "—"} />
              <Row
                icon={<Home />}
                text={tenant.unitId?.unitName || "No unit"}
              />

              {/* Action */}
              <button
                onClick={() => navigate(`/admin-tenant/detail/${tenant._id}`)}
                className="flex items-center gap-1 text-xs
                           font-semibold text-indigo-600 pt-1"
              >
                <Info className="w-4 h-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===== SMALL UI ===== */

const Row = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-[13px] text-slate-700">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

export default InactiveTenant;
