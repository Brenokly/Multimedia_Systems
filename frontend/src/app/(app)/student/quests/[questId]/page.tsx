"use client";

import Button from "@/components/ui/Button";
import { getUserData } from "@/services/api/tokenManager";
import { getQuestById } from "@/services/questService";
import { OptionDto, QuestionDto } from "@/types/questTypes";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

// --- Definições de Tipo para a biblioteca canvas-confetti ---

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { y: number; x?: number };
}

interface ConfettiFunction {
  (options?: ConfettiOptions): void;
  create(
    canvas: HTMLCanvasElement,
    options?: {
      resize?: boolean;
      useWorker?: boolean;
    }
  ): ConfettiFunction;
}

declare global {
  interface Window {
    confetti?: ConfettiFunction;
  }
}

// --- Componentes de Efeitos ---

const VictoryAnimation = () => {
  useEffect(() => {
    const canvas = document.getElementById(
      "confetti-canvas"
    ) as HTMLCanvasElement;
    if (canvas && window.confetti) {
      const confetti = window.confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(
        () =>
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5, x: 0.2 },
          }),
        200
      );
      setTimeout(
        () =>
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5, x: 0.8 },
          }),
        400
      );
    }
  }, []);

  return (
    <canvas
      id="confetti-canvas"
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

// --- Componentes da UI ---

const OptionCard = ({
  option,
  onSelect,
  disabled,
  isSelected,
}: {
  option: OptionDto;
  onSelect: () => void;
  disabled: boolean;
  isSelected: boolean;
}) => {
  const baseStyle =
    "p-6 text-center cursor-pointer transition-all duration-200 border-8";
  const selectedStyle = isSelected
    ? "bg-[#D2B48C] border-[#a0522d] text-[#5d4037] transform -translate-y-[5px] scale-[1.02] shadow-[0_0_20px_5px_#ffde7a]"
    : "bg-[#D2B48C] border-[#8b4513] text-[#5d4037] hover:scale-105 hover:shadow-md";

  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      className={`${baseStyle} ${selectedStyle}`}
    >
      <h3 className="text-lg">{option.assertion}</h3>
    </div>
  );
};

const FeedbackSection = ({
  feedback,
  onNext,
}: {
  feedback: { correct: boolean; text: string };
  onNext: () => void;
}) => {
  const isCorrect = feedback.correct;
  const baseStyle = "mt-10 max-w-3xl mx-auto p-6 pixel-border text-center";
  const feedbackStyle = isCorrect
    ? "bg-[#c8e6c9] text-[#2e7d32]"
    : "bg-[#ffcdd2] text-[#c62828]";

  return (
    <div className={`${baseStyle} ${feedbackStyle}`}>
      <h4 className="text-xl mb-4">{isCorrect ? "VITÓRIA!" : "DERROTA..."}</h4>
      <p className="leading-relaxed">{feedback.text}</p>
      <div className="text-center mt-6">
        <Button onClick={onNext} variant="primary">
          Voltar ao Mapa
        </Button>
      </div>
    </div>
  );
};

export default function QuestChallengePage() {
  const router = useRouter();
  const params = useParams();
  const questId = Number(params.questId);

  const [quest, setQuest] = useState<QuestionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<OptionDto | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState<
    "correct" | "incorrect" | null
  >(null);

  useEffect(() => {
    const userData = getUserData();
    if (!userData || String(userData.role).toUpperCase() !== "STUDENT") {
      router.push("/login");
      return;
    }

    if (questId) {
      const fetchQuest = async () => {
        try {
          const data = await getQuestById(questId);
          setQuest(data);
        } catch (error) {
          console.error("Falha ao buscar a quest:", error);
          router.push("/student/dashboard");
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuest();
    }
  }, [questId, router]);

  const handleOptionSelect = (option: OptionDto) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setSelectedOption(option);
    setAnswerResult(option.correct ? "correct" : "incorrect");
    // TODO: Adicionar chamada ao serviço para submeter a resposta (Answer) ao backend
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-white text-xl">
        A carregar desafio...
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="flex w-full h-full items-center justify-center text-white text-xl">
        Quest não encontrada.
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
        strategy="lazyOnload"
      />

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      <div
        className={`w-full flex flex-col items-center ${
          answerResult === "incorrect" ? "animate-shake" : ""
        }`}
      >
        {answerResult === "correct" && <VictoryAnimation />}

        {/* Botão de Voltar adicionado aqui */}
        <div className="w-full max-w-[1560px] flex justify-start mb-4">
          <Button onClick={() => router.back()} variant="secondary">
            &lt; Voltar
          </Button>
        </div>

        <div
          className="w-full max-w-[1560px] h-auto md:h-[450px] p-8 pixel-border bg-yellow-100 text-gray-800 flex flex-col justify-between"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/crissxcross.png')",
          }}
        >
          <div className="text-center">
            <h2 className="text-2xl mb-2">Nova Quest!</h2>
            <p className="text-lg mb-8">Um desafio aparece no seu caminho...</p>
          </div>

          <div className="text-center my-4 p-4 bg-black/10 rounded border-2 border-stone-400">
            <p className="text-xl leading-relaxed">{quest.statement}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto">
            {quest.options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                onSelect={() => handleOptionSelect(option)}
                disabled={hasAnswered}
                isSelected={selectedOption?.id === option.id}
              />
            ))}
          </div>
        </div>

        {hasAnswered && selectedOption && (
          <FeedbackSection
            feedback={{
              correct: selectedOption.correct,
              text:
                selectedOption.feedback ||
                (selectedOption.correct
                  ? "Resposta correta!"
                  : "Resposta incorreta."),
            }}
            onNext={() => router.back()}
          />
        )}
      </div>
    </>
  );
}
