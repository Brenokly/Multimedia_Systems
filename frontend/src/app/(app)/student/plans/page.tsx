"use client";

import { PlanCard } from "@/components/ui/PlanCard";
import { getUserData } from "@/services/api/tokenManager";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentPlansPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    // Guarda de rota: verifica se o utilizador é um estudante
    if (!userData || String(userData.role).toUpperCase() !== "STUDENT") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">
          A carregar planos de Aventureiro...
        </p>
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
      <div className="mb-12">
        <h3
          className="text-2xl text-white mb-6"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          Planos de Aventureiro
        </h3>
        <div className="flex flex-wrap gap-8">
          <PlanCard
            title="Passe de Clãs"
            price="R$ 9/mês"
            features={["Entrar em até 5 Clãs"]}
          />
          <PlanCard
            title="Passe de Quests"
            price="R$ 9/mês"
            features={["+50 Quests Globais por mês"]}
          />
          <PlanCard
            title="Passe de Lenda"
            price="R$ 15/mês"
            features={["Todos os benefícios"]}
            isFeatured
          />
        </div>
      </div>
    </div>
  );
}
