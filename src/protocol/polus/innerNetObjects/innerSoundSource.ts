import { Connection } from "../../connection";
import { BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseRpcPacket } from "../../packets/rpc";
import { MessageWriter } from "../../../util/hazelMessage";
import { EntitySoundSource } from "../entities/entitySoundSource";
import { RpcPacketType, SoundType } from "../../../types/enums";

type LastPlayingData = {
  time: number;
  seek: number;
};

export class InnerSoundSource extends BaseInnerNetObject {
  protected lastPlayingData: LastPlayingData;

  constructor(
    parent: EntitySoundSource,
    netId: number,
    protected readonly duration: number,
    protected readonly resourceId: number,
    protected readonly soundType: SoundType = SoundType.None,
    protected volumeModifier: number = 1,
    protected looping: boolean = false,
    protected paused: boolean = false,
    protected pitch: number = 1,
    protected soundFalloffMultiplier: number = 0,
    protected soundFalloffStartingRadius: number = 10000,
    protected seek: number = 0,
  ) {
    super(0x87, parent, netId);

    this.lastPlayingData = {
      time: Date.now(),
      seek: this.seek,
    };
  }

  getSeek(): number {
    if (this.paused) {
      return this.lastPlayingData.seek;
    }

    const timeSinceLastPlayingSet = Date.now() - this.lastPlayingData.time;

    if (this.isLooping()) {
      return (this.seek + timeSinceLastPlayingSet) % this.duration;
    }

    return Math.min(this.seek + timeSinceLastPlayingSet, this.duration);
  }

  setSeek(seek: number): this {
    this.seek = seek;

    this.updateLastPlayingData();

    return this;
  }

  getDuration(): number {
    return this.duration;
  }

  getResourceId(): number {
    return this.resourceId;
  }

  getSoundType(): SoundType {
    return this.soundType;
  }

  getVolumeModifier(): number {
    return this.volumeModifier;
  }

  setVolumeModifier(modifier: number): this {
    this.volumeModifier = modifier;

    return this;
  }

  isLooping(): boolean {
    return this.looping;
  }

  setLooping(looping: boolean): this {
    this.looping = looping;

    return this;
  }

  isPaused(): boolean {
    return this.paused;
  }

  setPaused(paused: boolean): this {
    this.paused = paused;

    this.updateLastPlayingData();

    return this;
  }

  getPitch(): number {
    return this.pitch;
  }

  setPitch(pitch: number): this {
    this.pitch = pitch;

    return this;
  }

  getSoundFalloffMultiplier(): number {
    return this.soundFalloffMultiplier;
  }

  getSoundFalloffStartingRadius(): number {
    return this.soundFalloffStartingRadius;
  }

  setSoundFalloffMultiplier(multiplier: number): this {
    this.soundFalloffMultiplier = multiplier;

    return this;
  }

  setSoundFalloffStartingRadius(radius: number): this {
    this.soundFalloffStartingRadius = radius;

    return this;
  }

  clone(): InnerSoundSource {
    return new InnerSoundSource(this.parent as EntitySoundSource, this.netId, this.duration, this.resourceId, this.soundType, this.volumeModifier, this.looping, this.paused, this.pitch, this.soundFalloffMultiplier, this.soundFalloffStartingRadius, this.seek);
  }

  serializeData(): DataPacket {
    return new DataPacket(
      this.netId,
      new MessageWriter()
        .writePackedUInt32(this.resourceId)
        .writeFloat32(this.pitch)
        .writeFloat32(this.volumeModifier)
        .writeBoolean(this.looping)
        .writeByte(this.soundType)
        .writeFloat32(this.soundFalloffMultiplier)
        .writeFloat32(this.soundFalloffStartingRadius)
        .writeFloat32(this.seek)
        .writeBoolean(this.paused),
    );
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(this.netId, this.serializeData().data);
  }

  handleRpc(_connection: Connection, _type: RpcPacketType, _packet: BaseRpcPacket, _sendTo: Connection[]): void {
    throw new Error("Unexpected RPC on InnerSoundSource");
  }

  getParent(): EntitySoundSource {
    return this.parent as EntitySoundSource;
  }

  private updateLastPlayingData(): void {
    this.lastPlayingData = {
      time: Date.now(),
      seek: this.seek,
    };
  }
}
