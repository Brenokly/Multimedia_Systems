import { Sidebar } from "@/components/layout/Sidebar";
import { UserHeader } from "@/components/layout/UserHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#3d405b]">
      <Sidebar />
      <main className="flex-grow flex flex-col p-6 md:p-8 overflow-y-auto">
        <UserHeader />
        <div className="flex-grow mt-8">{children}</div>
      </main>
    </div>
  );
}
