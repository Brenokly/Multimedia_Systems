import apiClient from '@/services/api/apiClient';
import { LoginRequest, LoginResponse } from '@/types/authTypes';
import { UserCreateRequest } from '@/types/userTypes';

const AUTH_BASE_URL = '/v1/auth';

/**
 * Envia os dados de registro para o endpoint de criação de conta.
 * @param data - Os dados do formulário de registro (name, username, password, role).
 */
export const signupUserService = async (data: UserCreateRequest): Promise<void> => {
  await apiClient.post(`${AUTH_BASE_URL}/register`, data);
};

/**
 * Envia as credenciais de login para o endpoint de autenticação.
 * @param data - Os dados do formulário de login (username, password).
 * @returns Uma promessa com a resposta do login, contendo o token e os dados do usuário.
 */
export const loginUserService = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(`${AUTH_BASE_URL}/login`, data);
  return response.data;
};
