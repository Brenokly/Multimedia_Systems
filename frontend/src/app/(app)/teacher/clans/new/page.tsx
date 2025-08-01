"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import toast, {Toaster} from "react-hot-toast";
import {AxiosError} from "axios";

import Button from "@/components/ui/Button";
import {Input} from "@/components/ui/Input";
import {createClan} from "@/services/clanService";
import {ClanRequest} from "@/types/clanTypes";
import {ClanFormInputs, clanSchema} from "@/validators/clanFormValidator";

/**
 * Página para um professor (Mestre) criar (fundar) um novo Clã.
 */
export default function NewClanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClanFormInputs>({
    resolver: zodResolver(clanSchema),
  });

  const onSubmit = async (data: ClanFormInputs) => {
    setIsLoading(true);

    const payload: ClanRequest = {
      name: data.name,
      joinCode: data.joinCode,
    };

    try {
      await createClan(payload);
      toast.success("Clã fundado com sucesso!");
      setTimeout(() => {
        router.push("/teacher/clans");
      }, 1500);
    } catch (error) {
      let errorMessage = "Erro ao fundar o clã. O código já pode estar em uso.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.detail || errorMessage;
      }
      console.error("Erro ao criar clã:", error);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "font-pixel",
          style: { border: "4px solid #5d4037", padding: "16px", color: "#5d4037" },
          success: { style: { backgroundColor: "#c8e6c9" } },
          error: { style: { backgroundColor: "#ffcdd2" } },
        }}
      />
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl text-white text-center mb-8 [text-shadow:3px_3px_0_var(--color-header-bg)]">
          Fundar Novo Clã
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 pixel-border space-y-6 rounded"
          style={{ backgroundColor: "#252637" }}
        >
          <Input
            label="Nome do Clã"
            type="text"
            registration={register("name")}
            error={errors.name?.message}
            placeholder="Ex: Os Sábios da Masmorra"
            disabled={isLoading}
          />

          <Input
            label="Código do Clã"
            type="text"
            registration={register("joinCode")}
            error={errors.joinCode?.message}
            placeholder="Formato: AAAA-123"
            disabled={isLoading}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
            }}
          />

          <div className="flex justify-end gap-4 !mt-10">
            <Button
              type="button"
              variant="danger"
              onClick={() => router.push("/teacher/clans")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Fundando..." : "Fundar Clã"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}