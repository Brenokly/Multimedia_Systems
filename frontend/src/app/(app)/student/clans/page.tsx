"use client";

import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";

import Button from "@/components/ui/Button";
import {JoinClanModal} from "@/components/ui/JoinClanModal";
import StudentClanItem from "@/components/ui/StudentClanItem";
import {getUserData} from "@/services/api/tokenManager";
import {leaveClan} from "@/services/clanService";
import {UserData} from "@/types/authTypes";
import {ClanDto} from "@/types/clanTypes";
import {ConfirmationModal} from "@/components/ui/ConfirmationModal";
import {getMyJoinedClans} from "@/services/userService";

/**
 * Página para o aluno visualizar e gerenciar os clãs aos quais pertence.
 */
export default function StudentClansPage() {
  const router = useRouter();
  const [, setUser] = useState<UserData | null>(null);
  const [myClans, setMyClans] = useState<ClanDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [clanToLeave, setClanToLeave] = useState<ClanDto | null>(null);

  const fetchClans = useCallback(async () => {
    setIsLoading(true);
    try {
      const studentClans = await getMyJoinedClans()
      setMyClans(studentClans);
    } catch (error) {
      console.error("Falha ao buscar os clãs:", error);
      toast.error("Não foi possível carregar seus clãs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const userData = getUserData();
    if (!userData || String(userData.role).toUpperCase() !== "STUDENT") {
      router.push("/login");
      return;
    }
    setUser(userData);
    fetchClans();
  }, [router, fetchClans]);

  const handleLeaveClan = async () => {
    if (!clanToLeave) return;
    try {
      await leaveClan(clanToLeave.id);
      toast.success(`Você saiu do clã "${clanToLeave.name}"`);
      await fetchClans();
    } catch (error) {
      console.error("Erro ao sair do clã:", error);
      toast.error("Não foi possível sair do clã.");
    } finally {
      setClanToLeave(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">Carregando Salão dos Clãs...</p>
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
            Salão dos Meus Clãs
          </h1>
          <Button onClick={() => setIsJoinModalOpen(true)} variant="primary">
            JUNTAR-SE A UM CLÃ
          </Button>
        </div>

        <div className="p-8 pixel-border space-y-4 rounded" style={{backgroundColor: "#252637"}}>
          <h2 className="text-2xl mb-4 [text-shadow:2px_2px_0_#000]">
            Clãs que você pertence:
          </h2>
          {myClans.length > 0 ? (
            myClans.map((clan) => (
              <StudentClanItem
                key={clan.id}
                clan={clan}
                onLeaveClan={() => setClanToLeave(clan)}
              />
            ))
          ) : (
            <p className="text-center text-white">
              Você ainda não faz parte de nenhum clã. Use o botão acima para se juntar a um!
            </p>
          )}
        </div>
      </div>

      <JoinClanModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onClanJoined={() => fetchClans()}
      />

      <ConfirmationModal
        isOpen={!!clanToLeave}
        onCancel={() => setClanToLeave(null)}
        onConfirm={handleLeaveClan}
        title="SAIR DO CLÃ?"
        message={`Tem certeza que deseja sair do clã "${clanToLeave?.name}"?`}
        confirmText="Sair"
      />
    </>
  );
}