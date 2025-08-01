import { ReactNode } from "react";
import { ClanDto } from "@/types/clanTypes";

interface ClanItemProps {
  clan: ClanDto;
  action?: ReactNode;
}

const ClanItem = ({ clan, action }: ClanItemProps) => (
  <div
    className="p-4 flex justify-between items-center rounded"
    style={{ backgroundColor: "#1C1C29" }}
  >
    <div>
      <p className="text-white text-lg">{clan.name}</p>
      <p className="text-yellow-300 text-sm mt-1 font-mono">Código: {clan.joinCode}</p>
    </div>
    {action}
  </div>
);

export default ClanItem;