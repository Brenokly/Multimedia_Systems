"use client";
import { clearAuthData } from "@/services/api/tokenManager";
import { UserData } from "@/types/authTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Sidebar({ user }: { user: UserData }) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthData();
    router.push("/login");
  };

  const btnPixel = `
    block py-[12px] px-[24px] uppercase text-lx text-[var(--btn-text)]
    bg-[var(--btn-bg)] border-4 border-[var(--border-shadow)]
    shadow-[inset_-4px_-4px_0_0_var(--btn-shadow)]
    [text-shadow:2px_2px_0_#00000050]
    text-center cursor-pointer transition-all duration-100 ease-in-out
    hover:bg-[#66bb6a] active:shadow-[inset_4px_4px_0_0_var(--btn-shadow)]
    active:translate-y-0.5
  `;

  return (
    <aside className="w-72 bg-orange-100 flex-shrink-0 flex flex-col p-4 border-4 border-[var(--border-shadow)] shadow-[inset_-4px_-4px_0_0_var(--border-shadow),inset_4px_4px_0_0_var(--border-highlight)] text-[var(--text-color)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl">NOESIS</h1>
      </div>

      <nav className="flex-grow space-y-4">
        {user.role === "STUDENT" && (
          <ul className="space-y-4">
            <li>
              <Link href="/student" className={btnPixel}>
                Quests Globais
              </Link>
            </li>
            <li>
              <Link href="/student/clans" className={btnPixel}>
                Meus Clãs
              </Link>
            </li>
            <li>
              <Link href="/student/hero-sheet" className={btnPixel}>
                Ficha do Herói
              </Link>
            </li>
            <li>
              <Link
                href="/student/plans"
                className={btnPixel}
                style={{
                  backgroundColor: "#fdd835",
                  color: "#5d4037",
                  boxShadow: "inset -4px -4px 0px 0px #fbc02d",
                }}
              >
                Planos
              </Link>
            </li>
          </ul>
        )}

        {user.role === "TEACHER" && (
          <ul className="space-y-4">
            <li>
              <Link href="/teacher/quests" className={btnPixel}>
                Minhas Quests
              </Link>
            </li>
            <li>
              <Link href="/teacher/clans" className={btnPixel}>
                Meus Clãs
              </Link>
            </li>
            <li>
              <Link href="/teacher/hero-sheet" className={btnPixel}>
                Ficha do Herói
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/plans"
                className={btnPixel}
                style={{
                  backgroundColor: "#fdd835",
                  color: "#5d4037",
                  boxShadow: "inset -4px -4px 0px 0px #fbc02d",
                }}
              >
                Planos
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className={btnPixel}
          style={{
            backgroundColor: "#d32f2f",
            boxShadow: "inset -4px -4px 0px 0px #c62828",
          }}
        >
          Sair do Jogo
        </button>
      </div>
    </aside>
  );
}
