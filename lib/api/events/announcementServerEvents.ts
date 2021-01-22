const basicAnnouncementServerEvents = [
  /**
   * Fired when the Announcement Server successfully binds to the network
   * address and port.
   */
  "announcements.ready",
];

/**
 * All Announcement Server events that have no associated data.
 */
export type BasicAnnouncementServerEvents = typeof basicAnnouncementServerEvents[number];

/**
 * All Announcement Server events that have associated data.
 */
export type AnnouncementServerEvents = Record<string, unknown>;
