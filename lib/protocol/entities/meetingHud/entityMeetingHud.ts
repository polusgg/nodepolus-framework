import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { VoteState } from "../../../types";
import { InnerMeetingHud } from ".";

export class EntityMeetingHud extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    playerStates: VoteState[] = [],
    meetingHudNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.MeetingHud, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerMeetingHud(this, playerStates, meetingHudNetId),
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
