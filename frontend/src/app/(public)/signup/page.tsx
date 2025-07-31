"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import { signupUserService } from "@/services/authService";
import { UserCreateRequest } from "@/types/userTypes";
import { SignupFormInputs, signupSchema } from "@/validators/authValidators";

import { AvatarPicker } from "@/components/ui/AvatarPicker";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      avatarId: undefined,
    },
  });

  const onSubmit = async (data: SignupFormInputs) => {
    setIsLoading(true);
    try {
      const payload: UserCreateRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        avatarId: data.avatarId,
        role: data.role,
      };
      await signupUserService(payload);

      toast.success(
        "Personagem criado! Faça o login para iniciar sua jornada."
      );
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Erro ao criar personagem. O nome de usuário já pode estar em uso.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "font-pixel",
          style: {
            border: "4px solid #5d4037",
            padding: "16px",
            color: "#5d4037",
          },
          success: { style: { backgroundColor: "#c8e6c9" } },
          error: { style: { backgroundColor: "#ffcdd2" } },
        }}
      />
      <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-background-primary">
        <div className="w-full max-w-lg p-8 pixel-border bg-paper-primary">
          <h1 className="text-2xl text-center mb-6 text-text-primary">
            Criação de Personagem
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={control}
              name="avatarId"
              render={({ field }) => (
                <AvatarPicker
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
            {errors.avatarId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.avatarId.message}
              </p>
            )}

            <Input
              label="Seu Nome"
              type="text"
              registration={register("name")}
              error={errors.name?.message}
              placeholder="O nome do seu Herói"
              disabled={isLoading}
            />
            <Input
              label="Seu email"
              type="text"
              registration={register("email")}
              error={errors.email?.message}
              placeholder="Seu email"
              disabled={isLoading}
            />
            <Input
              label="Sua Senha"
              type="password"
              registration={register("password")}
              error={errors.password?.message}
              placeholder="Mínimo de 8 caracteres"
              disabled={isLoading}
            />
            <Input
              label="Confirme sua Senha"
              type="password"
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              placeholder="Repita a senha"
              disabled={isLoading}
            />

            <div>
              <label className="block mb-2 text-sm text-text-primary">
                Sua Classe
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="STUDENT"
                    {...register("role")}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  Aventureiro (Aluno)
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="TEACHER"
                    {...register("role")}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  Mestre (Professor)
                </label>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full !mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Forjando Herói..." : "Iniciar Jornada"}
            </Button>

            <p className="text-center text-sm mt-6 text-text-primary">
              Já tem conta?{" "}
              <Link href="/login" className="text-blue-700 hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
