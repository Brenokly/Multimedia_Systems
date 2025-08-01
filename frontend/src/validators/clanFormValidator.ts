import { z } from "zod";

export const clanSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome do clã deve ter no mínimo 3 caracteres." })
    .max(50, { message: "O nome do clã deve ter no máximo 50 caracteres." }),
  joinCode: z
    .string()
    .regex(/^[A-Z0-9]{4}-\d{3}$/, { message: "O código deve estar no formato AAAA-123." })
    .transform((val) => val.toUpperCase())
});

export type ClanFormInputs = z.infer<typeof clanSchema>;