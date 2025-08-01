import { UserDto } from "./userTypes";

// --- DTOs de Resposta (o que a API envia) ---

/**
 * Representa os dados de uma Unidade como retornados pela API.
 * Corresponde ao `UnitDto` do backend.
 */
export interface UnitDto {
  id: number;
  clanId: number;
  name: string;
  totalQuestions: number;
}

/**
 * Representa os dados de um Clã como retornados pela API.
 * Corresponde ao `ClanDto` do backend.
 */
export interface ClanDto {
  id: number;
  joinCode: string;
  name: string;
  owner: UserDto;
  members: UserDto[];
}


// --- DTOs de Requisição (o que o frontend envia) ---

/**
 * Dados para criar ou atualizar uma Unidade.
 * Corresponde ao `UnitRequest` do backend.
 */
export interface UnitRequest {
  name: string;
}

/**
 * Dados para criar ou atualizar um Clã.
 * Corresponde ao `ClanRequest` do backend.
 */
export interface ClanRequest {
  name: string;
  joinCode?: string; // Opcional na criação
}
