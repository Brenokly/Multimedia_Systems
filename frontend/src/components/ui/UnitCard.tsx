import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { UnitDto } from "@/types/clanTypes";
import { QuestionDto } from "@/types/questTypes";

interface UnitCardProps {
  unit: UnitDto;
  questions: QuestionDto[];
  onRemoveUnit: (unitId: number) => void;
}

export const UnitCard =
  ({ unit, questions, onRemoveUnit }: UnitCardProps) => {
  return (
    <div className="p-4 rounded space-y-3" style={{ backgroundColor: "#1C1C29" }}>
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-center border-b-2 border-gray-600 pb-2 mb-3">
        <h3 className="text-xl text-white">{unit.name}</h3>
        <div className="flex gap-2">
          <ButtonLink
            href={`/teacher/quests/new?unitId=${unit.id}`} // Passa o ID da unidade para a página de criação
            variant="secondary"
            className="!text-xs !py-1 !px-3"
          >
            + Adicionar Quest
          </ButtonLink>
          <Button
            onClick={() => onRemoveUnit(unit.id)}
            variant="danger"
            className="!text-xs !py-1 !px-3"
          >
            Remover Unidade
          </Button>
        </div>
      </div>

      {/* Lista de Quests */}
      <div className="space-y-2 pl-2">
        {questions.length > 0 ? (
          questions.map(q => (
            <p key={q.id} className="text-gray-300">
              - {q.statement}
            </p>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma quest nesta unidade ainda.</p>
        )}
      </div>
    </div>
  );
};