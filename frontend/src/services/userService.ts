import apiClient from '@/services/api/apiClient';
import { ClanDto } from '@/types/clanTypes';
import { Page, UserDto, UserWithScoreDto } from '@/types/userTypes';
import { PasswordFormInputs, ProfileInfoFormInputs } from '@/validators/profileValidators';

const BASE_URL = '/v1/core/users';

// --- Funções de Gestão de Utilizadores (CRUD) ---

export const getAllUsers = async (): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>(BASE_URL);
  return response.data;
};

export const getUserById = async (id: number): Promise<UserDto> => {
  const response = await apiClient.get<UserDto>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateUserProfile = async (userId: number, profileData: ProfileInfoFormInputs): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${userId}/profile`, profileData);
};

export const updateUserPassword = async (userId: number, passwordData: PasswordFormInputs): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${userId}/password`, passwordData);
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};

// --- Funções de Listagem por Role ---

export const listStudents = async (): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>(`${BASE_URL}/students`);
  return response.data;
};

export const listTeachers = async (): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>(`${BASE_URL}/teachers`);
  return response.data;
};

// --- Funções de Ranking e Pontuação ---

/**
 * Busca uma página do ranking de utilizadores.
 * @param page - O número da página a ser buscada (base 0).
 * @param size - O número de itens por página.
 */
export const getRanking = async (page: number, size: number): Promise<Page<UserWithScoreDto>> => {
  const response = await apiClient.get<Page<UserWithScoreDto>>(`${BASE_URL}/ranking?page=${page}&size=${size}`);
  return response.data;
};

export const getMyScore = async (): Promise<number> => {
  const response = await apiClient.get<number>(`${BASE_URL}/score`);
  return response.data;
};

export const getScoreByUserId = async (userId: number): Promise<number> => {
  const response = await apiClient.get<number>(`${BASE_URL}/${userId}/score`);
  return response.data;
};

export const getScoreByUserIdInClan = async (userId: number, clanId: number): Promise<number> => {
  const response = await apiClient.get<number>(`${BASE_URL}/${userId}/score-by-clan/${clanId}`);
  return response.data;
};

// --- Funções de Clãs do Utilizador ---

export const getMyManagedClans = async (): Promise<ClanDto[]> => {
  const response = await apiClient.get<ClanDto[]>(`${BASE_URL}/managed-clans`);
  return response.data;
};

export const getMyJoinedClans = async (): Promise<ClanDto[]> => {
  const response = await apiClient.get<ClanDto[]>(`${BASE_URL}/joined-clans`);
  return response.data;
};
