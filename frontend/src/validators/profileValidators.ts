import { z } from 'zod';

// Esquema para atualizar o nome e o avatar do utilizador
export const profileInfoSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." })
    .max(30, { message: "O nome deve ter no máximo 30 caracteres." }),
  avatarId: z.number().min(1, { message: "Por favor, escolha um avatar." }),
});
export type ProfileInfoFormInputs = z.infer<typeof profileInfoSchema>;


// Esquema para atualizar a palavra-passe do utilizador
export const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "A palavra-passe atual é obrigatória." }),
  newPassword: z.string().min(8, { message: "A nova palavra-passe deve ter no mínimo 8 caracteres." }),
  confirmPassword: z.string().min(8, { message: "A confirmação da palavra-passe é obrigatória." }),
})
.refine((data) => data.newPassword === data.confirmPassword, {
    message: "As novas palavras-passe não correspondem.",
    path: ["confirmPassword"],
});
export type PasswordFormInputs = z.infer<typeof passwordSchema>;
