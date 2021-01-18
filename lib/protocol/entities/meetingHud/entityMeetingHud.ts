import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseInnerNetEntity } from "../types";
import { InnerMeetingHud } from ".";

export class EntityMeetingHud extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerMeetingHud ];

  get meetingHud(): InnerMeetingHud {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyInstance, meetingHudNetId: number) {
    super(SpawnType.MeetingHud, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerMeetingHud(meetingHudNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.MeetingHud,
      GLOBAL_OWNER,
      SpawnFlag.None,
      [
        this.meetingHud.serializeSpawn(),
      ],
    );
  }

  despawn(): void {
    this.lobby.despawn(this.meetingHud);
    this.lobby.deleteMeetingHud();
  }
}
