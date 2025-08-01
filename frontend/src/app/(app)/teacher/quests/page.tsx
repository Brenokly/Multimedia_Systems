"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";

import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import QuestItem from "@/components/ui/QuestItem";
import {getUserData} from "@/services/api/tokenManager";
import {getQuestsByAuthorId} from "@/services/questService";
import {getAllClans, listUnitsByClan} from "@/services/clanService";
import {UserData} from "@/types/authTypes";
import {QuestionDto} from "@/types/questTypes";
import {UnitDto} from "@/types/clanTypes";

/**
 * TeacherQuestsPage exibe a lista de quests criadas pelo professor logado.
 */
export default function TeacherQuestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [quests, setQuests] = useState<QuestionDto[]>([]);
  const [teacherUnits, setTeacherUnits] = useState<UnitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const QUESTS_PER_PAGE = 8;

  useEffect(() => {
    const userData = getUserData();
    if (!userData || String(userData.role).toUpperCase() !== "TEACHER") {
      router.push("/login");
      return;
    }
    setUser(userData);

    const fetchData = async () => {
      try {
        const [questsData, allClans] = await Promise.all([
          getQuestsByAuthorId(userData.id),
          getAllClans()
        ]);

        setQuests(questsData);

        // Filtra para encontrar apenas os clãs do professor logado
        const myClans = allClans.filter(clan => clan.owner.id === userData.id);

        if (myClans.length > 0) {
          // Busca as unidades de cada clã do professor
          const unitsPromises = myClans.map(clan => listUnitsByClan(clan.id));
          const unitsArrays = await Promise.all(unitsPromises);
          // Armazena a lista final de unidades no estado
          setTeacherUnits(unitsArrays.flat());
        }

      } catch (error) {
        console.error("Falha ao buscar os dados do professor:", error);
        toast.error("Não foi possível carregar os dados da página.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- LÓGICA CORRIGIDA AQUI ---
  const handleCreateQuestClick = () => {
    // Verifica se o array de unidades tem pelo menos um item
    if (teacherUnits.length === 0) {
      toast.error("Você precisa ter uma unidade em um clã para poder forjar uma quest!");
    } else {
      router.push("/teacher/quests/new");
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">A carregar a Forja de Quests...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        className: "font-pixel",
        style: {border: "4px solid #5d4037", padding: "16px", color: "#5d4037"},
        success: {style: {backgroundColor: "#c8e6c9"}},
        error: {style: {backgroundColor: "#ffcdd2"}}
      }}/>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8 p-5">
          <h1 className="text-4xl text-white [text-shadow:3px_3px_0_var(--color-header-bg)]">
            Forja de Quests de {user?.name}
          </h1>
          <Button onClick={handleCreateQuestClick} variant="primary">
            Criar Nova Quest
          </Button>
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
                  <ButtonLink
                    href={`/teacher/quests/${quest.id}`}
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
    </>
  );
}
