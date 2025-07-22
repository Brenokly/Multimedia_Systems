import { Quest } from "@/types/quest.types";

const MOCK_QUESTS: Quest[] = [
  { id: '1', title: 'Quest: Fila de Prioridades', difficulty: 'Médio', subject: 'Estrutura de Dados' },
  { id: '2', title: 'Quest: O que é um bit?', difficulty: 'Fácil', subject: 'Arquitetura' },
  { id: '3', title: 'Quest: Complexidade Big O', difficulty: 'Difícil', subject: 'Algoritmos' },
  { id: '4', title: 'Quest: Problema do Caixeiro Viajante', difficulty: 'Difícil', subject: 'Algoritmos' },
  { id: '5', title: 'Quest: Endereçamento IP', difficulty: 'Fácil', subject: 'Redes' },
  { id: '6', title: 'Quest: Árvores Binárias', difficulty: 'Médio', subject: 'Estrutura de Dados' },
  { id: '7', title: 'Quest: Protocolos de Rede', difficulty: 'Médio', subject: 'Redes' },
  { id: '8', title: 'Quest: Algoritmos de Ordenação', difficulty: 'Fácil', subject: 'Algoritmos' },
  { id: '9', title: 'Quest: Sistemas Distribuídos', difficulty: 'Difícil', subject: 'Arquitetura' },
  { id: '10', title: 'Quest: Grafos e Caminhos Mínimos', difficulty: 'Médio', subject: 'Algoritmos' },
  { id: '11', title: 'Quest: Conceitos de TCP/IP', difficulty: 'Fácil', subject: 'Redes' },
];

export const getGlobalQuests = (filters: {
  difficulty?: string;
  subject?: string;
}): Promise<Quest[]> => {
  console.log("Buscando quests com filtros:", filters);

  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredQuests = MOCK_QUESTS;

      if (filters.difficulty && filters.difficulty !== 'all') {
        filteredQuests = filteredQuests.filter(q => q.difficulty === filters.difficulty);
      }
      if (filters.subject && filters.subject !== 'all') {
        filteredQuests = filteredQuests.filter(q => q.subject === filters.subject);
      }

      resolve(filteredQuests);
    }, 500);
  });
};