/**
 * Representa os papéis (roles) de usuário disponíveis no sistema.
 * Corresponde ao enum `Role` do backend.
 */
export type Role = "TEACHER" | "STUDENT";

/**
 * Representa os dados de um usuário como retornados pela API.
 * Corresponde ao `UserDto` do backend.
 */
export interface UserDto {
  id: number;
  name: string;
  email: string;
  avatarId: number;
  role: Role;
}

/**
 * Dados necessários para criar um novo usuário.
 * Corresponde ao `UserRequest.Create` do backend.
 */
export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  avatarId: number;
  role: Role;
}

/**
 * Dados necessários para atualizar um usuário existente.
 * Corresponde ao `UserRequest.Update` do backend.
 */
export interface UserUpdateRequest {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatarId: number;
  role: Role;
}
