import { VentEnterEvent, VentExitEvent } from "../events/player";
import { GameOverReason } from "../../types/enums";

export type GameEvents = {
  ended: GameOverReason;
  ventEnter: VentEnterEvent;
  ventExit: VentExitEvent;
};
