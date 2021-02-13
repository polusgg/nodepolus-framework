import { RepairAmount } from "../../protocol/packets/rpc/repairSystem/amounts";
import { BaseInnerShipStatus } from "../../protocol/entities/baseShipStatus";
import { GameOverReason, PlayerColor, SystemType } from "../../types/enums";
import { InnerPlayerControl } from "../../protocol/entities/player";
import { DisconnectReason, LevelTask } from "../../types";
import { Connection } from "../../protocol/connection";
import { PlayerInstance } from "../player";
import { LobbyInstance } from "../lobby";
import {
  AutoDoorsHandler,
  DecontaminationHandler,
  DoorsHandler,
  SabotageSystemHandler,
  SystemsHandler,
} from "../../host/systemHandlers";

/**
 * An interface describing the public API of the host controller for a LobbyInstance.
 */
export interface HostInstance {
  /**
   * Gets the lobby being controlled by the host.
   */
  getLobby(): LobbyInstance;

  /**
   * Gets the ID of the host.
   */
  getId(): number;

  /**
   * Gets the next available net ID.
   */
  getNextNetId(): number;

  /**
   * Gets the next available player ID.
   */
  getNextPlayerId(): number;

  /**
   * Begins the start-game countdown.
   *
   * @param count - The number of seconds until the game will start
   * @param starter - The player who started the countdown, or `undefined` if it was started va the API
   */
  startCountdown(count: number, starter?: PlayerInstance): void;

  /**
   * Stops the start-game countdown.
   */
  stopCountdown(): void;

  /**
   * Starts the game.
   */
  startGame(): void;

  /**
   * Sets the given number of players to Impostor.
   *
   * @param infectedCount - The number of players to be set to an Impostor
   */
  setInfected(infectedCount: number): void;

  /**
   * Assigns tasks to all players.
   */
  setTasks(): void;

  /**
   * Assigns the given player the given tasks.
   *
   * @param player - The player whose tasks are being assigned
   * @param tasks - The tasks being assigned to the player
   */
  setPlayerTasks(player: PlayerInstance, tasks: LevelTask[]): void;

  /**
   * Ends the current meeting.
   */
  endMeeting(): void;

  /**
   * Ends the game with the given reason.
   *
   * @param reason - The reason for why the game ended
   */
  endGame(reason: GameOverReason): void;

  /**
   * Gets the ShipStatus system controller.
   *
   * @returns The system controller, or `undefined` if the lobby is not in a game
   */
  getSystemsHandler(): SystemsHandler | undefined;

  /**
   * Gets the ShipStatus sabotage controller.
   *
   * @returns The sabotage controller, or `undefined` if the lobby is not in a game
   */
  getSabotageHandler(): SabotageSystemHandler | undefined;

  /**
   * Gets the ShipStatus door controller.
   *
   * @returns The door controller, or `undefined` if the lobby is not in a game
   */
  getDoorHandler(): DoorsHandler | AutoDoorsHandler | undefined;

  /**
   * Gets the ShipStatus decontamination controllers.
   */
  getDecontaminationHandlers(): DecontaminationHandler[];

  /**
   * Called when a connection sends a Ready GameData packet.
   *
   * @param sender - The connection that sent the packet
   */
  handleReady(sender: Connection): void;

  /**
   * Called when a connection sends a SceneChange GameData packet.
   *
   * @param sender - The connection that sent the packet
   * @param sceneName - The name of the scene that the connection changed to
   */
  handleSceneChange(sender: Connection, sceneName: string): Promise<void>;

  /**
   * Called when a connection sends a CheckName RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   * @param name - The name that the player is requesting to use
   */
  handleCheckName(sender: InnerPlayerControl, name: string): void;

  /**
   * Called when a connection sends a CheckColor RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   * @param color - The color that the player is requesting to use
   */
  handleCheckColor(sender: InnerPlayerControl, color: PlayerColor): void;

  /**
   * Called when a connection sends a SetColor RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   * @param color - The color that the player is requesting to use
   */
  handleSetColor(sender: InnerPlayerControl, color: PlayerColor): void;

  /**
   * Called when a connection sends a CompleteTask RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   * @param taskIndex - The index of the task that was completed from the player's task list
   */
  handleCompleteTask(sender: InnerPlayerControl, taskIndex: number): void;

  /**
   * Called when a connection sends a MurderPlayer RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   * @param victimPlayerControlNetId - The net ID of the PlayerControl for the player that was murdered
   */
  handleMurderPlayer(sender: InnerPlayerControl, victimPlayerControlNetId: number): void;

  /**
   * Called when an Impostor dies.
   */
  handleImpostorDeath(): void;

  /**
   * Called when a connection sends a ReportDeadBody RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   * @param victimPlayerId - The ID of the player whose body was found, or `undefined` if the player called an emergency meeting
   */
  handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId?: number): void;

  /**
   * Called when a connection sends a CastVote RPC packet.
   *
   * @param votingPlayerId - The ID of the player who cast the vote
   * @param suspectPlayerId - The ID of the player who is being voted to be exiled
   */
  handleCastVote(votingPlayerId: number, suspectPlayerId: number): void;

  /**
   * Called when a connection sends a RepairSystem RPC packet.
   *
   * @param sender - The ShipStatus that sent the packet
   * @param systemId - The ID of the system that is being repaired
   * @param playerControlNetId - The net ID of the PlayerControl for the player that is repairing the system
   * @param amount - The amount by which the system is being repaired
   */
  handleRepairSystem(sender: BaseInnerShipStatus, systemId: SystemType, playerControlNetId: number, amount: RepairAmount): void;

  /**
   * Called when a connection sends a CloseDoorsOfType RPC packet.
   *
   * @param sender - The ShipStatus that sent the packet
   * @param systemId - The ID of the system whose doors will be closed
   */
  handleCloseDoorsOfType(sender: BaseInnerShipStatus, systemId: SystemType): void;

  /**
   * Called when a connection sends a SetStartCounter RPC packet.
   *
   * @param player - The player that sent the packet
   * @param sequenceId - The sequence ID sent to force the counter to update
   * @param timeRemaining - The number of seconds until the game will start
   */
  handleSetStartCounter(player: PlayerInstance, sequenceId: number, timeRemaining: number): void;

  /**
   * Called when a connection sends a Disconnect packet.
   *
   * @param connection - The connection that sent the packet
   * @param reason - The reason for why the connection was disconnected
   */
  handleDisconnect(connection: Connection, reason: DisconnectReason | undefined): void;

  /**
   * Called when a connection sends a UsePlatform RPC packet.
   *
   * @param sender - The PlayerControl that sent the packet
   */
  handleUsePlatform(sender: InnerPlayerControl): void;
}
