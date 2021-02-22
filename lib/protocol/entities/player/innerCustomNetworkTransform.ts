import { PlayerPositionTeleportedEvent, PlayerPositionWalkedEvent } from "../../../api/events/player";
import { InnerNetObjectType, RpcPacketType, TeleportReason } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseRpcPacket, SnapToPacket } from "../../packets/rpc";
import { BaseInnerNetObject } from "../baseEntity";
import { MaxValue } from "../../../util/constants";
import { Connection } from "../../connection";
import { Vector2 } from "../../../types";
import { EntityPlayer } from ".";

export class InnerCustomNetworkTransform extends BaseInnerNetObject {
  constructor(
    netId: number,
    public readonly parent: EntityPlayer,
    public sequenceId: number,
    public position: Vector2,
    public velocity: Vector2,
  ) {
    super(InnerNetObjectType.CustomNetworkTransform, netId, parent);
  }

  async snapTo(position: Vector2, reason: TeleportReason, sendTo?: Connection[]): Promise<void> {
    const player = this.parent.lobby.findPlayerByNetId(this.netId);

    if (!player) {
      throw new Error(`InnerNetObject ${this.netId} does not have a PlayerInstance on the lobby instance`);
    }

    this.incrementSequenceId(5);

    const event = new PlayerPositionTeleportedEvent(player, this.position, this.velocity, position, Vector2.zero(), reason);

    await this.parent.lobby.getServer().emit("player.position.updated", event);
    await this.parent.lobby.getServer().emit("player.position.teleported", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection) {
        this.sendRpcPacket(new SnapToPacket(this.position, this.incrementSequenceId(5)), [connection]);
      }

      return;
    }

    this.position = event.getNewPosition();
    this.velocity = event.getNewVelocity();

    this.sendRpcPacket(new SnapToPacket(this.position, this.sequenceId), sendTo);
  }

  handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, sendTo: Connection[]): void {
    switch (type) {
      case RpcPacketType.SnapTo:
        this.snapTo((packet as SnapToPacket).position, TeleportReason.Unknown, sendTo);
        break;
      default:
        break;
    }
  }

  serializeData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter()
        .writeUInt16(this.sequenceId)
        .writeVector2(this.position)
        .writeVector2(this.velocity),
    );
  }

  async setData(packet: MessageReader | MessageWriter): Promise<void> {
    const player = this.parent.lobby.findPlayerByNetId(this.netId);

    if (!player) {
      throw new Error(`InnerNetObject ${this.netId} does not have a PlayerInstance on the lobby instance`);
    }

    const reader = MessageReader.fromRawBytes(packet.getBuffer());
    const sequenceId = reader.readUInt16();

    if (!this.isSequenceIdGreater(sequenceId)) {
      return;
    }

    this.sequenceId = sequenceId;

    const position = reader.readVector2();
    const velocity = reader.readVector2();
    const event = new PlayerPositionWalkedEvent(player, this.position, this.velocity, position, velocity);

    await this.parent.lobby.getServer().emit("player.position.updated", event);
    await this.parent.lobby.getServer().emit("player.position.walked", event);

    if (event.isCancelled()) {
      const connection = player.getConnection();

      if (connection) {
        this.sendRpcPacket(new SnapToPacket(this.position, this.incrementSequenceId(5)), [connection]);
      }

      return;
    }

    this.position = event.getNewPosition();
    this.velocity = event.getNewVelocity();
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(
      this.netId,
      new MessageWriter()
        .writeUInt16(this.sequenceId)
        .writeVector2(this.position)
        .writeVector2(this.velocity),
    );
  }

  clone(): InnerCustomNetworkTransform {
    return new InnerCustomNetworkTransform(this.netId, this.parent, this.sequenceId, this.position, this.velocity);
  }

  protected incrementSequenceId(amount: number): number {
    this.sequenceId = (this.sequenceId + amount) % (MaxValue.UInt16 + 1);

    return this.sequenceId;
  }

  protected isSequenceIdGreater(sequenceId: number): boolean {
    const max = this.sequenceId + 32767;

    if (this.sequenceId < max) {
      if (sequenceId > this.sequenceId) {
        return sequenceId <= max;
      }

      return false;
    }

    if (sequenceId <= this.sequenceId) {
      return sequenceId <= max;
    }

    return true;
  }
}
