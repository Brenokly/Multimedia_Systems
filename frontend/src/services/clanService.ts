import apiClient from '@/services/api/apiClient';
import { ClanDto, ClanRequest, UnitDto, UnitRequest } from '@/types/clanTypes';
import { QuestionDto } from '@/types/questTypes';

const BASE_URL = '/v1/core/clans';

// --- Clan Endpoints ---

/**
 * Busca a lista de todos os clãs disponíveis.
 * @returns Uma promessa com a lista de clãs.
 */
export const getAllClans = async (): Promise<ClanDto[]> => {
  const response = await apiClient.get<ClanDto[]>(BASE_URL);
  return response.data;
};

/**
 * Busca um clã específico pelo seu ID.
 * @param id - O ID do clã a ser buscado.
 * @returns Uma promessa com os dados do clã.
 */
export const getClanById = async (id: number): Promise<ClanDto> => {
  const response = await apiClient.get<ClanDto>(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Cria um novo clã. O proprietário é definido no backend com base no usuário logado.
 * @param clanData - Os dados para a criação do novo clã (ex: nome).
 */
export const createClan = async (clanData: ClanRequest): Promise<void> => {
  await apiClient.post(BASE_URL, clanData);
};

/**
 * Atualiza os dados de um clã existente.
 * @param id - O ID do clã a ser atualizado.
 * @param clanData - Os novos dados para o clã.
 */
export const updateClan = async (id: number, clanData: ClanRequest): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${id}`, clanData);
};

/**
 * Deleta um clã do sistema.
 * @param id - O ID do clã a ser deletado.
 */
export const deleteClan = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Permite que o usuário logado ingresse em um clã usando um código de convite.
 * @param joinCode - O código para entrar no clã.
 */
export const joinClan = async (joinCode: string): Promise<void> => {
  await apiClient.post(`${BASE_URL}/${joinCode}/join`);
};

/**
 * Permite que o usuário logado saia de um clã.
 * @param id - O ID do clã a ser abandonado.
 */
export const leaveClan = async (id: number): Promise<void> => {
  await apiClient.post(`${BASE_URL}/${id}/leave`);
};

// --- Unit Endpoints ---

/**
 * Cria uma nova unidade dentro de um clã específico.
 * @param clanId - O ID do clã onde a unidade será criada.
 * @param unitData - Os dados da nova unidade.
 */
export const createUnit = async (clanId: number, unitData: UnitRequest): Promise<void> => {
  await apiClient.post(`${BASE_URL}/${clanId}/units`, unitData);
};

/**
 * Lista todas as unidades pertencentes a um clã específico.
 * @param clanId - O ID do clã.
 * @returns Uma promessa com a lista de unidades do clã.
 */
export const listUnitsByClan = async (clanId: number): Promise<UnitDto[]> => {
  const response = await apiClient.get<UnitDto[]>(`${BASE_URL}/${clanId}/units`);
  return response.data;
};

// --- Question Endpoints ---

/**
 * Lista todas as questões associadas a um clã específico.
 * @param clanId - O ID do clã.
 * @returns Uma promessa com a lista de questões do clã.
 */
export const listQuestionsByClan = async (clanId: number): Promise<QuestionDto[]> => {
  const response = await apiClient.get<QuestionDto[]>(`${BASE_URL}/${clanId}/questions`);
  return response.data;
};
