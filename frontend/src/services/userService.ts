import apiClient from '@/services/api/apiClient';
import { UserCreateRequest, UserDto, UserUpdateRequest } from '@/types/userTypes';

const BASE_URL = '/v1/core/users';

/**
 * Busca a lista de todos os usuários.
 * Mapeia para: GET /v1/core/users
 * @returns Uma promessa com a lista de usuários.
 */
export const getAllUsers = async (): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>(BASE_URL);
  return response.data;
};

/**
 * Busca um usuário específico pelo seu ID.
 * Mapeia para: GET /v1/core/users/{id}
 * @param id - O ID do usuário a ser buscado.
 * @returns Uma promessa com os dados do usuário.
 */
export const getUserById = async (id: number): Promise<UserDto> => {
  const response = await apiClient.get<UserDto>(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Cria um novo usuário no sistema.
 * Mapeia para: POST /v1/core/users
 * @param userData - Os dados do novo usuário.
 * @returns Uma promessa vazia, pois o backend retorna 201 CREATED sem corpo.
 */
export const createUser = async (userData: UserCreateRequest): Promise<void> => {
  await apiClient.post(BASE_URL, userData);
};

/**
 * Atualiza os dados de um usuário existente.
 * Mapeia para: PUT /v1/core/users/{id}
 * @param id - O ID do usuário a ser atualizado.
 * @param userData - Os novos dados para o usuário.
 * @returns Uma promessa vazia, pois o backend retorna 204 No Content.
 */
export const updateUser = async (id: number, userData: UserUpdateRequest): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${id}`, userData);
};

/**
 * Deleta um usuário do sistema.
 * Mapeia para: DELETE /v1/core/users/{id}
 * @param id - O ID do usuário a ser deletado.
 * @returns Uma promessa vazia, pois o backend retorna 204 No Content.
 */
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${id}`);
};
