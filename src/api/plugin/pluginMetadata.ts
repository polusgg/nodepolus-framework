import { PluginAuthor } from ".";

/**
 * A type used to describe the metadata for a NodePolus plugin.
 */
export type PluginMetadata = {
  /**
   * The name of the plugin.
   */
  name: string;
  /**
   * The version of the plugin.
   */
  version: [major: number, minor: number, patch: number];
  /**
   * The description of the plugin.
   */
  description?: string;
  /**
   * The authors of the plugin.
   */
  authors?: (PluginAuthor | string)[];
  /**
   * The homepage for the plugin.
   */
  website?: string;
};
