import apiClient from '@/services/api/apiClient';
import { AuthRequest, LoginResponse, UserData } from '../types/authTypes';
import { SignupFormInputs } from '@/validators/authValidators';

export const signupUserService = async (data: SignupFormInputs): Promise<UserData> => {
  const response = await apiClient.post<UserData>('/users/signup', data);
  return response.data;
};

export const loginUserService = async (data: AuthRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/users/login', data);
  return response.data;
};

export const deleteUserAccountService = async (userId: number): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};