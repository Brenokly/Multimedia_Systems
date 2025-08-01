import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import {ClanDto} from "@/types/clanTypes";

interface StudentClanItemProps {
  clan: ClanDto;
  onLeaveClan: (clanId: number) => void;
}

const StudentClanItem =
  ({clan, onLeaveClan}: StudentClanItemProps) => (
  <div
    className="p-4 flex flex-col sm:flex-row justify-between items-center rounded gap-4"
    style={{backgroundColor: "#1C1C29"}}
  >
    <div>
      <p className="text-white text-lg">{clan.name}</p>
      <p className="text-yellow-300 text-sm mt-1">
        Mestre: {clan.owner.name}
      </p>
    </div>
    <div className="flex gap-2">
      <ButtonLink
        href={`/student/clans/${clan.id}`}
        variant="secondary"
        className="!text-xs !py-2 !px-4"
      >
        VER QUESTS
      </ButtonLink>
      {clan.id != 1 ? <Button
        onClick={() => onLeaveClan(clan.id)}
        variant="danger"
        className="!text-xs !py-2 !px-4"
      >
        SAIR DO CLÃ
      </Button> : null}
    </div>
  </div>
);

export default StudentClanItem;