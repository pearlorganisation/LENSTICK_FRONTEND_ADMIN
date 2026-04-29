import Sidebar from "../../components/Sidebar";


export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar is fixed on mobile, static on desktop */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
