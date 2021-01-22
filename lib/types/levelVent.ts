import { SystemType } from "./enums";
import { Vector2 } from "./vector2";

/**
 * A type used to store static data for vents in a level.
 */
export type LevelVent = Readonly<{
  /**
   * The ID of the vent.
   */
  id: Readonly<number>;
  /**
   * The display name of the vent.
   */
  name: Readonly<string>;
  /**
   * The system in which the vent is located.
   */
  system: Readonly<SystemType>;
  /**
   * The position of the vent.
   */
  position: Readonly<Vector2>;
}>;
