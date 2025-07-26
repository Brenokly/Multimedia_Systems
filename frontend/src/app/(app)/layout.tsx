"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { UserHeader } from "@/components/layout/UserHeader";
import { getUserData } from "@/services/api/tokenManager";
import { UserData } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const data = getUserData();

    if (!data) {
      router.push("/login");
    } else {
      setUserData(data);
      setIsVerifying(false);
    }
  }, [router]);

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full bg-[#3d405b] items-center justify-center">
        <p className="text-white text-xl">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#3d405b]">
      <Sidebar user={userData!} />
      <main className="flex-grow flex flex-col p-6 md:p-8 overflow-y-auto">
        <UserHeader user={userData!} />
        <div className="flex-grow mt-8">{children}</div>
      </main>
    </div>
  );
}
