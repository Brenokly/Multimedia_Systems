"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import QuestItem from "@/components/ui/QuestItem";
import { getUserData } from "@/services/api/tokenManager";
import { UserData } from "@/types/authTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Props para o card de perfil
interface UserProfileCardProps {
  user: UserData | null;
}

// A lista completa de quests, agora fora do componente principal
const allQuests = [
  { id: 1, title: "Quest: Fila de Prioridades" },
  { id: 2, title: "Quest: Complexidade Big O" },
  { id: 3, title: "Quest: Estruturas de Dados" },
  { id: 4, title: "Quest: Algoritmos de Busca" },
  { id: 5, title: "Quest: Algoritmos de Ordenação" },
  { id: 6, title: "Quest: Recursão" },
  { id: 7, title: "Quest: Programação Dinâmica" },
  { id: 8, title: "Quest: Grafos e Árvores" },
  { id: 9, title: "Quest: Redes de Computadores" },
  { id: 10, title: "Quest: Arquitetura de Computadores" },
];

// Card para exibir o perfil do usuário
const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const userName = user?.login || "Professor";
  const userRole = user?.role === "teacher" ? "Mestre" : "Aventureiro";
  const avatarSrc = user?.avatar || "/male_avatar.png";

  return (
    <div className="pixel-border-dark flex items-center gap-4 p-4">
      <div className="text-right">
        <p className="font-bold text-lg text-white">{userName}</p>
        <p className="text-sm text-[var(--color-yellow-shadow)]">{userRole}</p>
      </div>
      <div className="w-18 h-18 rounded-full pixel-border bg-gray-700 p-0 flex items-center justify-center">
        <Image
          src={avatarSrc}
          alt="Foto de Perfil"
          width={64}
          height={64}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default function TeacherQuestsPage() {
  const [user, setUser] = useState<UserData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    } else {
      // Dados mocados para o professor caso não haja usuário logado
      setUser({ id: 1, login: "Professor", role: "teacher" });
    }
  }, []);

  // --- CÁLCULOS DA PÁGINA ATUAL ---
  const indexOfLastQuest = currentPage * QUESTS_PER_PAGE;
  const indexOfFirstQuest = indexOfLastQuest - QUESTS_PER_PAGE;
  const currentQuests = allQuests.slice(indexOfFirstQuest, indexOfLastQuest);
  const totalPages = Math.ceil(allQuests.length / QUESTS_PER_PAGE);

  // --- FUNÇÕES DE CONTROLE DA PAGINAÇÃO ---
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen max-w-screen bg-[#3d405b] text-white font-pixel">
      {/* Conteúdo principal */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Card de perfil do usuário */}
        <div className="w-full flex justify-end mb-8">
          <UserProfileCard user={user} />
        </div>

        {/* Título e botão de criar nova quest */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-8 p-5">
            <h1 className="text-4xl [text-shadow:3px_3px_0_var(--color-header-bg)]">
              Forja de Quests
            </h1>
            <ButtonLink href="/teacher/quests/new" variant="primary">
              Criar Nova Quest
            </ButtonLink>
          </div>

          {/* Lista de quests */}
          <div
            className="p-8 pixel-border space-y-4 rounded"
            style={{ backgroundColor: "#252637" }}
          >
            {currentQuests.map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                action={
                  <ButtonLink
                    href={`/teacher/quests/edit/${quest.id}`}
                    variant="primary"
                    className="!text-xs !py-2 !px-4"
                  >
                    Editar
                  </ButtonLink>
                }
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="btn-pixel text-xs py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="font-pixel text-white text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="btn-pixel text-xs py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
