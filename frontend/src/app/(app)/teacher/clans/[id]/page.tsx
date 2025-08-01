"use client";

import {useParams, useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";

import Button from "@/components/ui/Button";
import {UnitCard} from "@/components/ui/UnitCard";
import {ConfirmationModal} from "@/components/ui/ConfirmationModal";
import {NewUnitModal} from "@/components/ui/NewUnitModal";
import {deleteClan, getClanById, listUnitsByClan} from "@/services/clanService";
import {deleteUnit, listQuestionsByUnit} from "@/services/unitService";
import {ClanDto, UnitDto} from "@/types/clanTypes";
import {QuestionDto} from "@/types/questTypes";

interface UnitWithQuests {
  unit: UnitDto;
  questions: QuestionDto[];
}

type DeletionAction = {
  type: 'unit' | 'clan';
  id: number;
} | null;

export default function ManageClanPage() {
  const router = useRouter();
  const params = useParams();
  const clanId = params.id as string;

  const [clan, setClan] = useState<ClanDto | null>(null);
  const [unitsWithQuests, setUnitsWithQuests] = useState<UnitWithQuests[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletionAction, setDeletionAction] = useState<DeletionAction>(null);
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clanData, unitsData] = await Promise.all([
        getClanById(Number(clanId)),
        listUnitsByClan(Number(clanId)),
      ]);
      setClan(clanData);

      const unitsWithQuestsPromises = unitsData.map(async (unit) => {
        const questions = await listQuestionsByUnit(unit.id);
        return {unit, questions};
      });

      const resolvedUnitsWithQuests = await Promise.all(unitsWithQuestsPromises);
      setUnitsWithQuests(resolvedUnitsWithQuests);

    } catch (error) {
      toast.error("Não foi possível carregar os dados do clã.");
      console.error("Erro ao buscar dados do clã:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clanId]);

  useEffect(() => {
    if (clanId) {
       fetchData();
    }
  }, [clanId, fetchData]);

  const handleConfirmDeletion = async () => {
    if (!deletionAction) return;
    if (deletionAction.type === 'unit') {
      try {
        await deleteUnit(deletionAction.id);
        toast.success("Unidade removida com sucesso!");
        await fetchData();
      } catch (error) {
        console.error("Falha ao remover a unidade:", error);
        toast.error("Falha ao remover a unidade.");
      }
    }
    if (deletionAction.type === 'clan') {
      try {
        await deleteClan(deletionAction.id);
        toast.success("Clã excluído com sucesso.");
        router.push("/teacher/clans");
      } catch (error) {
        console.error("Falha ao excluir o clã:", error);
        toast.error("Falha ao excluir o clã.");
      }
    }
    setDeletionAction(null);
  };

  if (isLoading) {
    return <div className="flex w-full h-full items-center justify-center"><p className="text-white text-xl">Carregando
      dados do Clã...</p></div>;
  }
  if (!clan) {
    return <div className="flex w-full h-full items-center justify-center"><p
      className="text-white text-xl text-center">Clã não encontrado.</p></div>;
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
        <h1 className="text-4xl text-white mb-8 [text-shadow:3px_3px_0_var(--color-header-bg)]">
          Gerenciar Clã: {clan.name}
        </h1>

        <div className="p-8 pixel-border space-y-6 rounded" style={{backgroundColor: "#252637"}}>
          <h2 className="text-3xl text-yellow-300 [text-shadow:2px_2px_0_#000]">
            Jornada de Quests
          </h2>

          <div className="space-y-4">
            {unitsWithQuests.length > 0 ? (
              unitsWithQuests.map(({unit, questions}) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  questions={questions}
                  onRemoveUnit={() => setDeletionAction({type: 'unit', id: unit.id})}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">Este clã ainda não possui unidades.</p>
            )}
          </div>

          <div className="pt-4 text-center">
            {/* 3. Botão agora abre o modal */}
            <Button onClick={() => setIsNewUnitModalOpen(true)} variant="primary">
              ADICIONAR NOVA UNIDADE
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 pixel-border-dark text-center" style={{borderColor: "#c62828"}}>
          <Button onClick={() => setDeletionAction({type: 'clan', id: clan.id})} variant="danger">
            Excluir Clã Permanentemente
          </Button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deletionAction}
        onCancel={() => setDeletionAction(null)}
        onConfirm={handleConfirmDeletion}
        title={deletionAction?.type === 'clan' ? "EXCLUIR CLÃ?" : "REMOVER UNIDADE?"}
        message={deletionAction?.type === 'clan' ?
          "ATENÇÃO: Esta ação é irreversível e excluirá todas as unidades e quests associadas. Deseja continuar?"
          : "Tem certeza que deseja remover esta unidade e todas as suas quests?"}
        confirmText={deletionAction?.type === 'clan' ? "Excluir Clã" : "Remover"}
      />

      {/* Renderiza o modal de criar nova unidade */}
      <NewUnitModal
        isOpen={isNewUnitModalOpen}
        onClose={() => setIsNewUnitModalOpen(false)}
        clanId={clan.id}
        onUnitCreated={fetchData}
      />
    </>
  );
}