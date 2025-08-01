// --- Enums ---
export type Level = "EASY" | "MEDIUM" | "HARD";

// --- Níveis de dificuldade ---
export const difficultyLevels: { id: Level; label: string }[] = [
  {id: "EASY", label: "Fácil"},
  {id: "MEDIUM", label: "Médio"},
  {id: "HARD", label: "Difícil"},
];

// --- Tópicos das quests ---
export const subjects = [
  {id: "Análise de Algoritmos", label: "Análise de Algoritmos"},
  {id: "Arquitetura de Computadores", label: "Arquitetura de Computadores"},
  {id: "Banco de Dados", label: "Banco de Dados"},
  {id: "Computação Gráfica", label: "Computação Gráfica"},
  {id: "Computação Quântica", label: "Computação Quântica"},
  {id: "Desenvolvimento Móvel", label: "Desenvolvimento Móvel"},
  {id: "Desenvolvimento Web", label: "Desenvolvimento Web"},
  {id: "Engenharia de Software", label: "Engenharia de Software"},
  {id: "Estruturas de Dados I", label: "Estruturas de Dados I"},
  {id: "Estruturas de Dados II", label: "Estruturas de Dados II"},
  {id: "Inteligência Artificial", label: "Inteligência Artificial"},
  {id: "Metodologias Ágeis", label: "Metodologias Ágeis"},
  {id: "Programação de Computadores", label: "Programação de Computadores"},
  {id: "Programação de Jogos", label: "Programação de Jogos"},
  {id: "Redes de Computadores", label: "Redes de Computadores"},
  {id: "Segurança", label: "Segurança"},
  {id: "Sistemas Operacionais", label: "Sistemas Operacionais"},
  {id: "Sistemas Multimídia", label: "Sistemas Multimídia"},
  {id: "Teste de Software", label: "Teste de Software"},
  {id: "Outro", label: "Outro"}
];

// --- DTOs de Resposta (o que a API envia) ---

/**
 * Representa os dados de uma Opção de resposta como retornados pela API.
 * Corresponde ao `OptionDto` do backend.
 */
export interface OptionDto {
  id: number;
  correct: boolean;
  assertion: string;
  feedback?: string;
}

/**
 * Representa os dados de uma Questão como retornados pela API.
 * Corresponde ao `QuestionDto` do backend.
 */
export interface QuestionDto {
  id: number;
  clanId: number;
  level: Level;
  statement: string;
  topics: string[];
  options: OptionDto[];
}

/**
 * Representa os dados de uma Resposta como retornados pela API.
 * Corresponde ao `AnswerDto` do backend.
 */
export interface AnswerDto {
  id: number;
  userId: number;
  optionId: number;
  correct: boolean;
  timestamp: string;
}


// --- DTOs de Requisição (o que o frontend envia) ---

/**
 * Dados para criar uma Opção de resposta.
 * Corresponde ao `OptionRequest` do backend.
 */
export interface OptionRequest {
  correct: boolean;
  assertion: string;
  feedback?: string;
}

/**
 * Dados para criar ou atualizar uma Questão.
 * Corresponde ao `QuestionRequest` do backend.
 */
export interface QuestionRequest {
  level: Level;
  statement: string;
  topics?: string[];
  options?: OptionRequest[];
}
