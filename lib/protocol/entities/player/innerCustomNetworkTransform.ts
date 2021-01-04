import { PlayerPositionTeleportedEvent, PlayerPositionWalkedEvent } from "../../../api/events/player";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { DataPacket } from "../../packets/gameData";
import { SnapToPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../types";
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

  async snapTo(position: Vector2, sendTo: Connection[]): Promise<void> {
    const player = this.parent.lobby.findPlayerByNetId(this.netId);

    if (!player) {
      throw new Error(`InnerNetObject ${this.netId} does not have a PlayerInstance on the lobby instance`);
    }

    const event = new PlayerPositionTeleportedEvent(player, this.position, this.velocity, position, new Vector2(0, 0));

    await this.parent.lobby.getServer().emit("player.position.updated", event);
    await this.parent.lobby.getServer().emit("player.position.teleported", event);

    if (event.isCancelled()) {
      return;
    }

    this.position = event.getNewPosition();
    this.velocity = event.getNewVelocity();
    this.sequenceId += 5;

    this.sendRPCPacketTo(sendTo, new SnapToPacket(this.position, this.sequenceId));
  }

  getData(): DataPacket {
    const writer = new MessageWriter().writeUInt16(this.sequenceId);

    this.position.serialize(writer);
    this.velocity.serialize(writer);

    return new DataPacket(this.netId, writer);
  }

  async setData(packet: MessageReader | MessageWriter): Promise<void> {
    const player = this.parent.lobby.findPlayerByNetId(this.netId);

    if (!player) {
      throw new Error(`InnerNetObject ${this.netId} does not have a PlayerInstance on the lobby instance`);
    }

    const reader = MessageReader.fromRawBytes(packet.getBuffer());

    this.sequenceId = reader.readUInt16();

    const position = Vector2.deserialize(reader);
    const velocity = Vector2.deserialize(reader);
    const event = new PlayerPositionWalkedEvent(player, this.position, this.velocity, position, velocity);

    await this.parent.lobby.getServer().emit("player.position.updated", event);
    await this.parent.lobby.getServer().emit("player.position.walked", event);

    if (event.isCancelled()) {
      const connection = this.parent.lobby.findConnectionByPlayer(player);

      if (connection) {
        this.sendRPCPacketTo([connection], new SnapToPacket(this.position, this.sequenceId += 5));
      }

      return;
    }

    this.position = event.getNewPosition();
    this.velocity = event.getNewVelocity();
  }

  serializeSpawn(): SpawnInnerNetObject {
    const writer = new MessageWriter().writeUInt16(this.sequenceId);

    this.position.serialize(writer);
    this.velocity.serialize(writer);

    return new SpawnInnerNetObject(this.netId, writer);
  }

  clone(): InnerCustomNetworkTransform {
    return new InnerCustomNetworkTransform(this.netId, this.parent, this.sequenceId, this.position, this.velocity);
  }
}
