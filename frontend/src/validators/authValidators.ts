import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." })
    .max(30, { message: "O nome deve ter no máximo 30 caracteres." }),
  email: z.string()
    .email({ message: "Por favor, insira um email válido." }),
  password: z.string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  confirmPassword: z.string().min(8, { message: "A confirmação de senha é obrigatória." }),
  avatarId: z.number().min(1, { message: "Por favor, escolha um avatar." }),
  role: z.enum(["TEACHER", "STUDENT"], {
    errorMap: () => ({ message: "Você precisa escolher entre Professor ou Aluno." }),
  }),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

export type SignupFormInputs = z.infer<typeof signupSchema>;
