import { PlayerColor, PlayerHat, PlayerPet, PlayerRole, PlayerSkin } from "../../types/enums";
import { DisconnectReason, LevelTask, LevelVent, Vector2 } from "../../types";
import { TextComponent } from "../text";

export interface PlayerInstance {
  getId(): number;

  getName(): TextComponent;

  setName(name: TextComponent | string): this;

  getColor(): PlayerColor;

  setColor(color: PlayerColor): this;

  getHat(): PlayerHat;

  setHat(hat: PlayerHat): this;

  getPet(): PlayerPet;

  setPet(pet: PlayerPet): this;

  getSkin(): PlayerSkin;

  setSkin(skin: PlayerSkin): this;

  getRole(): PlayerRole;

  isImpostor(): boolean;

  setImpostor(): void;

  setCrewmate(): void;

  isDead(): boolean;

  getTasks(): [LevelTask, boolean][];

  setTasks(tasks: Set<LevelTask>): this;

  addTasks(tasks: Set<LevelTask>): void;

  removeTasks(tasks: Set<LevelTask>): void;

  isTaskAtIndexCompleted(taskIndex: number): boolean;

  isTaskCompleted(task: LevelTask): boolean;

  completeTaskAtIndex(taskIndex: number): this;

  completeTask(task: LevelTask): this;

  uncompleteTaskAtIndex(taskIndex: number): void;

  uncompleteTask(task: LevelTask): void;

  getPosition(): Vector2;

  setPosition(position: Vector2): this;

  getVelocity(): Vector2;

  getVent(): LevelVent | undefined;

  enterVent(vent: LevelVent): this;

  exitVent(vent: LevelVent): this;

  isScanning(): boolean;

  kill(): this;

  murder(player: PlayerInstance): this;

  revive(): void;

  sendChat(message: string): this;

  startMeeting(victim?: PlayerInstance): this;

  castVote(suspect?: PlayerInstance): this;

  clearVote(): this;

  castVotekick(target: PlayerInstance): this;

  clearVotekick(target: PlayerInstance): this;

  clearVotekicksForMe(): this;

  clearVotekicksFromMe(): this;

  kick(reason: DisconnectReason | undefined): this;

  ban(reason: DisconnectReason | undefined): this;
}
