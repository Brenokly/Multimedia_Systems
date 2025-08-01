"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import toast from "react-hot-toast";
import {AxiosError} from "axios";

import Button from "@/components/ui/Button";
import {Input} from "@/components/ui/Input";
import {joinClan} from "@/services/clanService";

// Validação para o código do clã
const joinSchema = z.object({
  joinCode: z.string().min(1, {message: "O código é obrigatório."}),
});

type JoinFormInputs = z.infer<typeof joinSchema>;

interface JoinClanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClanJoined: () => void;
}

export const JoinClanModal = ({isOpen, onClose, onClanJoined}: JoinClanModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<JoinFormInputs>({
    resolver: zodResolver(joinSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: JoinFormInputs) => {
    setIsLoading(true);
    try {
      await joinClan(data.joinCode.toUpperCase());
      toast.success("Você entrou no clã com sucesso!");
      onClanJoined();
      handleClose();
    } catch (error) {
      let errorMessage = "Não foi possível entrar no clã. Verifique o código.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.detail || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{backgroundColor: 'rgba(0, 0, 0, 0.9)'}}
    >
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 pixel-border space-y-4 rounded"
          style={{backgroundColor: "#252637"}}
        >
          <h2 className="text-2xl text-white text-center mb-6 [text-shadow:2px_2px_0_#000]">
            Juntar-se a um Clã
          </h2>
          <Input
            label="Insira o código secreto do Clã fornecido pelo seu Mestre:"
            type="text"
            registration={register("joinCode")}
            error={errors.joinCode?.message}
            placeholder="Ex: ALFA-123"
            disabled={isLoading}
            className="text-center"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
            }}
          />
          <div className="flex justify-between gap-4 !mt-8">
            <Button type="button" variant="danger" onClick={handleClose} disabled={isLoading} className="w-1/2">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="w-1/2">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};