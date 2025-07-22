import { z } from 'zod';

// Esquema de Login (continua o mesmo)
export const loginSchema = z.object({
  login: z.string().min(1, { message: "O login é obrigatório." }),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});
export type LoginFormInputs = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string()
    .min(1, { message: "O nome é obrigatório." }),
  email: z.string()
    .email({ message: "Por favor, insira um email válido." }),
  password: z.string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  role: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Você precisa escolher uma classe." }),
  }),
});

export type SignupFormInputs = z.infer<typeof signupSchema>;