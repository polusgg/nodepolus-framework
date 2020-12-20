import { GameOverReason } from "../../types/enums";

export type GameEvents = {
  ended: GameOverReason;
};
