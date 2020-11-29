import { SpawnPacket, SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { InnerMeetingHud } from "./innerMeetingHud";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type MeetingHudInnerNetObjects = [ InnerMeetingHud ]

export class EntityMeetingHud extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: MeetingHudInnerNetObjects;

  get meetingHud(): InnerMeetingHud {
    return this.innerNetObjects[0];
  }

  private constructor(room: RoomImplementation) {
    super(SpawnType.MeetingHud, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityMeetingHud {
    let meetingHud = new EntityMeetingHud(room);

    meetingHud.setSpawn(flags, owner, innerNetObjects);

    return meetingHud;
  }

  setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.innerNetObjects = [
      InnerMeetingHud.spawn(innerNetObjects[0], this),
    ];
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.MeetingHud,
      GLOBAL_OWNER,
      SpawnFlag.None,
      [],
    );
  }
}
