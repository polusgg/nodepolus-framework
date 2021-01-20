import { TaskLength, TaskType } from "./enums";

/**
 * A type used to store static data for tasks in a level.
 */
export type LevelTask = Readonly<{
  id: Readonly<number>;
  name: Readonly<string>;
  length: Readonly<TaskLength>;
  isVisual: Readonly<boolean>;
  type: Readonly<TaskType>;
}>;
