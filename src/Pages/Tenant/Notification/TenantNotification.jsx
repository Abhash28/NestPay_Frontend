import { Bell, Construction } from "lucide-react";

const TenantNotification = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 pt-20">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
        <Bell className="w-8 h-8 text-indigo-600" />
      </div>

      {/* Title */}
      <h2 className="text-lg font-black text-slate-900">Notifications</h2>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 max-w-xs">
        Important updates like rent reminders, payment confirmations, and
        notices will appear here.
      </p>

      {/* Coming Soon Badge */}
      <div
        className="mt-4 inline-flex items-center gap-2
                      px-4 py-2 rounded-full
                      bg-slate-900 text-white
                      text-xs font-bold uppercase tracking-widest"
      >
        <Construction className="w-4 h-4" />
        Coming Soon
      </div>
    </div>
  );
};

export default TenantNotification;
