import {
  ArrowUpRight,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Plus,
  Download,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Orders",
      value: "1,250",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
    },
    {
      label: "New Customers",
      value: "48",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+5.2%",
    },
    {
      label: "Products Active",
      value: "156",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+2",
    },
    {
      label: "Monthly Revenue",
      value: "₹45,000",
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+18%",
    },
  ];

  const recentLogs = [
    { id: 1, event: "New Order #1290", time: "2 mins ago", status: "success" },
    {
      id: 2,
      event: "Inventory low: RayBan Aviator",
      time: "1 hour ago",
      status: "warning",
    },
    {
      id: 3,
      event: "New Customer registered",
      time: "3 hours ago",
      status: "info",
    },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* TOP HEADER SECTION - NOW RESPONSIVE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Welcome back, Admin. Here is your store at a glance.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all active:scale-95">
            <Download size={16} /> Export
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#072369] text-white rounded-lg text-sm font-semibold hover:bg-[#0a2e8a] transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            <Plus size={16} />{" "}
            <span className="hidden xs:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend} <ArrowUpRight size={12} className="ml-1" />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION: ACTIVITY & SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY LIST (Left side) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Recent Activity
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.status === "warning" ? "bg-amber-400" : "bg-blue-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {log.event}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
