import apiClient from '@/services/api/apiClient';
import { UserCreateRequest, UserDto } from '@/types/userTypes';
import { PasswordFormInputs, ProfileInfoFormInputs } from '@/validators/profileValidators';

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
 * Atualiza os dados de perfil (nome e avatar) de um utilizador.
 * @param userId - O ID do utilizador a ser atualizado.
 * @param profileData - Os novos dados de nome e avatarId.
 */
export const updateUserProfile = async (userId: number, profileData: ProfileInfoFormInputs): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${userId}/profile`, profileData);
};

/**
 * Atualiza a palavra-passe de um utilizador.
 * @param userId - O ID do utilizador a ser atualizado.
 * @param passwordData - Os dados da nova palavra-passe e da atual.
 */
export const updateUserPassword = async (userId: number, passwordData: PasswordFormInputs): Promise<void> => {
  await apiClient.put(`${BASE_URL}/${userId}/password`, passwordData);
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
