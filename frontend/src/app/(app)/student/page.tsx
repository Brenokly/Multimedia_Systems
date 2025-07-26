"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ButtonLink from "@/components/ui/ButtonLink";
import { PixelCombobox } from "@/components/ui/PixelCombobox";
import QuestItem from "@/components/ui/QuestItem";
import { getUserData } from "@/services/api/tokenManager";
import { getGlobalQuests } from "@/services/quests.service";
import { UserData } from "@/types/authTypes";
import { Quest } from "@/types/quest.types";

// --- Dados para os Filtros ---
const difficulties = [
  { id: "all", label: "Dificuldade" },
  { id: "Fácil", label: "Fácil" },
  { id: "Médio", label: "Médio" },
  { id: "Difícil", label: "Difícil" },
];

const subjects = [
  { id: "all", label: "Assunto" },
  { id: "Estrutura de Dados", label: "Estrutura de Dados" },
  { id: "Algoritmos", label: "Algoritmos" },
  { id: "Redes", label: "Redes" },
  { id: "Arquitetura", label: "Arquitetura" },
];

/**
 * StudentDashboardPage is the main dashboard for users with the 'STUDENT' role.
 * It displays a list of global quests that can be filtered and accepted.
 * This component enforces role-based access control, redirecting non-student users.
 */
export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for quest data and filtering
  const [allFilteredQuests, setAllFilteredQuests] = useState<Quest[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  useEffect(() => {
    const userData = getUserData();
    // Role-based authorization check.
    if (!userData || String(userData.role).toUpperCase() !== "STUDENT") {
      router.push("/login");
    } else {
      setUser(userData);
    }
  }, [router]);

  // Fetches quests when filters change or on initial load (if user is valid).
  useEffect(() => {
    // Only fetch quests if the user has been verified as a student.
    if (user) {
      const fetchQuests = async () => {
        setIsLoading(true);
        const currentFilters = {
          difficulty: selectedDifficulty.id,
          subject: selectedSubject.id,
        };
        const data = await getGlobalQuests(currentFilters);
        setAllFilteredQuests(data);
        setCurrentPage(1);
        setIsLoading(false);
      };
      fetchQuests();
    }
  }, [user, selectedDifficulty, selectedSubject]);

  // --- Pagination Logic ---
  const indexOfLastQuest = currentPage * QUESTS_PER_PAGE;
  const indexOfFirstQuest = indexOfLastQuest - QUESTS_PER_PAGE;
  const currentQuests = allFilteredQuests.slice(
    indexOfFirstQuest,
    indexOfLastQuest
  );
  const totalPages = Math.ceil(allFilteredQuests.length / QUESTS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Renders a loading state while verifying user and fetching data.
  if (!user) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">
          Carregando dashboard do Aventureiro...
        </p>
      </div>
    );
  }

  // Renders the main content.
  return (
    <div>
      <h2 className="text-3xl text-white mb-8 [text-shadow:2px_2px_0_#000]">
        Quests Globais
      </h2>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex gap-4">
          <PixelCombobox
            items={difficulties}
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            className="w-56"
          />
          <PixelCombobox
            items={subjects}
            value={selectedSubject}
            onChange={setSelectedSubject}
            className="w-56"
          />
        </div>
        <button
          className="btn-pixel text-xs py-2 px-4"
          style={{
            backgroundColor: "var(--color-yellow-primary)",
            color: "var(--color-brand-text)",
            boxShadow: "inset -4px -4px 0px 0px var(--color-yellow-shadow)",
          }}
        >
          Ver Ranking
        </button>
      </div>

      <div
        className="p-8 pixel-border space-y-4 rounded"
        style={{ backgroundColor: "#252637" }}
      >
        {isLoading ? (
          <p className="text-center text-white">Carregando quests...</p>
        ) : currentQuests.length > 0 ? (
          currentQuests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={quest}
              action={
                <ButtonLink
                  href={`/quests/${quest.id}`}
                  variant="primary"
                  className="!text-xs !py-2 !px-4"
                >
                  Aceitar
                </ButtonLink>
              }
            />
          ))
        ) : (
          <p className="text-center text-white">
            Nenhuma quest encontrada com estes filtros.
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
