"use client";

import { PlanCard } from "@/components/ui/PlanCard";
import { getUserData } from "@/services/api/tokenManager";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherPlansPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    if (!userData || String(userData.role).toUpperCase() !== "TEACHER") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">A carregar planos de Mestre...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2
        className="text-3xl text-white mb-8"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        Planos de Aventura
      </h2>
      <div>
        <h3
          className="text-2xl text-white mb-6"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          Planos de Mestre
        </h3>
        <div className="flex flex-wrap gap-8">
          <PlanCard
            title="Mestre"
            price="R$ 29/mês"
            features={["Criar até 10 Clãs", "50 alunos por Clã"]}
          />
          <PlanCard
            title="Arquimestre"
            price="R$ 49/mês"
            features={["Clãs ilimitados", "Alunos ilimitados"]}
          />
        </div>
      </div>
    </div>
  );
}
