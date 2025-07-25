import { ReactNode } from "react";

type Quest = {
  id: string | number;
  title: string;
};

interface QuestItemProps {
  quest: Quest;
  action?: ReactNode;
}

const QuestItem = ({ quest, action }: QuestItemProps) => (
  <div
    className="p-2 flex justify-between items-center rounded"
    style={{ backgroundColor: "#1C1C29" }}
  >
    <p className="text-white">{quest.title}</p>

    {action}
  </div>
);

export default QuestItem;
