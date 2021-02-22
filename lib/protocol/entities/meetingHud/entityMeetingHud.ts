import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { InnerMeetingHud } from ".";

export class EntityMeetingHud extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    meetingHudNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.MeetingHud, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerMeetingHud(this, meetingHudNetId),
    ];
  }

  getMeetingHud(): InnerMeetingHud {
    return this.getObject(0);
  }

  despawn(): void {
    this.lobby.despawn(this.getMeetingHud());
    this.lobby.deleteMeetingHud();
  }
}
