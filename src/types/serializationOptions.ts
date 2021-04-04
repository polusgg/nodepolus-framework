import { CanSerializeToHazel } from ".";

export type SerializationOptions<Type> = Type extends CanSerializeToHazel<infer X> ? X : Record<string, never>;
