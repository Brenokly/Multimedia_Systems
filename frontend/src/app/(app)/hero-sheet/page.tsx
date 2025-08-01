"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

import {
  clearAuthData,
  getUserData,
  saveAuthData,
} from "@/services/api/tokenManager";
import { getAvatarById } from "@/services/avatarService";
import { updateUserPassword, updateUserProfile } from "@/services/userService";
import { UserData } from "@/types/authTypes";
import {
  PasswordFormInputs,
  passwordSchema,
  ProfileInfoFormInputs,
  profileInfoSchema,
} from "@/validators/profileValidators";

import { AvatarPicker } from "@/components/ui/AvatarPicker";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

// --- Componente Modal Genérico (Estilizado) ---
const Modal = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="p-8 pixel-border bg-[#d2b48c] text-[#5d4037] w-full max-w-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-4 text-2xl font-bold text-[#5d4037] hover:text-red-700"
      >
        &times;
      </button>
      <h3 className="text-xl text-center mb-6">{title}</h3>
      {children}
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<"info" | "password" | null>(
    null
  );

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    control: infoControl,
    reset: resetInfoForm,
    formState: { errors: infoErrors },
  } = useForm<ProfileInfoFormInputs>({
    resolver: zodResolver(profileInfoSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push("/login");
    } else {
      setUser(userData);
      resetInfoForm({ name: userData.name, avatarId: userData.avatarId });
      setIsLoading(false);
    }
  }, [router, resetInfoForm]);

  const onInfoSubmit = async (data: ProfileInfoFormInputs) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, data);
      const updatedUser = { ...user, ...data };
      saveAuthData({
        token: localStorage.getItem("jwt_token")!,
        user: updatedUser,
      });
      setUser(updatedUser);
      toast.success("Ficha salva com sucesso! A página será atualizada.");
      setActiveModal(null);
      // Recarrega a página após um breve intervalo para garantir que o utilizador veja o toast
      // e que todos os componentes (como o UserHeader) sejam re-renderizados com os novos dados.
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast.error("Falha ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormInputs) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateUserPassword(user.id, data);
      toast.success(
        "Palavra-passe alterada com sucesso! Por favor, faça login novamente.",
        { duration: 3000 }
      );
      resetPasswordForm();
      setActiveModal(null);
      // Desloga o utilizador por segurança após a alteração da palavra-passe.
      setTimeout(() => {
        clearAuthData();
        router.push("/login");
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        toast.error("A sua palavra-passe atual está incorreta.");
      } else {
        toast.error("Falha ao alterar a palavra-passe. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex w-full h-full items-center justify-center text-white text-xl">
        A carregar Ficha do Herói...
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="w-full">
        <h2
          className="text-3xl text-white mb-8"
          style={{ textShadow: "2px 2px 0 #000" }}
        >
          Ficha do Herói
        </h2>

        {/* Card Principal do Perfil */}
        <div className="p-8 pixel-border bg-[#252637] space-y-6 max-w-4xl mx-auto text-white">
          {/* Secção Superior: Avatar e Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <div className="w-32 h-32 pixel-border bg-gray-600 relative flex-shrink-0">
              <Image
                src={getAvatarById(user.avatarId)}
                alt="Avatar do utilizador"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-3xl text-yellow-300">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="mt-2 text-lg capitalize">
                {String(user.role).toLowerCase() === "teacher"
                  ? "Mestre"
                  : "Aventureiro"}
              </p>
            </div>
          </div>

          {/* Secção de Ações */}
          <div className="border-t-4 border-gray-600 pt-6 space-y-4">
            <h4 className="text-xl text-yellow-300 mb-2">Gerir Personagem</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ação de Editar Perfil */}
              <button
                onClick={() => setActiveModal("info")}
                className="p-4 pixel-border bg-black/30 hover:bg-black/50 text-left transition-colors"
              >
                <p className="font-bold text-base">Editar Nome e Avatar</p>
                <p className="text-sm text-gray-400">
                  Mude a sua alcunha e aparência no reino.
                </p>
              </button>
              {/* Ação de Alterar Palavra-passe */}
              <button
                onClick={() => setActiveModal("password")}
                className="p-4 pixel-border bg-black/30 hover:bg-black/50 text-left transition-colors"
              >
                <p className="font-bold text-base">Forjar Nova Palavra-passe</p>
                <p className="text-sm text-gray-400">
                  Reforce as suas defesas com uma nova chave secreta.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAIS --- */}
      {activeModal === "info" && (
        <Modal
          title="Editar Nome e Avatar"
          onClose={() => setActiveModal(null)}
        >
          <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="space-y-4">
            <Controller
              name="avatarId"
              control={infoControl}
              render={({ field }) => (
                <AvatarPicker
                  selectedValue={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
            {infoErrors.avatarId && (
              <p className="text-red-500 text-xs">
                {infoErrors.avatarId.message}
              </p>
            )}

            <Input
              label="Nome do Herói"
              registration={registerInfo("name")}
              error={infoErrors.name?.message}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "A salvar..." : "Salvar Ficha"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {activeModal === "password" && (
        <Modal
          title="Forjar Nova Palavra-passe"
          onClose={() => setActiveModal(null)}
        >
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <Input
              label="Palavra-passe Atual"
              type="password"
              registration={registerPassword("currentPassword")}
              error={passwordErrors.currentPassword?.message}
            />
            <Input
              label="Nova Palavra-passe"
              type="password"
              registration={registerPassword("newPassword")}
              error={passwordErrors.newPassword?.message}
            />
            <Input
              label="Confirmar Nova Palavra-passe"
              type="password"
              registration={registerPassword("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "A alterar..." : "Alterar Palavra-passe"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
