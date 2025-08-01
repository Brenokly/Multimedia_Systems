"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";

import ButtonLink from "@/components/ui/ButtonLink";
import ClanItem from "@/components/ui/ClanItem";
import {getUserData} from "@/services/api/tokenManager";
import {UserData} from "@/types/authTypes";
import {ClanDto} from "@/types/clanTypes";
import {getMyManagedClans} from "@/services/userService";

/**
 * Página para o professor visualizar e gerenciar seus clãs.
 */
export default function TeacherClansPage() {
  const router = useRouter();
  const [, setUser] = useState<UserData | null>(null);
  const [myClans, setMyClans] = useState<ClanDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    if (!userData || String(userData.role).toUpperCase() !== "TEACHER") {
      router.push("/login");
      return;
    }
    setUser(userData);

    const fetchClans = async () => {
      try {
        const teacherClans = await getMyManagedClans()
        setMyClans(teacherClans);
      } catch (error) {
        console.error("Falha ao buscar os clãs:", error);
        toast.error("Não foi possível carregar seus clãs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClans();
  }, [router]);

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
        error: {style: {backgroundColor: "#ffcdd2"}}
      }}/>
      <div className="w-full">
        <div className="flex justify-between items-center mb-8 p-5">
          <h1 className="text-4xl text-white [text-shadow:3px_3px_0_var(--color-header-bg)]">
            Salão dos Meus Clãs
          </h1>
          <ButtonLink href="/teacher/clans/new" variant="primary">
            FUNDAR NOVO CLÃ
          </ButtonLink>
        </div>

        <div
          className="p-8 pixel-border space-y-4 rounded"
          style={{backgroundColor: "#252637"}}
        >
          {myClans.length > 0 ? (
            myClans.map((clan) => (
              <ClanItem
                key={clan.id}
                clan={clan}
                action={
                  <ButtonLink
                    href={`/teacher/clans/${clan.id}`}
                    variant="primary"
                    className="!text-xs !py-2 !px-4"
                  >
                    GERENCIAR
                  </ButtonLink>
                }
              />
            ))
          ) : (
            <p className="text-center text-white">
              Você ainda não fundou nenhum clã. Use o botão acima para começar!
            </p>
          )}
        </div>
      </div>
    </>
  );
}