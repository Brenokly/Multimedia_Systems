import {z} from "zod";

export const optionSchema = z.object({
  assertion: z.string().min(1, {message: "O texto da opção é obrigatório."}),
  feedback: z.string().min(1, {message: "O feedback é obrigatório."}),
});

export const questSchema = z.object({
  unitId: z.coerce.number({
    invalid_type_error: "Você deve selecionar uma unidade.",
  }).min(1, {message: "Você deve selecionar uma unidade."}),
  statement: z
    .string()
    .min(10, {message: "O enunciado deve ter no mínimo 10 caracteres."}),
  level: z.enum(["EASY", "MEDIUM", "HARD"], {required_error: "Selecione um nível de dificuldade."}),
  topics: z
    .array(z.string())
    .nonempty({message: "Selecione ao menos um tópico."}),
  options: z
    .array(optionSchema)
    .length(3, {message: "A quest deve ter exatamente 3 opções."}),
  correctOptionIndex: z.coerce
    .number({invalid_type_error: "Você deve selecionar uma opção correta."})
    .min(0, "Você deve selecionar uma opção correta."),
});

export type QuestFormInputs = z.infer<typeof questSchema>;

export const questEditSchema = z.object({
  statement: z
    .string()
    .min(10, { message: "O enunciado deve ter no mínimo 10 caracteres." }),
  level: z.enum(["EASY", "MEDIUM", "HARD"], { required_error: "Selecione um nível de dificuldade." }),
  topics: z
    .array(z.string())
    .nonempty({ message: "Selecione ao menos um tópico." }),
  options: z
    .array(optionSchema)
    .length(3, { message: "A quest deve ter exatamente 3 opções." }),
  correctOptionIndex: z.coerce
    .number({ invalid_type_error: "Você deve selecionar uma opção correta." })
    .min(0, "Você deve selecionar uma opção correta."),
});

export type QuestEditFormInputs = z.infer<typeof questEditSchema>;