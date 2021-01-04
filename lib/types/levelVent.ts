import { SystemType } from "./enums";
import { Vector2 } from "./vector2";

export type LevelVent = Readonly<{
  id: Readonly<number>;
  name: Readonly<string>;
  system: Readonly<SystemType>;
  position: Readonly<Vector2>;
}>;
