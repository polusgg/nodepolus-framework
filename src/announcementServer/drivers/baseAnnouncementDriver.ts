import { ClientLanguage } from "../../types/enums";
import { ConnectionInfo } from "../../types";
import { Announcement } from "../types";

/**
 * The base class for the announcement server's data source.
 */
export abstract class BaseAnnouncementDriver {
  protected refreshedAt = Date.now();
  protected latestAnnouncement?: Announcement;
  protected forceShowAnnouncement = false;

  /**
   * Fetches the latest announcement.
   *
   * @returns A promise that resolves to the fetched announcement, or `undefined` if there are no announcements or an error occured
   */
  abstract fetchLatestAnnouncement(): Promise<Announcement | undefined>;

  /**
   * Gets the amount of time between each refresh of the cached announcement.
   *
   * @returns The number of seconds between cache refreshes.
   */
  abstract getRefreshRate(): number;

  /**
   * Gets the time at which the server last refreshed the latest announcement.
   */
  getRefreshedAt(): number {
    return this.refreshedAt;
  }

  /**
   * Gets the latest cached announcement.
   */
  getLatestAnnouncement(): Announcement | undefined {
    return this.latestAnnouncement;
  }

  /**
   * Gets whether or not the announcement server should send the latest cached
   * announcement, with a modified ID, to each client that connects.
   *
   * @returns `true` if the announcement server will force the announcement to be displayed, `false` if it will respect the client cache
   */
  getForceShowAnnouncement(): boolean {
    return this.forceShowAnnouncement;
  }

  /**
   * Sets whether or not the announcement server should send the latest cached
   * announcement, with a modified ID, to each client that connects.
   *
   * This will force the announcement to display __*every time*__ the user
   * returns to the main menu.
   *
   * @param force - `true` to force the announcement to be displayed, `false` to respect the client cache
   */
  setForceShowAnnouncement(force: boolean = false): this {
    this.forceShowAnnouncement = force;

    return this;
  }

  /**
   * Handles a request from a connection to get the latest announcement.
   *
   * This method will automatically handle cache refresh at the rate returned by
   * `getRefreshRate()`, as well as tell the announcement server to send back a
   * cached response if the given ID matches that of the latest announcement.
   *
   * Override this method if its implementation does not suit your needs.
   *
   * @param connection - The connection requesting the latest announcement
   * @param announcementVersion - The version of announcements that the connection is expecting
   * @param lastAnnouncementId - The ID of the last announcement that the connection received
   * @param language - The language in which the connection is requesting the announcement text
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onRequest(connectionInfo: ConnectionInfo, announcementVersion: number, lastAnnouncementId: number, language: ClientLanguage): Promise<Announcement | undefined> {
    await this.refresh();

    if (lastAnnouncementId === this.latestAnnouncement?.getId()) {
      return this.forceShowAnnouncement
        ? new Announcement(this.getForcefulAnnouncementId(lastAnnouncementId), this.latestAnnouncement.getTranslations())
        : undefined;
    }

    return this.latestAnnouncement;
  }

  /**
   * Fetches the latest announcement (via `fetchLatestAnnouncement()`) if
   * necessary, and updates `latestAnnouncement` if the fetched announcement has
   * an ID that differs from that of the cached announcement.
   *
   * @param force - `true` to force a data fetch operation, `false` to use the refresh rate returned by `getRefreshRate()`
   * @returns A promise that resolves to `true` if the fetched announcement is different from the cached `latestAnnouncement`, `false` if not
   */
  async refresh(force: boolean = false): Promise<boolean> {
    if (!this.shouldRefresh() && !force) {
      return false;
    }

    this.refreshedAt = Date.now();

    const latest = await this.fetchLatestAnnouncement();

    if (latest?.getId() !== this.latestAnnouncement?.getId()) {
      this.latestAnnouncement = latest;

      return true;
    }

    return false;
  }

  /**
   * Gets a dynamic ID based on the given ID in order to force a client to
   * display the announcement.
   *
   * @param lastAnnouncementId - The ID of the last announcement that the connection received
   */
  protected getForcefulAnnouncementId(lastAnnouncementId: number): number {
    return lastAnnouncementId % 5 == 0 ? --lastAnnouncementId : ++lastAnnouncementId;
  }

  /**
   * Gets whether or not the cache should be refresh.
   *
   * @returns `true` if the cache should be refreshed, `false` if not
   */
  protected shouldRefresh(): boolean {
    return Date.now() >= this.refreshedAt + this.getRefreshRate();
  }
}
