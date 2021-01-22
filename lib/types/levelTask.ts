import { TaskLength, TaskType } from "./enums";

/**
 * A type used to store static data for tasks in a level.
 */
export type LevelTask = Readonly<{
  /**
   * The id of the task.
   */
  id: Readonly<number>;
  /**
   * The display name of the task.
   */
  name: Readonly<string>;
  /**
   * The length of the task.
   */
  length: Readonly<TaskLength>;
  /**
   * Whether or not the task can play animations.
   */
  isVisual: Readonly<boolean>;
  /**
   * The type of the task.
   */
  type: Readonly<TaskType>;
}>;
