import DashboardSideNav from "./DashboardSideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSideNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
