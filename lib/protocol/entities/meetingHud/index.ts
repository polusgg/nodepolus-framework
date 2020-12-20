import { SpawnInnerNetObject, SpawnPacket } from "../../packets/gameData/spawn";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { InnerMeetingHud } from "./innerMeetingHud";
import { LobbyImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type MeetingHudInnerNetObjects = [ InnerMeetingHud ];

export class EntityMeetingHud extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: MeetingHudInnerNetObjects;

  get meetingHud(): InnerMeetingHud {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.MeetingHud, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityMeetingHud {
    const meetingHud = new EntityMeetingHud(lobby);

    meetingHud.setSpawn(flags, owner, innerNetObjects);

    return meetingHud;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.MeetingHud,
      GLOBAL_OWNER,
      SpawnFlag.None,
      [
        this.meetingHud.spawn(),
      ],
    );
  }

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerMeetingHud.spawn(innerNetObjects[0], this),
    ];
  }
}
