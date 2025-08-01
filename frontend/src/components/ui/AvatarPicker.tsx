"use client";

import { getAllAvatars } from "@/services/avatarService";
import Image from "next/image";

interface AvatarPickerProps {
  selectedValue: number | undefined;
  onSelect: (id: number) => void;
  disabled?: boolean;
}

/**
 * Um seletor de avatares visual que permite ao usuário escolher uma imagem de perfil
 * a partir de uma lista predefinida.
 *
 * @param selectedValue O ID do avatar atualmente selecionado.
 * @param onSelect Função de callback executada quando um avatar é selecionado.
 * @param disabled Desabilita a interação com o componente.
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedValue,
  onSelect,
  disabled = false,
}) => {
  const avatars = getAllAvatars();

  return (
    <div>
      <label className="block mb-2 text-sm text-text-primary">
        Escolha seu Avatar
      </label>
      <div className="grid grid-cols-5 gap-3 p-3 bg-[#252637]">
        {avatars.map((avatar) => (
          <button
            type="button"
            key={avatar.id}
            onClick={() => !disabled && onSelect(avatar.id)}
            disabled={disabled}
            className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#252637] focus:ring-yellow-400 ${
              selectedValue === avatar.id
                ? "border-4 border-yellow-400 scale-110"
                : "border-2 border-transparent hover:border-yellow-300"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <Image
              src={avatar.path}
              alt={`Avatar ${avatar.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 10vw, (max-width: 1200px) 5vw, 64px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
