"use client";
import ButtonLink from "./ButtonLink";

export function Sidebar() {
  const userRole = "student" as "student" | "teacher";

  return (
    <aside className="w-72 bg-orange-100 flex-shrink-0 flex flex-col p-4 pixel-border text-[var(--text-color)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl">NOESIS</h1>
      </div>

      <nav className="flex-grow space-y-4">
        {userRole === "student" && (
          <ul className="space-y-4">
            <li>
              <ButtonLink href="#" variant="primary" size="md">
                Quests Globais
              </ButtonLink>
            </li>
            <li>
              <ButtonLink href="#" variant="primary" size="md">
                Meus Clãs
              </ButtonLink>
            </li>
          </ul>
        )}

        {userRole === "teacher" && (
          <ul className="space-y-4">
            <li>
              <ButtonLink href="#" variant="primary" size="md">
                Minhas Quests
              </ButtonLink>
            </li>
            <li>
              <ButtonLink href="#" variant="primary" size="md">
                Meus Clãs
              </ButtonLink>
            </li>
          </ul>
        )}

        <ul className="mt-4 space-y-4">
          <li>
            <ButtonLink href="#" variant="primary" size="md">
              Ficha do Herói
            </ButtonLink>
          </li>
          <li>
            <ButtonLink
              href="#"
              variant="special"
              size="md"
              className="!bg-[#fdd835] !text-[#5d4037] !shadow-[inset_-4px_-4px_0px_0px_#fbc02d]"
            >
              Planos
            </ButtonLink>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <ButtonLink
          href="#"
          variant="danger"
          size="md"
          className="!bg-[#d32f2f] !shadow-[inset_-4px_-4px_0px_0px_#c62828]"
        >
          Sair do Jogo
        </ButtonLink>
      </div>
    </aside>
  );
}
