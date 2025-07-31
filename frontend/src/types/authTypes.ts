import { UserDto } from "../types/userTypes";

/**
 * Define a estrutura dos dados do usuário que salvamos no frontend.
 * Para manter a consistência, vamos simplesmente re-exportar o UserDto,
 * já que os dados do usuário logado são os mesmos do DTO principal.
 */
export type UserData = UserDto;

/**
 * A resposta que o backend envia no SUCESSO do login.
 * Assumindo que o backend enviará um token e os dados do usuário.
 */
export interface LoginResponse {
  token: string;
  user: UserData;
}

/**
 * DTO para a requisição de login que o frontend envia.
 * Você precisará confirmar com o time de backend qual será a estrutura
 * exata do endpoint de login, mas esta é uma suposição comum.
 */
export interface LoginRequest {
  email: string;
  password: string;
}
