"use client";

import ButtonLink from "@/components/ui/ButtonLink";
import VideoPlayer from "@/components/ui/VideoPlayer";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main>
      <section
        id="home"
        className="w-full min-h-screen flex flex-col items-center justify-center text-center p-4"
      >
        <h1 className="text-6xl md:text-8xl [text-shadow:4px_4px_0_#000]">
          NOESIS
        </h1>
        <h2 className="mt-4 text-xl md:text-2xl text-yellow-300 [text-shadow:2px_2px_0_#000]">
          A JORNADA DO CONHECIMENTO!
        </h2>
        <p className="max-w-2xl mt-8 text-base leading-relaxed">
          Forje seu intelecto em batalhas épicas de lógica! Aqui, cada desafio é
          uma quest, e cada resposta correta, uma vitória.
        </p>
        <div className="mt-8">
          <ButtonLink href="/signup" variant="primary" size="lg">
            Comece sua Aventura
          </ButtonLink>
        </div>
      </section>

      {/* SEÇÃO SOBRE */}
      <section id="sobre" className="w-full py-20 px-4 bg-pixelSection1">
        <div className="container mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl text-yellow-300 mb-6 [text-shadow:2px_2px_0_#000]">
              O que é a Noesis?
            </h2>
            <p className="text-base leading-relaxed">
              Noesis é um reino de aprendizado onde os conceitos da Ciência da
              Computação são os desafios a serem vencidos. Em vez de livros e
              aulas tediosas, aqui você enfrenta quests, usa cartas com soluções
              e aprende na prática, de forma divertida e gamificada.
            </p>
          </div>
          <div className="h-[600px] w-[600px] pixel-border pixel-border-filled p-0">
            <Image
              src="/MundoNoesis.png"
              width={600}
              height={600}
              alt="Mundo de Noesis"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* SEÇÃO COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="w-full py-20 px-4 bg-pixelSection2"
      >
        <div className="container mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div className="order-2 md:order-1 h-[400px]">
            <VideoPlayer videoId="JSfuFlhsxZY" />
          </div>
          <div className="text-center md:text-left order-1 md:order-2">
            <h2 className="text-3xl text-yellow-300 mb-6 [text-shadow:2px_2px_0_#000]">
              Como Funciona?
            </h2>
            <ul className="text-left space-y-4 text-base">
              <li>
                {">"} <span className="text-yellow-300">Aventureiros</span>{" "}
                exploram quests globais e se juntam a clãs para aprender.
              </li>
              <li>
                {">"} <span className="text-yellow-300">Mestres</span>{" "}
                (professores) criam clãs, forjam quests e guiam seus alunos.
              </li>
              <li>
                {">"} <span className="text-yellow-300">O Desafio:</span>{" "}
                Escolha a carta com a solução correta para vencer e ganhar XP!
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contato"
        className="w-full py-12 px-4 text-center bg-pixelFooter"
      >
        <p>NOESIS (c) 2025 - Forjado com Código e Magia</p>
        <p className="text-xs mt-4">Entre em contato: contato@noesis.com</p>
      </footer>
    </main>
  );
}
