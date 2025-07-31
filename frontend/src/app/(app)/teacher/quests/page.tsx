"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ButtonLink from "@/components/ui/ButtonLink";
import QuestItem from "@/components/ui/QuestItem";
import { getUserData } from "@/services/api/tokenManager";
// import { getTeacherQuests } from "@/services/quests.service"; // Será necessário criar este serviço
import { UserData } from "@/types/authTypes";
// import { Question } from "@/types/questTypes";

// Mock de dados temporário, com os IDs corrigidos para string para alinhar com o tipo Quest.

/**
 * TeacherQuestsPage exibe a lista de quests criadas pelo professor.
 * Implementa a verificação de autenticação e autorização para garantir que
 * apenas usuários com a role 'TEACHER' possam acessar a página.
 */
export default function TeacherQuestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [quests, setQuests] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  useEffect(() => {
    const userData = getUserData();
    // Verificação de segurança: usuário deve estar logado e ser um professor.
    if (!userData || String(userData.role).toUpperCase() !== "TEACHER") {
      router.push("/login");
      return; // Interrompe a execução para evitar a busca de dados
    }

    setUser(userData);

    // Simula a busca de dados da API
    const fetchQuests = async () => {
      setIsLoading(true);
      // TODO: Substituir o mock pela chamada de serviço real:
      // const data = await getTeacherQuests(userData.id);
      //setQuests(allQuestsMock);
      setIsLoading(false);
    };

    fetchQuests();
  }, [router]);

  // --- Lógica de Paginação ---
  const indexOfLastQuest = currentPage * QUESTS_PER_PAGE;
  const indexOfFirstQuest = indexOfLastQuest - QUESTS_PER_PAGE;
  const currentQuests = quests.slice(indexOfFirstQuest, indexOfLastQuest);
  const totalPages = Math.ceil(quests.length / QUESTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Renderiza um estado de carregamento enquanto a verificação e a busca de dados ocorrem.
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">Carregando a Forja de Quests...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 p-5">
        {/* O título agora é personalizado, resolvendo o aviso de variável não utilizada. */}
        <h1 className="text-4xl [text-shadow:3px_3px_0_var(--color-header-bg)]">
          Forja de Quests de {user?.name}
        </h1>
        <ButtonLink href="/teacher/quests/new" variant="primary">
          Criar Nova Quest
        </ButtonLink>
      </div>

      <div
        className="p-8 pixel-border space-y-4 rounded"
        style={{ backgroundColor: "#252637" }}
      >
        {currentQuests.length > 0 ? (
          currentQuests.map((quest) => (
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
          ))
        ) : (
          <p className="text-center text-white">
            Você ainda não forjou nenhuma quest.
          </p>
        )}
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
  );
}
