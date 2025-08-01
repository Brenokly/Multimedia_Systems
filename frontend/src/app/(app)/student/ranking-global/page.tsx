"use client";

import Button from "@/components/ui/Button";
import { getAvatarById } from "@/services/avatarService";
import { getRanking } from "@/services/userService";
import { Page, UserWithScoreDto } from "@/types/userTypes";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Página do Ranking, que exibe a classificação dos jogadores.
 * Apresenta uma tabela paginada com dados buscados da API e um visual aprimorado.
 */
export default function RankingPage() {
  const [rankingPage, setRankingPage] = useState<Page<UserWithScoreDto> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Spring Pageable é base 0
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchRanking = async () => {
      setIsLoading(true);
      try {
        const data = await getRanking(currentPage, ITEMS_PER_PAGE);
        setRankingPage(data);
      } catch (error) {
        console.error("Falha ao buscar o ranking:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, [currentPage]);

  const handleNextPage = () => {
    if (rankingPage && currentPage < rankingPage.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para determinar o estilo da linha com base na posição
  const getRowStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500/20 border-yellow-400/50"; // Ouro
      case 2:
        return "bg-gray-400/20 border-gray-300/50"; // Prata
      case 3:
        return "bg-orange-600/20 border-orange-500/50"; // Bronze
      default:
        return "border-[var(--color-fundo-shadow)]";
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-white text-xl">
        A carregar Salão dos Heróis...
      </div>
    );
  }

  if (!rankingPage || rankingPage.content.length === 0) {
    return (
      <div className="w-full text-center">
        <h2
          className="text-3xl text-white mb-8"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          Salão dos Heróis
        </h2>
        <p className="text-white">Nenhum herói no ranking ainda.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2
        className="text-3xl text-white mb-8"
        style={{ textShadow: "2px 2px 0 #000" }}
      >
        Salão dos Heróis
      </h2>

      {/* Container da Tabela */}
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
            {rankingPage.content.map((player, index) => {
              const position = currentPage * ITEMS_PER_PAGE + index + 1;
              return (
                <tr
                  key={player.id}
                  className={`border-t-4 ${getRowStyle(position)}`}
                >
                  <td className="p-4 font-bold text-3xl text-center align-middle">
                    <span style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>
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
                          className="object-contain" // object-contain para não cortar a imagem
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

      {/* Controles de Paginação */}
      {rankingPage.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-sm"
          >
            Anterior
          </Button>
          <span className="font-pixel text-white text-sm">
            Página {currentPage + 1} de {rankingPage.totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage >= rankingPage.totalPages - 1}
            className="text-sm"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
