import { PluginMetadata } from ".";

export type Plugin = {
  folder: string;
  metadata: PluginMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entrypoint: any;
};
