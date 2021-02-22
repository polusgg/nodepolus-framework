import { CacheDataPacket, AnnouncementDataPacket, BaseAnnouncementPacket, SetLanguagesPacket } from "../protocol/packets/announcement";
import { AnnouncementHelloPacket, RootAnnouncementPacket } from "../protocol/packets/hazel";
import { AnnouncementServerEvents, BasicAnnouncementServerEvents } from "../api/events";
import { ANNOUNCEMENT_SERVER_PORT, DEFAULT_LANGUAGES } from "../util/constants";
import { ClientLanguage, HazelPacketType } from "../types/enums";
import { AnnouncementPacket } from "../protocol/packets";
import { MessageReader } from "../util/hazelMessage";
import { BaseAnnouncementDriver } from "./drivers";
import { TextComponent } from "../api/text";
import { ConnectionInfo } from "../types";
import { Announcement } from "./types";
import { Logger } from "../logger";
import Emittery from "emittery";
import dgram from "dgram";

export class AnnouncementServer extends Emittery.Typed<AnnouncementServerEvents, BasicAnnouncementServerEvents> {
  protected readonly announcementServerSocket = dgram.createSocket("udp4");

  protected driver?: BaseAnnouncementDriver;
  protected sendLanguages = false;
  protected languages: Map<number, string> = new Map(DEFAULT_LANGUAGES);

  constructor(
    protected readonly address: string,
    protected readonly logger: Logger,
  ) {
    super();

    this.announcementServerSocket.on("message", (buf, remoteInfo) => {
      if (this.driver === undefined) {
        return;
      }

      try {
        const connectionInfo = ConnectionInfo.fromString(`${remoteInfo.address}:${remoteInfo.port}`);
        const parsed = AnnouncementPacket.deserialize(MessageReader.fromRawBytes(buf));

        if (parsed.getType() == HazelPacketType.Hello) {
          this.handleHello(parsed.data as AnnouncementHelloPacket, connectionInfo);
        }
      } catch (error) {
        logger.warn(error.message);
      }
    });

    this.announcementServerSocket.on("error", error => {
      this.logger.catch(error);
    });
  }

  /**
   * Gets the underlying socket for the announcement server.
   */
  getSocket(): dgram.Socket {
    return this.announcementServerSocket;
  }

  /**
   * Gets the IP address to which the announcement server is bound.
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Gets the port on which the announcement server listens for packets.
   */
  getPort(): number {
    return ANNOUNCEMENT_SERVER_PORT;
  }

  /**
   * Gets the driver used to fetch announcements.
   */
  getDriver(): BaseAnnouncementDriver | undefined {
    return this.driver;
  }

  /**
   * Sets the driver used to fetch announcements.
   *
   * @param driver - The new announcement driver
   */
  setDriver(driver?: BaseAnnouncementDriver): this {
    this.logger.debug("Driver set to %s", driver?.constructor.name);

    this.driver = driver;

    return this;
  }

  /**
   * Sets whether or not the announcement server should send custom language
   * names to all connections.
   *
   * @experimental
   * @param sendLanguages - `true` to send custom language names, `false` to only send announcements
   */
  sendLanguagesOnHello(sendLanguages: boolean = true): this {
    this.sendLanguages = sendLanguages;

    return this;
  }

  /**
   * Sets the custom language names.
   *
   * @experimental
   * @param languages - The custom language names
   */
  setLanguages(languages: Map<number, string>): this {
    this.languages = languages;

    return this;
  }

  /**
   * Sets a custom language name.
   *
   * @experimental
   * @param id - The ID of the language name
   * @param text - The language name
   */
  setLanguage(id: number, text: string): this {
    this.languages.set(id, text);

    return this;
  }

  /**
   * Removes the language name with the given ID.
   *
   * @experimental
   * @param id - The ID of the language name to be removed
   */
  deleteLanguage(id: number): this {
    this.languages.delete(id);

    return this;
  }

  /**
   * Adds a custom language name.
   *
   * @experimental
   * @param text - The custom language name
   */
  addLanguage(text: string): this {
    const id = this.languages.entries()[this.languages.size - 1].id + 1;

    return this.setLanguage(id, text);
  }

  /**
   * Removes all custom language names.
   *
   * @experimental
   */
  clearLanguages(): this {
    return this.setLanguages(new Map());
  }

  /**
   * Starts listening for packets on the server socket.
   */
  async listen(): Promise<void> {
    await this.driver?.refresh(true);

    return new Promise((resolve, _reject) => {
      this.announcementServerSocket.bind(this.getPort(), this.address, () => {
        this.emit("announcements.ready");

        resolve();
      });
    });
  }

  protected async handleHello(helloPacket: AnnouncementHelloPacket, connectionInfo: ConnectionInfo): Promise<void> {
    if (this.sendLanguages) {
      this.sendSetLanguagesPacket(connectionInfo);
    }

    if (this.driver === undefined) {
      return;
    }

    const announcement = await this.driver.onRequest(
      connectionInfo,
      helloPacket.announcementVersion,
      helloPacket.lastAnnouncementId,
      helloPacket.language,
    );

    if (announcement === undefined) {
      this.sendCachePacket(connectionInfo);

      return;
    }

    this.sendAnnouncementPacket(connectionInfo, announcement, helloPacket.language);
  }

  protected sendCachePacket(connectionInfo: ConnectionInfo): void {
    this.sendTo(connectionInfo, new CacheDataPacket());
  }

  protected sendAnnouncementPacket(connectionInfo: ConnectionInfo, announcement: Announcement, language: ClientLanguage): void {
    const text = announcement.translate(language) ?? TextComponent.from("");

    this.sendTo(connectionInfo, new AnnouncementDataPacket(announcement.getId(), text.toString()));
  }

  protected sendSetLanguagesPacket(connectionInfo: ConnectionInfo): void {
    this.sendTo(connectionInfo, new SetLanguagesPacket(this.languages));
  }

  protected sendTo(connectionInfo: ConnectionInfo, packet: BaseAnnouncementPacket): void {
    this.announcementServerSocket.send(
      new AnnouncementPacket(1, new RootAnnouncementPacket([packet])).serialize().getBuffer(),
      connectionInfo.getPort(),
      connectionInfo.getAddress(),
    );
  }
}
