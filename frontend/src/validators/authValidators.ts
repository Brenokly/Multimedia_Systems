import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: "O nome de usuário é obrigatório." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;


// Esquema de validação para o formulário de Registro/Criação de Conta
export const signupSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  username: z.string()
    .min(3, { message: "O nome de usuário deve ter no mínimo 3 caracteres." }),
  password: z.string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  role: z.enum(["TEACHER", "STUDENT"], { // Os valores devem ser exatamente iguais aos do Enum do backend
    errorMap: () => ({ message: "Você precisa escolher entre Professor ou Aluno." }),
  }),
});

// Extrai o tipo do schema de registro para usar nos formulários
export type SignupFormInputs = z.infer<typeof signupSchema>;
