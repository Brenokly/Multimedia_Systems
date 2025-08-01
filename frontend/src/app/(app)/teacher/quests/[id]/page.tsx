"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import toast, {Toaster} from "react-hot-toast";
import {AxiosError} from "axios";

import Button from "@/components/ui/Button";
import {Input} from "@/components/ui/Input";
import {PixelCombobox} from "@/components/ui/PixelCombobox";
import {getQuestById, updateQuest} from "@/services/questService";
import {difficultyLevels, QuestionRequest, subjects} from "@/types/questTypes";
import {QuestFormInputs, questSchema} from "@/validators/questFormValidator";

/**
 * Página para Mestres (professores) editarem suas Quests.
 */
export default function EditQuestPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const placeholderItem = {id: "", label: "Selecione..."};

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {errors},
  } = useForm<QuestFormInputs>({
    resolver: zodResolver(questSchema),
    defaultValues: {
      options: [
        {assertion: "", feedback: ""},
        {assertion: "", feedback: ""},
        {assertion: "", feedback: ""},
      ],
      topics: [],
    },
  });

  const {fields} = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (!questId) return;

    const fetchQuestData = async () => {
      try {
        const questData = await getQuestById(Number(questId));
        const correctIndex = questData.options.findIndex(opt => opt.correct);

        reset({
          statement: questData.statement,
          level: questData.level,
          topics: questData.topics,
          options: questData.options.map(opt => ({
            assertion: opt.assertion,
            feedback: opt.feedback || "",
          })),
          correctOptionIndex: correctIndex !== -1 ? correctIndex : undefined,
        });
      } catch (error) {
        console.error("Falha ao carregar dados da quest:", error);
        toast.error("Falha ao carregar os dados da quest.");
        router.push("/teacher/quests");
      } finally {
        setIsFetching(false);
      }
    };

    fetchQuestData();
  }, [questId, reset, router]);

  const onSubmit = async (data: QuestFormInputs) => {
    setIsLoading(true);

    const payload: QuestionRequest = {
      statement: data.statement,
      level: data.level,
      topics: data.topics,
      options: data.options.map((opt, index) => ({
        assertion: opt.assertion,
        feedback: opt.feedback,
        correct: index === data.correctOptionIndex,
      })),
    };

    try {
      await updateQuest(Number(questId), payload);
      toast.success("Quest atualizada com sucesso!");
      setTimeout(() => {
        router.push("/teacher/quests");
      }, 1500);
    } catch (error) {
      let errorMessage = "Erro ao atualizar a quest.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.detail || errorMessage;
      }
      console.error("Erro ao atualizar quest:", error);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-white text-xl">Carregando Forja...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{
        className: "font-pixel",
        style: {border: "4px solid #5d4037", padding: "16px", color: "#5d4037"},
        success: {style: {backgroundColor: "#c8e6c9"}},
        error: {style: {backgroundColor: "#ffcdd2"}}
      }}/>
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl text-white text-center mb-8 [text-shadow:3px_3px_0_var(--color-header-bg)]">
          Editar Quest
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pixel-border space-y-6 rounded"
              style={{backgroundColor: "#252637"}}>
          <div>
            <label className="block mb-2 text-lg text-white">Enunciado da Quest</label>
            <textarea {...register("statement")}
                      className="w-full border-4 bg-[#fffaf0] p-2.5 text-pixelText border-pixelBorder
                      focus:bg-white focus:outline-none min-h-[120px] placeholder:text-gray-500"
                      placeholder="Descreva o problema ou a pergunta..."
                      disabled={isLoading}/>
            {errors.statement && <p className="mt-1 text-sm text-red-500">{errors.statement.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller name="level" control={control} render={({field}) => (
              <div>
                <label className="block mb-2 text-lg text-white">Nível (Dificuldade)</label>
                <PixelCombobox items={difficultyLevels}
                               value={difficultyLevels.find(
                                 (d) => d.id === field.value) || placeholderItem}
                               onChange={(item) => field.onChange(item.id)} className="w-full"/>
                {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level.message}</p>}
              </div>
            )}/>
            <Controller name="topics" control={control} render={({field}) => (
              <div>
                <label className="block mb-2 text-lg text-white">Tópico (Assunto)</label>
                <PixelCombobox items={subjects} value={subjects.find(
                  (s) => s.id === field.value[0]) || placeholderItem}
                               onChange={(item) => field.onChange([item.id])} className="w-full"/>
                {errors.topics && <p className="mt-1 text-sm text-red-500">{errors.topics.message}</p>}
              </div>
            )}/>
          </div>

          <div>
            <h2 className="text-2xl text-white mt-6 mb-4 [text-shadow:2px_2px_0_#000]">Opções de Resposta</h2>
            <div className="space-y-5">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-4 p-4 pixel-border-dark">
                  <input type="radio" {...register("correctOptionIndex")} value={index}
                         className="form-radio h-6 w-6 mt-9 shrink-0"/>
                  <div className="flex-grow space-y-2 text-white">
                    <Input
                      label={`Opção ${index + 1}`}
                      type="text"
                      registration={register(`options.${index}.assertion`)}
                      error={errors.options?.[index]?.assertion?.message}
                      placeholder="Texto da alternativa (assertion)"
                      disabled={isLoading}
                    />
                    <Input
                      label="Feedback"
                      type="text"
                      registration={register(`options.${index}.feedback`)}
                      error={errors.options?.[index]?.feedback?.message}
                      placeholder="Mensagem de feedback para esta opção" disabled={isLoading}
                    />
                  </div>
                </div>
              ))}
              {errors.correctOptionIndex &&
                  <p className="mt-1 text-sm text-red-500">{errors.correctOptionIndex.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 !mt-8 border-t-4 border-pixelBorder pt-6">
            <Button type="button" variant="danger" onClick={() => router.push("/teacher/quests")}
                    disabled={isLoading}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
