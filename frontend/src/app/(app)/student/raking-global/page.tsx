"use client";

import Button from "@/components/ui/Button";
import { getAvatarById } from "@/services/avatarService";
import Image from "next/image";
import { useMemo, useState } from "react";

// --- Tipos e Dados Mock ---

// Define a estrutura de um jogador no ranking
interface RankedPlayer {
  id: number;
  position: number;
  name: string;
  avatarId: number;
  score: number;
}

// Geração de dados estáticos para simular o ranking
const mockRankingData: RankedPlayer[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  position: i + 1,
  name: `Aventureiro_${i + 1}`,
  avatarId: (i % 10) + 1, // Cicla entre os 10 avatares
  score: Math.floor(Math.random() * (5000 - 500 + 1)) + 500,
}))
  .sort((a, b) => b.score - a.score) // Ordena por pontuação
  .map((player, index) => ({ ...player, position: index + 1 })); // Reatribui a posição

/**
 * Página do Ranking, que exibe a classificação dos jogadores.
 * Apresenta uma tabela paginada com a posição, nome, avatar e pontuação.
 */
export default function RankingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // --- Lógica de Paginação ---
  const totalPages = Math.ceil(mockRankingData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return mockRankingData.slice(startIndex, endIndex);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
            {paginatedData.map((player, index) => (
              <tr
                key={player.id}
                className={`border-t-4 border-[var(--color-fundo-shadow)] ${
                  index % 2 === 0 ? "bg-black/20" : "bg-black/40"
                }`}
              >
                <td className="p-4 font-bold text-2xl text-center">
                  {player.position}º
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={getAvatarById(player.avatarId)}
                        alt={`Avatar de ${player.name}`}
                        fill
                        className="object-cover pixel-border"
                      />
                    </div>
                    <span>{player.name}</span>
                  </div>
                </td>
                <td className="p-4 text-right font-bold text-lg text-yellow-300">
                  {player.score} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="text-sm"
          >
            Anterior
          </Button>
          <span className="font-pixel text-white text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-sm"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
