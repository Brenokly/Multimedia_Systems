export type Quest = {
  id: string;
  title: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  subject: 'Estrutura de Dados' | 'Algoritmos' | 'Redes' | 'Arquitetura';
};