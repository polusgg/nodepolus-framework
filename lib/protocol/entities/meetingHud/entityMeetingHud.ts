import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerMeetingHud } from ".";

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
