import { SystemType } from "./enums";
import { Vector2 } from "./vector2";

/**
 * A type used to store static data for vents in a level.
 */
export type LevelVent = Readonly<{
  id: Readonly<number>;
  name: Readonly<string>;
  system: Readonly<SystemType>;
  position: Readonly<Vector2>;
}>;
