"use client";

import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { getUserData } from "@/services/api/tokenManager";
import { UserData } from "@/types/authTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// Props para o card de perfil
interface UserProfileCardProps {
    user: UserData | null;
}

// Dados mocados para as quests
const quests = [
    { id: 1, title: "Quest: Fila de Prioridades" },
    { id: 2, title: "Quest: Complexidade Big O" },
    { id: 3, title: "Quest: Estruturas de Dados" },
    { id: 4, title: "Quest: Algoritmos de Busca" },
    { id: 5, title: "Quest: Algoritmos de Ordenação" },
    { id: 6, title: "Quest: Recursão" },
    { id: 7, title: "Quest: Programação Dinâmica" },
];

// Card para exibir o perfil do usuário
const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    const userName = user?.login || "Professor";
    const userRole = user?.role === "teacher" ? "Mestre" : "Aventureiro";
    const avatarSrc = user?.avatar || "/male_avatar.png";

    return (
        <div className="pixel-border-dark flex items-center gap-4 p-4">
            <div className="text-right">
                <p className="font-bold text-lg text-white">{userName}</p>
                <p className="text-sm text-[var(--color-yellow-shadow)]">{userRole}</p>
            </div>
            <div className="w-18 h-18 rounded-full pixel-border bg-gray-700 p-0 flex items-center justify-center">
                <Image
                    src={avatarSrc}
                    alt="Foto de Perfil"
                    width={64}
                    height={64}
                    className="object-cover"
                />
            </div>
        </div>
    );
};

export default function TeacherQuestsPage() {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const userData = getUserData();
        if (userData) {
            setUser(userData);
        } else {
            setUser({
                id: 1,
                login: "Professor",
                role: "teacher",
            });
        }
    }, []);

    return (
        <div className="flex min-h-screen max-w-screen bg-[#3d405b] text-white font-pixel">
            {/* Menu lateral */}
            <aside className="w-64 bg-[var(--color-brand-bg)] p-6 flex flex-col gap-4 pixel-border">
                <h2 className="text-3xl text-center text-brand-text mb-4">NOESIS</h2>
                <ButtonLink href="/teacher/quests" variant="green">
                    Minhas Quests
                </ButtonLink>
                <Button variant="green">Meus Clãs</Button>
                <Button variant="green">Ficha do Herói</Button>
                <Button variant="yellow">Planos</Button>
                <div className="mt-auto">
                    <Button variant="red">Sair do Jogo</Button>
                </div>
            </aside>

            {/* Conteúdo principal */}
            <main className="flex-1 p-8 flex flex-col">
                {/* Card de perfil do usuário */}
                <div className="w-full flex justify-end mb-8">
                    <UserProfileCard user={user} />
                </div>

                {/* Título e botão de criar nova quest */}
                <div className="w-full">
                    <div className="flex justify-between items-center mb-8 p-5">
                        <h1 className="text-4xl [text-shadow:3px_3px_0_var(--color-header-bg)]">Forja de Quests</h1>
                        <ButtonLink href="/teacher/quests/new" variant="green">
                            Criar Nova Quest
                        </ButtonLink>
                    </div>

                    {/* Lista de quests */}
                    <div className="bg-opacity-40 pixel-border p-6 space-y-4 bg-gray-800 max-h-106 overflow-y-auto">
                        {quests.map((quest) => (
                            <div
                                key={quest.id}
                                className="flex items-center justify-between pixel-border"
                            >
                                <h3 className="text-xl">{quest.title}</h3>
                                <ButtonLink
                                    href={`/teacher/quests/edit/${quest.id}`}
                                    variant="green"
                                    className="!py-2 !px-4 !text-sm"
                                >
                                    Editar
                                </ButtonLink>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
