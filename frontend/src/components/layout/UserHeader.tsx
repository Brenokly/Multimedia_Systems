import { getAvatarById } from "@/services/avatarService"; // Importa o serviço de avatar
import { UserData } from "@/types/authTypes";

/**
 * Componente de cabeçalho que exibe as informações do usuário logado,
 * incluindo seu nome, classe e o avatar selecionado.
 *
 * @param user Os dados do usuário autenticado.
 */
export function UserHeader({ user }: { user: UserData }) {
  // Mapeia a 'role' do backend para um nome de classe amigável
  const userClass = user.role === "TEACHER" ? "Mestre" : "Aventureiro";

  // Obtém o caminho da imagem do avatar com base no ID do usuário
  const avatarUrl = getAvatarById(user.avatarId);

  return (
    <header className="flex justify-end items-center">
      <div
        className="flex items-center space-x-4 p-4 pixel-border bg-opacity-25"
        style={{ backgroundColor: "#252637" }}
      >
        <div className="text-right">
          <span className="font-semibold text-white">{user.name}</span>
          <p className="text-sm text-yellow-300">{userClass}</p>
        </div>
        <div
          className="w-16 h-16 pixel-border bg-gray-600 bg-cover bg-center"
          style={{
            backgroundImage: `url("${avatarUrl}")`,
          }}
        ></div>
      </div>
    </header>
  );
}
