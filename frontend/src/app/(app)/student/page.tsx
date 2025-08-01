"use client";

import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import toast, {Toaster} from "react-hot-toast";

import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import {PixelCombobox} from "@/components/ui/PixelCombobox";
import QuestItem from "@/components/ui/QuestItem";
import {getUserData} from "@/services/api/tokenManager";
import {listQuestionsByClan} from "@/services/clanService";
import {getMyAnswerForQuest} from "@/services/questService";
import {QuestionDto, subjects} from "@/types/questTypes";

// --- Dados para os Filtros ---
const difficulties = [
  {id: "all", label: "Dificuldade"},
  {id: "EASY", label: "Fácil"},
  {id: "MEDIUM", label: "Médio"},
  {id: "HARD", label: "Difícil"},
];

const subjectsFilter = [
  {id: "all", label: "Tópico"},
  ...subjects.map(subject => ({
    id: subject.id,
    label: subject.label
  }))
];

/**
 * Dashboard principal para alunos, exibindo quests globais.
 */
export default function StudentDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Estados para dados e filtros
  const [allQuests, setAllQuests] = useState<QuestionDto[]>([]);
  const [answeredQuestIds, setAnsweredQuestIds] = useState<Set<number>>(new Set());
  const [showAnswered, setShowAnswered] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectsFilter[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  useEffect(() => {
    const userData = getUserData();
    if (!userData || String(userData.role).toUpperCase() !== "STUDENT") {
      router.push("/login");
      return;
    }

    const fetchInitialData = async () => {
      try {
        const questsData = await listQuestionsByClan(1); // Clã global tem id = 1
        setAllQuests(questsData);

        const answerChecks = questsData.map(quest => getMyAnswerForQuest(quest.id));
        const answers = await Promise.all(answerChecks);

        const answeredIds = new Set<number>();
        answers.forEach(answer => {
          if (answer) {
            answeredIds.add(answer.id);
          }
        });
        setAnsweredQuestIds(answeredIds);

      } catch (error) {
        console.error("Falha ao buscar dados do dashboard:", error);
        toast.error("Não foi possível carregar os dados do dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router]);

  // Aplica os filtros com base no estado de showAnswered
  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest) => {
      const isAnswered = answeredQuestIds.has(quest.id);

      // Lógica de filtro principal
      const viewMatch = showAnswered ? isAnswered : !isAnswered;

      const difficultyMatch = selectedDifficulty.id === "all" || quest.level === selectedDifficulty.id;
      const subjectMatch = selectedSubject.id === "all" || quest.topics.includes(selectedSubject.id);

      return viewMatch && difficultyMatch && subjectMatch;
    });
  }, [allQuests, selectedDifficulty, selectedSubject, answeredQuestIds, showAnswered]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDifficulty, selectedSubject, showAnswered]);

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
      <Toaster position="bottom-right" toastOptions={{
        className: "font-pixel",
        style: {border: "4px solid #5d4037", padding: "16px", color: "#5d4037"},
        error: {style: {backgroundColor: "#ffcdd2"}}
      }}/>
      <h2 className="text-3xl text-white mb-8 [text-shadow:2px_2px_0_#000]">
        {showAnswered ? "Quests Respondidas" : "Quests Globais"}
      </h2>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex flex-wrap gap-4">
          <PixelCombobox
            items={difficulties}
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
            className="w-56"
          />
          <PixelCombobox
            items={subjectsFilter}
            value={selectedSubject}
            onChange={setSelectedSubject}
            className="w-56"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => setShowAnswered(!showAnswered)}
            variant="secondary"
            className="!text-xs !py-2 !px-4"
          >
            {showAnswered ? "Ver Quests Pendentes" : "Ver Quests Respondidas"}
          </Button>
          <button
            className="btn-pixel text-xs py-2 px-4"
            style={{
              backgroundColor: "var(--color-yellow-primary)",
              color: "var(--color-brand-text)",
              boxShadow: "inset -4px -4px 0px 0px var(--color-yellow-shadow)",
            }}
            onClick={() => router.push("/student/ranking-global")}
          >
            Ver Ranking
          </button>
        </div>
      </div>

      <div
        className="p-8 pixel-border space-y-4 rounded"
        style={{backgroundColor: "#252637"}}
      >
        {currentQuests.length > 0 ? (
          currentQuests.map((quest) => (
            <QuestItem
              key={quest.id}
              quest={{id: quest.id, title: quest.statement}}
              action={
                // O botão muda de "Aceitar" para "Ver Resposta"
                <ButtonLink
                  href={`/student/quests/${quest.id}`}
                  variant={showAnswered ? "secondary" : "primary"}
                  className="!text-xs !py-2 !px-4"
                >
                  {showAnswered ? "Ver Resposta" : "Aceitar"}
                </ButtonLink>
              }
            />
          ))
        ) : (
          <p className="text-center text-white">
            {showAnswered ? "Você não respondeu nenhuma quest com estes filtros." : "Nenhuma quest encontrada com estes filtros."}
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