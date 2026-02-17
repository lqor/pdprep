import { Sidebar } from "@/components/shared/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bgPrimary md:flex">
      <Sidebar />
      <main className="flex-1 px-6 py-10 md:px-12">{children}</main>
    </div>
  );
}
