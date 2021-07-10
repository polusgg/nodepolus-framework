import { BaseInnerNetEntity, BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "../../packets/rpc";
import { Connection } from "../../connection";
import { RpcPacketType } from "../../../types/enums";
import { ButtonCountdownUpdated } from "../events/buttonCountdownUpdated";
import { SetCountingDownPacket } from "../packets/rpc/clickBehaviour";

export class InnerClickBehaviour extends BaseInnerNetObject {
  private lastCurrentTimeSet: number;

  constructor(
    parent: BaseInnerNetEntity,
    public maxTimer: number,
    public currentTime: number = 0,
    public saturated: boolean = true,
    public color: [number, number, number, number] = [255, 255, 255, 255],
    public isCountingDown: boolean = true,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(0x83, parent, netId);

    this.lastCurrentTimeSet = Date.now();
  }

  getColor(): [number, number, number, number] {
    return this.color;
  }

  setColor(color: [number, number, number, number]): this {
    this.color = color;

    return this;
  }

  isSaturated(): boolean {
    return this.saturated;
  }

  setSaturated(saturated: boolean): this {
    this.saturated = saturated;

    return this;
  }

  getIsCountingDown(): boolean {
    return this.isCountingDown;
  }

  setIsCountingDown(isCountingDown: boolean): this {
    this.isCountingDown = isCountingDown;

    return this;
  }

  getCurrentTime(): number {
    if (this.isCountingDown) {
      const timeSinceSet = (Date.now() - this.lastCurrentTimeSet) / 1000;

      return Math.max(this.currentTime - timeSinceSet, 0);
    }

    return this.currentTime;
  }

  setCurrentTime(time: number): this {
    this.currentTime = time;

    // this *technically* sets it at the wrong time.
    // if the consumer were to call setCurrentTime();
    // seconds before sending a data update, this
    // would be out of step.
    //
    // TODO: fix above issue

    this.lastCurrentTimeSet = Date.now();

    return this;
  }

  getMaxTimer(): number {
    return this.maxTimer;
  }

  setMaxTimer(maxTimer: number): this {
    this.maxTimer = maxTimer;

    return this;
  }

  serializeData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter()
      .writeFloat32(this.maxTimer)
      .writeFloat32(this.getCurrentTime())
      .writeBoolean(this.isCountingDown)
      .writeBoolean(this.saturated)
      .writeBytes(this.color),
    );
  }

  setData(message: MessageReader | MessageWriter): void {
    const reader = MessageReader.fromRawBytes(message);

    this.maxTimer = reader.readFloat32();
    this.currentTime = reader.readFloat32();
    this.isCountingDown = reader.readBoolean();
    this.saturated = reader.readBoolean();
    this.color = [...reader.readBytes(4).getBuffer()] as [number, number, number, number];
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(this.netId, new MessageWriter()
      .writeFloat32(this.maxTimer)
      .writeFloat32(this.getCurrentTime())
      .writeBoolean(this.isCountingDown)
      .writeBoolean(this.saturated)
      .writeBytes(this.color),
    );
  }

  clone(): InnerClickBehaviour {
    return new InnerClickBehaviour(this.parent, this.maxTimer, this.currentTime, this.saturated, this.color, this.isCountingDown, this.netId);
  }

  getParent(): BaseInnerNetEntity {
    return this.parent;
  }

  async handleRpc(connection: Connection, type: RpcPacketType, packet: BaseRpcPacket, _sendTo: Connection[]): Promise<void> {
    switch (type as number) {
      case 0x83: {
        const button = connection.getSafeLobby().findSafeButtonByNetId(this.getNetId());

        if (button.isDestroyed()) {
          throw new Error("HandleClickButton sent on a destroyed Button");
        } else {
          button.emit("clicked", {
            connection,
            packet,
          });
        }
        break;
      }
      case 0x90: {
        const button = connection.getSafeLobby().findSafeButtonByNetId(this.getNetId());
        const event = new ButtonCountdownUpdated();
        const countingDownPacket = packet as SetCountingDownPacket;

        await button.emit(countingDownPacket.requestCounting ? "button.countdown.started" : "button.countdown.stopped", event);

        if (event.isCancelled()) {
          return;
        }

        await button.setCurrentTime(countingDownPacket.currentTimer);
        await button.setCountingDown(countingDownPacket.requestCounting);
        break;
      }
      default:
        break;
    }
  }
}
