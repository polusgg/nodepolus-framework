export interface PluginAuthor {
  name: string;
  email?: string;
  website?: string;
}

export interface PluginMetadata {
  name: string;
  version: [number, number, number];
  description?: string;
  authors?: PluginAuthor[];
  website?: string;
}

export interface NodePolusPlugin {
  folder: string;
  metadata: PluginMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entrypoint: any;
}
