// --- Enums ---
export type CardTheme = "ED1" | "ED2" | "REDES";
export type CardType = "ANSWER" | "CHALLENGE";

// --- Domain Entities ---
export interface Card {
  id: number;
  title: string;
  description: string;
  theme: CardTheme;
  cardType: CardType;
}
