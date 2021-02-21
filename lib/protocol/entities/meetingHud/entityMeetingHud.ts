import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
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

  despawn(): void {
    this.lobby.despawn(this.meetingHud);
    this.lobby.deleteMeetingHud();
  }
}
