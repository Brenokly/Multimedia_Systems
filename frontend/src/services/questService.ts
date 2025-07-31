import apiClient from '@/services/api/apiClient';
import { OptionDto, OptionRequest, QuestionDto, QuestionRequest } from '@/types/questTypes';

const QUESTIONS_BASE_URL = '/v1/core/questions';
const OPTIONS_BASE_URL = '/v1/core/options';

// --- Funções relacionadas a Questões ---

/**
 * Busca a lista de todas as questões cadastradas no sistema.
 * @returns Uma promessa com a lista de questões.
 */
export const getAllQuests = async (): Promise<QuestionDto[]> => {
  const response = await apiClient.get<QuestionDto[]>(QUESTIONS_BASE_URL);
  return response.data;
};

/**
 * Busca uma questão específica pelo seu ID.
 * @param id - O ID da questão a ser buscada.
 * @returns Uma promessa com os dados da questão.
 */
export const getQuestById = async (id: number): Promise<QuestionDto> => {
  const response = await apiClient.get<QuestionDto>(`${QUESTIONS_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Atualiza os dados de uma questão existente.
 * @param id - O ID da questão a ser atualizada.
 * @param questData - Os novos dados para a questão.
 */
export const updateQuest = async (id: number, questData: QuestionRequest): Promise<void> => {
  await apiClient.put(`${QUESTIONS_BASE_URL}/${id}`, questData);
};

/**
 * Deleta uma questão do sistema.
 * @param id - O ID da questão a ser deletada.
 */
export const deleteQuest = async (id: number): Promise<void> => {
  await apiClient.delete(`${QUESTIONS_BASE_URL}/${id}`);
};

/**
 * Adiciona uma lista de novas opções (alternativas) a uma questão existente.
 * @param questionId - O ID da questão que receberá as novas opções.
 * @param optionsData - Um array com os dados das opções a serem criadas.
 */
export const addOptionsToQuest = async (questionId: number, optionsData: OptionRequest[]): Promise<void> => {
  await apiClient.post(`${QUESTIONS_BASE_URL}/${questionId}/options`, optionsData);
};


// --- Funções relacionadas a Opções ---

/**
 * Busca uma alternativa específica pelo seu ID.
 * @param id - O ID da alternativa a ser buscada.
 * @returns Uma promessa com os dados da alternativa.
 */
export const getOptionById = async (id: number): Promise<OptionDto> => {
    const response = await apiClient.get<OptionDto>(`${OPTIONS_BASE_URL}/${id}`);
    return response.data;
};

/**
 * Atualiza os dados de uma alternativa existente.
 * @param id - O ID da alternativa a ser atualizada.
 * @param optionData - Os novos dados para a alternativa.
 */
export const updateOption = async (id: number, optionData: OptionRequest): Promise<void> => {
    await apiClient.put(`${OPTIONS_BASE_URL}/${id}`, optionData);
};

/**
 * Deleta uma alternativa do sistema.
 * @param id - O ID da alternativa a ser deletada.
 */
export const deleteOption = async (id: number): Promise<void> => {
    await apiClient.delete(`${OPTIONS_BASE_URL}/${id}`);
};
