"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ButtonLink from "@/components/ui/ButtonLink";
import { PixelCombobox } from "@/components/ui/PixelCombobox";
import QuestItem from "@/components/ui/QuestItem";
import { getUserData } from "@/services/api/tokenManager";
import { listQuestionsByClan } from "@/services/clanService";
import { QuestionDto } from "@/types/questTypes";

// --- Dados para os Filtros (alinhados com o backend) ---
const difficulties = [
  { id: "all", label: "Dificuldade" },
  { id: "EASY", label: "Fácil" },
  { id: "MEDIUM", label: "Médio" },
  { id: "HARD", label: "Difícil" },
];

const subjects = [
  { id: "all", label: "Assunto" },
  { id: "ED1", label: "Estrutura de Dados I" },
  { id: "ED2", label: "Estrutura de Dados II" },
  { id: "REDES", label: "Redes" },
];

/**
 * StudentDashboardPage é o dashboard principal para usuários do tipo 'STUDENT'.
 * Exibe uma lista de quests globais que podem ser filtradas e aceites.
 * Este componente impõe o controlo de acesso baseado em funções.
 */
export default function StudentDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Estados para dados e filtros
  const [allQuests, setAllQuests] = useState<QuestionDto[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  useEffect(() => {
    const userData = getUserData();
    // Verificação de segurança e autorização
    if (!userData || String(userData.role).toUpperCase() !== "STUDENT") {
      router.push("/login");
      return;
    }

    const fetchGlobalQuests = async () => {
      try {
        // Por convenção, o Clã Global tem o ID 1.
        const data = await listQuestionsByClan(1);
        setAllQuests(data);
      } catch (error) {
        console.error("Falha ao buscar as quests globais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalQuests();
  }, [router]);

  // Aplica os filtros aos dados recebidos da API
  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest) => {
      const difficultyMatch =
        selectedDifficulty.id === "all" ||
        quest.level === selectedDifficulty.id;
      // A filtragem de tópicos verifica se algum dos tópicos da quest corresponde ao filtro
      const subjectMatch =
        selectedSubject.id === "all" ||
        quest.topics.includes(selectedSubject.id);
      return difficultyMatch && subjectMatch;
    });
  }, [allQuests, selectedDifficulty, selectedSubject]);

  // --- Lógica de Paginação ---
  const totalPages = Math.ceil(filteredQuests.length / QUESTS_PER_PAGE);
  const currentQuests = filteredQuests.slice(
    (currentPage - 1) * QUESTS_PER_PAGE,
    currentPage * QUESTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Efeito para voltar à primeira página sempre que um filtro é alterado
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDifficulty, selectedSubject]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">
          A carregar o dashboard do Aventureiro...
        </p>
      </div>
    );
  }

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
        {currentQuests.length > 0 ? (
          currentQuests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={{ id: quest.id, title: quest.statement }}
              action={
                <ButtonLink
                  href={`/student/quests/${quest.id}`}
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
