"use client";

import { saveAuthData } from "@/services/api/tokenManager";
import { loginUserService } from "@/services/authService";
import { LoginFormInputs, loginSchema } from "@/validators/authValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const response = await loginUserService(data);
      saveAuthData(response);
      toast.success("Login bem-sucedido! Bem-vindo, herói!");
      router.push("/app/quests");
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Login ou senha inválidos. Tente novamente.";
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
          success: {
            style: {
              backgroundColor: "#c8e6c9",
            },
          },
          error: {
            style: {
              backgroundColor: "#ffcdd2",
            },
          },
        }}
      />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 pixel-border">
          <h1 className="text-2xl text-center mb-6">Login do Herói</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Login"
              type="text"
              registration={register("login")}
              error={errors.login?.message}
              placeholder="Seu nome de guerra"
              disabled={isLoading}
            />
            <div className="mb-6">
              <Input
                label="Senha"
                type="password"
                registration={register("password")}
                error={errors.password?.message}
                placeholder="Sua chave secreta"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Confirmar"}
            </Button>
            <p className="text-center text-sm mt-6">
              Primeira vez?{" "}
              <Link href="/signup" className="text-btn-blue hover:underline">
                Crie um Personagem
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
