/**
 * N.B.
 * `BodyDirection` is serialized as a boolean, so more than two can not exist.
 * Anything after `1` will be cast down to `1`.
 */
export enum BodyDirection {
  FacingLeft = 0,
  FacingRight = 1,
  // N.B.! BodyDirections are serialized as booleans, so more than two can not exist. anything after 1 will be cast down to 1
}
