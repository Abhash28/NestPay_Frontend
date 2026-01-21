import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  User,
  Phone,
  MapPin,
  Home,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const TenantDetail = () => {
  const { tenantId } = useParams();

  const [allocation, setAllocation] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [endDate, setEndDate] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateRemark, setDeactivateRemark] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://nestpay-backend.onrender.com/api/allocation/tenant-info/${tenantId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setAllocation(res.data.allocation);
      } catch (err) {
        setError(err.response?.data?.message || "Server not responding");
      } finally {
        setFetching(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  /* ================= DEACTIVATE ================= */
  const confirmDeactivate = async () => {
    if (!endDate || !deactivateReason) {
      setError("End date and reason are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `https://nestpay-backend.onrender.com/api/allocation/deallocate/${tenantId}`,
        { endDate, deactivateReason, deactivateRemark },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccess("Tenant deactivated successfully");

      setAllocation((prev) => ({
        ...prev,
        status: "Inactive",
        endDate,
        deactivateReason,
        deactivateRemark,
      }));

      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADER ================= */
  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading tenant details…
        </div>
      </div>
    );
  }

  if (!allocation) {
    return <div className="p-4 text-rose-600 font-bold">No tenant found</div>;
  }

  const tenant = allocation.tenantId;
  const unit = allocation.unitId;
  const property = allocation.propertyId;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4 pb-24">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-black text-slate-900">Tenant Details</h1>
        <StatusBadge status={tenant.status} />
      </div>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      {/* TENANT */}
      <Card title="Tenant">
        <Row icon={<User />} value={tenant.tenantName} />
        <Row icon={<Phone />} value={tenant.tenantMobileNo} />
        <Row icon={<MapPin />} value={tenant.tenantAddress} />
      </Card>

      {/* PROPERTY */}
      <Card title="Property">
        <Row icon={<Home />} value={property?.propertyName || "—"} />
        <Row icon={<MapPin />} value={property?.propertyAddress || "—"} />
      </Card>

      {/* UNIT */}
      <Card title="Unit">
        <Row icon={<Home />} value={unit?.unitName || "—"} />
        <Row icon={<IndianRupee />} value={`₹${unit?.monthlyRent || "—"}`} />
        <Row value={`Status: ${unit?.status || "—"}`} />
      </Card>

      {/* ALLOCATION */}
      <Card title="Allocation">
        <Row
          icon={<Calendar />}
          value={`Start Date: ${
            allocation.startDate
              ? new Date(allocation.startDate).toLocaleDateString()
              : "—"
          }`}
        />
        <Row value={`Billing Day: ${allocation.billingDay}`} />
        <Row value={`Rent: ₹${allocation.rentAmount}`} />
      </Card>

      {/* 🔥 DEACTIVATION DETAILS (ONLY IF INACTIVE) */}
      {tenant.status === "Inactive" && (
        <Card title="Deactivation Details">
          <Row
            icon={<Calendar />}
            value={`End Date: ${
              allocation.endDate
                ? new Date(allocation.endDate).toLocaleDateString()
                : "—"
            }`}
          />
          <Row
            icon={<AlertTriangle />}
            value={`Reason: ${allocation.deactivateReason || "—"}`}
          />
          {allocation.deactivateRemark && (
            <Row value={`Remark: ${allocation.deactivateRemark || "-"}`} />
          )}
        </Card>
      )}

      {/* ACTION */}
      {tenant.status === "Active" && (
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-rose-600 text-white font-black py-3 rounded-xl active:scale-[0.98]"
        >
          Deactivate Tenant
        </button>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center pb-20 sm:pb-0">
          <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 border-b flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-black">Deactivate Tenant</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <Select
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="Tenant Left">Tenant Left</option>
                <option value="Non Payment">Non Payment</option>
                <option value="Rule Violation">Rule Violation</option>
                <option value="Other">Other</option>
              </Select>

              <Textarea
                placeholder="Remark (optional)"
                value={deactivateRemark}
                onChange={(e) => setDeactivateRemark(e.target.value)}
              />
            </div>

            <div className="border-t px-4 py-4 flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border rounded-xl py-3 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeactivate}
                disabled={loading}
                className="flex-1 bg-rose-600 text-white rounded-xl py-3 font-black flex justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= UI HELPERS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
    <p className="text-xs font-black text-slate-400 uppercase">{title}</p>
    {children}
  </div>
);

const Row = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-sm text-slate-700">
    {icon && <span className="text-slate-400">{icon}</span>}
    <span>{value}</span>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block mt-1 text-xs font-black px-3 py-1 rounded-full ${
      status === "Active"
        ? "bg-emerald-50 text-emerald-600"
        : "bg-slate-200 text-slate-600"
    }`}
  >
    {status}
  </span>
);

const Message = ({ type, children }) => (
  <div
    className={`text-sm font-bold p-3 rounded-xl ${
      type === "error"
        ? "bg-rose-50 text-rose-600"
        : "bg-emerald-50 text-emerald-600"
    }`}
  >
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full px-3 py-3 bg-slate-50 border rounded-xl font-bold text-sm"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full px-3 py-3 bg-slate-50 border rounded-xl font-bold text-sm"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    rows={3}
    className="w-full px-3 py-3 bg-slate-50 border rounded-xl font-bold text-sm"
  />
);

export default TenantDetail;
