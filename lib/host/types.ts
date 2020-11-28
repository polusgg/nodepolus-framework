import { ClientInstance } from "../client/types";
import { Connection } from "../protocol/connection";

export interface HostInstance extends ClientInstance {
  handleReady(sender: Connection): void;
  handleSceneChange(sender: Connection, sceneName: string): void;
}
