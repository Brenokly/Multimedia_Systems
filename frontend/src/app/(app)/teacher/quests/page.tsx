"use client";

import { getUserData } from "@/services/api/tokenManager";
import { UserData } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * TeacherDashboardPage is the main dashboard for users with the 'TEACHER' role.
 * It provides an overview of classes, quests, and other teacher-specific actions.
 * This component also enforces role-based access control, redirecting non-teacher
 * users.
 */
export default function TeacherDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    // Role-based authorization check.
    if (!userData || String(userData.role).toUpperCase() !== "TEACHER") {
      // Redirects if user is not logged in or is not a teacher.
      // A more sophisticated app might redirect to a specific 'unauthorized' page.
      router.push("/login");
    } else {
      setUser(userData);
      setIsLoading(false);
    }
  }, [router]);

  // Renders a loading state while verifying the user's role.
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">Carregando dashboard do Mestre...</p>
      </div>
    );
  }

  // Renders the dashboard content once the user is verified as a teacher.
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Dashboard do Mestre</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card para Gerenciar Quests */}
        <div className="p-6 pixel-border bg-[#252637]">
          <h2 className="text-xl font-semibold text-yellow-300 mb-3">
            Gerenciar Quests
          </h2>
          <p className="text-gray-300 mb-4">
            Crie, edite e acompanhe o progresso das suas quests.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Ver Minhas Quests
          </button>
        </div>

        {/* Card para Gerenciar Clãs */}
        <div className="p-6 pixel-border bg-[#252637]">
          <h2 className="text-xl font-semibold text-yellow-300 mb-3">
            Gerenciar Clãs
          </h2>
          <p className="text-gray-300 mb-4">
            Veja os clãs (turmas) que você lidera e seus membros.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Ver Meus Clãs
          </button>
        </div>

        {/* Card para Biblioteca de Conteúdo */}
        <div className="p-6 pixel-border bg-[#252637]">
          <h2 className="text-xl font-semibold text-yellow-300 mb-3">
            Biblioteca
          </h2>
          <p className="text-gray-300 mb-4">
            Acesse e gerencie seus materiais e recursos de ensino.
          </p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
            Acessar Biblioteca
          </button>
        </div>
      </div>
    </div>
  );
}
