"use client";

import {useParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import {getAvatarById} from "@/services/avatarService";
import {getClanById} from "@/services/clanService";
import {getScoreByUserIdInClan, listStudents} from "@/services/userService";
import {UserWithScoreDto} from "@/types/userTypes";
import {ClanDto} from "@/types/clanTypes";

/**
 * Página do Ranking de um clã específico, construído a partir dos membros do clã.
 */
export default function ClanRankingPage() {
  const params = useParams();
  const clanId = params.id as string;

  const [clan, setClan] = useState<ClanDto | null>(null);
  const [ranking, setRanking] = useState<UserWithScoreDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const fetchRankingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clanData, allStudents] = await Promise.all([
        getClanById(Number(clanId)),
        listStudents()
      ]);
      setClan(clanData);

      if (allStudents && allStudents.length > 0) {
        const rankingPromises = allStudents.map(async (student) => {
          const score = await getScoreByUserIdInClan(student.id, Number(clanId));
          return {...student, score};
        });

        const unsortedRanking = await Promise.all(rankingPromises);

        const sortedRanking = unsortedRanking
          .filter(player => player.score > 0)
          .sort((a, b) => b.score - a.score);
        setRanking(sortedRanking);
      }
    } catch (error) {
      console.error("Falha ao buscar o ranking do clã:", error);
      toast.error("Não foi possível carregar o ranking deste clã.");
    } finally {
      setIsLoading(false);
    }
  }, [clanId]);

  useEffect(() => {
    if (clanId) {
      fetchRankingData();
    }
  }, [clanId, fetchRankingData]);

  // Lógica de Paginação no Frontend
  const totalPages = Math.ceil(ranking.length / ITEMS_PER_PAGE);
  const currentRankingPage = ranking.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getRowStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500/20 border-yellow-400/50";
      case 2:
        return "bg-gray-400/20 border-gray-300/50";
      case 3:
        return "bg-orange-600/20 border-orange-500/50";
      default:
        return "border-[var(--color-fundo-shadow)]";
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-white text-xl">
        A carregar Ranking do Clã...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl text-white mb-8 [text-shadow:2px_2px_0_#000]">
        Ranking do Clã: {clan?.name || '...'}
      </h2>

      {currentRankingPage.length === 0 ? (
        <p className="text-white text-center">Nenhum herói no ranking deste clã ainda.</p>
      ) : (
        <>
          <div className="pixel-border-dark p-1">
            <table className="w-full text-white">
              <thead className="bg-[var(--color-fundo-shadow)]">
              <tr>
                <th className="p-4 text-left text-yellow-300 w-24">Posição</th>
                <th className="p-4 text-left text-yellow-300">Herói</th>
                <th className="p-4 text-right text-yellow-300 w-40">Pontuação</th>
              </tr>
              </thead>
              <tbody>
              {currentRankingPage.map((player, index) => {
                const position = currentPage * ITEMS_PER_PAGE + index + 1;
                return (
                  <tr key={player.id} className={`border-t-4 ${getRowStyle(position)}`}>
                    <td className="p-4 font-bold text-3xl text-center align-middle">
                        <span style={{textShadow: "2px 2px 0px rgba(0,0,0,0.5)"}}>
                          {position}º
                        </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={getAvatarById(player.avatarId)}
                            alt={`Avatar de ${player.name}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-lg">{player.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-xl text-yellow-300 align-middle">
                      {player.score} XP
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <Button onClick={handlePrevPage} disabled={currentPage === 0} className="text-sm">
                Anterior
              </Button>
              <span className="font-pixel text-white text-sm">
                Página {currentPage + 1} de {totalPages}
              </span>
              <Button onClick={handleNextPage} disabled={currentPage >= totalPages - 1} className="text-sm">
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}