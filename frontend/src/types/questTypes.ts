// --- Enums ---
export type Level = "EASY" | "MEDIUM" | "HARD";

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
  options?: OptionRequest[]; // A classe Create no backend exige isso
}
