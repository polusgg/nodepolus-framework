import { PlayerColor, PlayerHat, PlayerPet, PlayerSkin } from "../../types/enums";
import { TextComponent } from "../text";
import { LevelTask } from "../../types";

export interface PlayerInstance {
  getId(): number;

  getName(): TextComponent;

  getColor(): PlayerColor;

  getHat(): PlayerHat;

  getPet(): PlayerPet;

  getSkin(): PlayerSkin;

  isImpostor(): boolean;

  isDead(): boolean;

  getTasks(): [LevelTask, boolean][];

  setTasks(tasks: [LevelTask, boolean][]): this;

  addTasks(tasks: LevelTask[]): this;

  removeTasks(tasks: LevelTask[]): this;

  isTaskAtIndexCompleted(index: number): boolean;

  isTaskCompleted(task: LevelTask): boolean;

  completeTaskAtIndex(index: number, isComplete: boolean): boolean;

  completeTask(task: LevelTask, isComplete: boolean): boolean;

  isScanning(): boolean;

  setName(name: TextComponent | string): this;

  setColor(color: PlayerColor): this;

  setHat(hat: PlayerHat): this;

  setPet(pet: PlayerPet): this;

  setSkin(skin: PlayerSkin): this;

  kill(): this;

  murder(player: PlayerInstance): this;

  revive(): this;

  sendChat(message: string): this;

  startMeeting(victim?: PlayerInstance): this;
}
