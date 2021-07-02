import { BaseInnerNetEntity } from "../../entities/baseEntity";
import { InnerCustomNetworkTransformGeneric, InnerSoundSource } from "../innerNetObjects";
import { LobbyInstance } from "../../../api/lobby";
import { Vector2 } from "../../../types";
import { EdgeAlignments, SoundType, SpawnFlag } from "../../../types/enums";

export class EntitySoundSource extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    resourceId: number,
    position: Vector2,
    duration: number,
    soundType: SoundType = SoundType.None,
    volumeModifier: number = 1,
    looping: boolean = false,
    paused: boolean = false,
    pitch: number = 1,
    soundFalloffMultiplier: number = 0,
    soundFalloffStartingRadius: number = 10000,
    seek: number = 0,
    alignment: EdgeAlignments = EdgeAlignments.None,
    z: number = -50,
    attachedTo: number = -1,
    soundSourceNetId: number = lobby.getHostInstance().getNextNetId(),
    customNetworkTransformNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(0x85, lobby, 0x42069, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerSoundSource(this, soundSourceNetId, duration, resourceId, soundType, volumeModifier, looping, paused, pitch, soundFalloffMultiplier, soundFalloffStartingRadius, seek),
      new InnerCustomNetworkTransformGeneric(this, alignment, position, z, attachedTo, customNetworkTransformNetId),
    ];
  }

  getCustomNetworkTransform(): InnerCustomNetworkTransformGeneric {
    return this.getObject(1);
  }

  getSoundSource(): InnerSoundSource {
    return this.getObject(0);
  }

  despawn(): void {
    for (let i = 0; i < this.innerNetObjects.length; i++) {
      this.lobby.despawn(this.innerNetObjects[i]);
    }
  }

  getSeek(): number {
    return this.getSoundSource().getSeek();
  }

  getDuration(): number {
    return this.getSoundSource().getDuration();
  }

  getResourceId(): number {
    return this.getSoundSource().getResourceId();
  }

  getSoundType(): SoundType {
    return this.getSoundSource().getSoundType();
  }

  getVolumeModifier(): number {
    return this.getSoundSource().getVolumeModifier();
  }

  getPitch(): number {
    return this.getSoundSource().getPitch();
  }

  getFalloffMultiplier(): number {
    return this.getSoundSource().getSoundFalloffMultiplier();
  }

  getFalloffStartingRadius(): number {
    return this.getSoundSource().getSoundFalloffStartingRadius();
  }

  getPosition(): Vector2 {
    return this.getCustomNetworkTransform().getPosition();
  }

  isLooping(): boolean {
    return this.getSoundSource().isLooping();
  }

  isPaused(): boolean {
    return this.getSoundSource().isPaused();
  }

  setSeek(seek: number): this {
    this.getSoundSource().setSeek(seek);

    return this;
  }

  setVolumeModifier(modifier: number): this {
    this.getSoundSource().setVolumeModifier(modifier);

    return this;
  }

  setPitch(pitch: number): this {
    this.getSoundSource().setPitch(pitch);

    return this;
  }

  setFalloffMultiplier(multiplier: number): this {
    this.getSoundSource().setSoundFalloffMultiplier(multiplier);

    return this;
  }

  setFalloffStartingRadius(radius: number): this {
    this.getSoundSource().setSoundFalloffStartingRadius(radius);

    return this;
  }

  setLooping(looping: boolean = true): this {
    this.getSoundSource().setLooping(looping);

    return this;
  }

  pause(paused: boolean = true): this {
    this.getSoundSource().setPaused(paused);

    return this;
  }

  setPosition(position: Vector2): this {
    this.getCustomNetworkTransform().setPosition(position);

    return this;
  }
}
