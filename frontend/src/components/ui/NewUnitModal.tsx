"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useState} from "react";
import toast from "react-hot-toast";
import {AxiosError} from "axios";

import {Input} from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {createUnit} from "@/services/clanService";
import {UnitRequest} from "@/types/clanTypes";

// Validação do formulário
const unitSchema = z.object({
  name: z
    .string()
    .min(3, {message: "O nome da unidade deve ter no mínimo 3 caracteres."})
    .max(50, {message: "O nome da unidade deve ter no máximo 50 caracteres."}),
});

type UnitFormInputs = z.infer<typeof unitSchema>;

interface NewUnitModalProps {
  isOpen: boolean;
  clanId: number;
  onClose: () => void;
  onUnitCreated: () => void;
}

export const NewUnitModal = ({isOpen, clanId, onClose, onUnitCreated}: NewUnitModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<UnitFormInputs>({
    resolver: zodResolver(unitSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: UnitFormInputs) => {
    setIsLoading(true);
    const payload: UnitRequest = {name: data.name};

    try {
      await createUnit(clanId, payload);
      toast.success("Unidade criada com sucesso!");
      onUnitCreated();
      handleClose();
    } catch (error) {
      let errorMessage = "Erro ao criar a unidade.";
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
            ADICIONAR NOVA UNIDADE
          </h2>

          <Input
            label="NOME DA UNIDADE"
            type="text"
            registration={register("name")}
            error={errors.name?.message}
            placeholder="Ex: Melhor Unidade"
            disabled={isLoading}
            className="text-center"
          />

          <div className="flex justify-between gap-4 !mt-8">
            <Button
              type="button"
              variant="danger"
              onClick={handleClose}
              disabled={isLoading}
              className="w-1/2"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="w-1/2">
              {isLoading ? "Criando..." : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};