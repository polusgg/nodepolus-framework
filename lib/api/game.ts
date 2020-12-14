import Emittery from "emittery";

export type GameEvents = {
  ended: never;
};

export class Game extends Emittery.Typed<GameEvents> {}
