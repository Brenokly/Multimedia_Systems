"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import ButtonLink from "@/components/ui/ButtonLink";
import QuestItem from "@/components/ui/QuestItem";
import { PixelCombobox } from "@/components/ui/PixelCombobox";
import { getClanById, listUnitsByClan } from "@/services/clanService";
import { listQuestionsByUnit } from "@/services/unitService";
import { ClanDto, UnitDto } from "@/types/clanTypes";
import { QuestionDto, subjects } from "@/types/questTypes";

// --- Dados para os Filtros ---
const difficulties = [
  { id: "all", label: "Dificuldade" },
  { id: "EASY", label: "Fácil" },
  { id: "MEDIUM", label: "Médio" },
  { id: "HARD", label: "Difícil" },
];

const subjectsFilter = [
  { id: "all", label: "Tópico" },
  ...subjects.map(subject => ({
    id: subject.id,
    label: subject.label
  }))
];

// Interface para agrupar unidades com suas quests
interface UnitWithQuests {
  unit: UnitDto;
  questions: QuestionDto[];
}

/**
 * Página para o aluno visualizar as quests de um clã, agrupadas por unidade.
 */
export default function ClanQuestsPage() {
  const router = useRouter();
  const params = useParams();
  const clanId = params.id as string;

  const [clan, setClan] = useState<ClanDto | null>(null);
  const [unitsWithQuests, setUnitsWithQuests] = useState<UnitWithQuests[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para filtros
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectsFilter[0]);

  const fetchData = useCallback(async () => {
    try {
      const clanData = await getClanById(Number(clanId));
      setClan(clanData);

      const unitsData = await listUnitsByClan(Number(clanId));

      // Para cada unidade, busca suas quests específicas
      const unitsWithQuestsPromises = unitsData.map(async (unit) => {
        const questions = await listQuestionsByUnit(unit.id);
        return { unit, questions };
      });

      const resolvedUnits = await Promise.all(unitsWithQuestsPromises);
      setUnitsWithQuests(resolvedUnits);

    } catch (error) {
      console.error("Falha ao buscar dados do clã:", error);
      toast.error("Não foi possível carregar as quests do clã.");
    } finally {
      setIsLoading(false);
    }
  }, [clanId]);

  useEffect(() => {
    if (clanId) {
      fetchData();
    }
  }, [clanId, fetchData]);

  // Aplica os filtros aos dados já agrupados
  const filteredUnitsWithQuests = useMemo(() => {
    return unitsWithQuests
      .map(group => {
        // Filtra as quests dentro de cada unidade
        const filteredQuests = group.questions.filter(quest => {
          const difficultyMatch = selectedDifficulty.id === "all" || quest.level === selectedDifficulty.id;
          const subjectMatch = selectedSubject.id === "all" || quest.topics.includes(selectedSubject.id);
          return difficultyMatch && subjectMatch;
        });
        // Retorna a unidade apenas se ela tiver quests após a filtragem
        return { ...group, questions: filteredQuests };
      })
      .filter(group => group.questions.length > 0); // Remove unidades que ficaram vazias
  }, [unitsWithQuests, selectedDifficulty, selectedSubject]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">Carregando quests do clã...</p>
      </div>
    );
  }

  if (!clan) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl text-center">Clã não encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        className: "font-pixel",
        style: { border: "4px solid #5d4037", padding: "16px", color: "#5d4037" },
        error: { style: { backgroundColor: "#ffcdd2" } }
      }} />
      <div className="w-full">
        <div className="mb-2 p-5">
          <h1 className="text-4xl text-white [text-shadow:3px_3px_0_var(--color-header-bg)]">
            Jornada de Quests: {clan.name}
          </h1>
          <p className="text-yellow-300 mt-2">Guiado pelo Mestre {clan.owner.name}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 px-5">
          <div className="flex gap-4">
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
          <button
            className="btn-pixel text-xs py-2 px-4"
            style={{
              backgroundColor: "var(--color-yellow-primary)",
              color: "var(--color-brand-text)",
              boxShadow: "inset -4px -4px 0px 0px var(--color-yellow-shadow)",
            }}
            onClick={() => router.push(`/student/clans/${clanId}/ranking`)}
          >
            Ver Ranking do Clã
          </button>
        </div>

        <div className="p-8 pixel-border space-y-6 rounded" style={{ backgroundColor: "#252637" }}>
          {filteredUnitsWithQuests.length > 0 ? (
            filteredUnitsWithQuests.map(({ unit, questions }) => (
              <div key={unit.id} className="p-4 rounded space-y-3" style={{ backgroundColor: "#1C1C29" }}>
                <h3 className="text-xl text-yellow-300 border-b-2 border-gray-600 pb-2 mb-3">
                  {unit.name}
                </h3>
                <div className="space-y-2">
                  {questions.map((quest) => (
                    <QuestItem
                      key={quest.id}
                      quest={{ id: quest.id, title: quest.statement }}
                      action={
                        <ButtonLink
                          href={`/student/quests/${quest.id}`}
                          variant="primary"
                          className="!text-xs !py-2 !px-4"
                        >
                          INICIAR
                        </ButtonLink>
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white">
              Nenhuma quest encontrada com estes filtros.
            </p>
          )}
        </div>
      </div>
    </>
  );
}