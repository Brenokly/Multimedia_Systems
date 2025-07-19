"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import { PixelCombobox } from "@/components/ui/PixelCombobox";
import { getGlobalQuests } from "@/services/quests.service";
import { Quest } from "@/types/quest.types";
import { useEffect, useState } from "react";

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

const QuestItem = ({ quest }: { quest: Quest }) => (
  <div
    className="p-2 flex justify-between items-center rounded"
    style={{ backgroundColor: "#1C1C29" }}
  >
    <p className="text-white">{quest.title}</p>
    <ButtonLink
      href={`/quests/${quest.id}`}
      variant="primary"
      className="!text-xs !py-2 !px-4"
    >
      Aceitar
    </ButtonLink>
  </div>
);

export default function GlobalQuestsPage() {
  const [allFilteredQuests, setAllFilteredQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  // Busca os dados e reseta a página quando os filtros mudam
  useEffect(() => {
    const fetchQuests = async () => {
      setIsLoading(true);
      const currentFilters = {
        difficulty: selectedDifficulty.id,
        subject: selectedSubject.id,
      };
      const data = await getGlobalQuests(currentFilters);
      setAllFilteredQuests(data);
      setCurrentPage(1); // Sempre volta para a primeira página ao filtrar
      setIsLoading(false);
    };
    fetchQuests();
  }, [selectedDifficulty, selectedSubject]);

  // --- Lógica de Paginação ---
  const indexOfLastQuest = currentPage * QUESTS_PER_PAGE;
  const indexOfFirstQuest = indexOfLastQuest - QUESTS_PER_PAGE;
  const currentQuests = allFilteredQuests.slice(
    indexOfFirstQuest,
    indexOfLastQuest
  );
  const totalPages = Math.ceil(allFilteredQuests.length / QUESTS_PER_PAGE);

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
            <QuestItem key={quest.id} quest={quest} />
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
            style={{
              backgroundColor: "var(--color-brand-btn)",
              boxShadow:
                "inset -4px -4px 0px 0px var(--color-brand-btn-shadow)",
            }}
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
            style={{
              backgroundColor: "var(--color-brand-btn)",
              boxShadow:
                "inset -4px -4px 0px 0px var(--color-brand-btn-shadow)",
            }}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
