import apiClient from '@/services/api/apiClient';
import { UnitDto, UnitRequest } from '@/types/clanTypes';
import { QuestionDto, QuestionRequest } from '@/types/questTypes';

const BASE_URL = '/v1/core/units';

/**
 * Busca uma unidade específica pelo seu ID.
 * @param id - O ID da unidade a ser buscada.
 * @returns Uma promessa com os dados da unidade.
 */
export const getUnitById = async (id: number): Promise<UnitDto> => {
  const response = await apiClient.get<UnitDto>(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Atualiza os dados de uma unidade existente.
 * @param id - O ID da unidade a ser atualizada.
 * @param unitData - Os novos dados para a unidade.
 */
export const updateUnit = async (id: number, unitData: UnitRequest): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${id}`, unitData);
};

/**
 * Deleta uma unidade do sistema.
 * @param id - O ID da unidade a ser deletada.
 */
export const deleteUnit = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

/**
 * Cria uma nova questão dentro de uma unidade específica.
 * @param unitId - O ID da unidade onde a questão será criada.
 * @param questData - Os dados da nova questão.
 */
export const createQuestInUnit = async (unitId: number, questData: QuestionRequest): Promise<void> => {
  // O backend espera um objeto QuestionRequest.Create, que é compatível com nosso QuestionRequest.
  await apiClient.post(`${BASE_URL}/${unitId}/questions`, questData);
};

/**
 * Lista todas as questões pertencentes a uma unidade específica.
 * @param unitId - O ID da unidade.
 * @returns Uma promessa com a lista de questões da unidade.
 */
export const listQuestionsByUnit = async (unitId: number): Promise<QuestionDto[]> => {
  const response = await apiClient.get<QuestionDto[]>(`${BASE_URL}/${unitId}/questions`);
  return response.data;
};
