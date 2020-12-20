export enum DecontaminationDoorState {
  Idle = 0,
  Enter = 1 << 0,
  Closed = 1 << 1,
  Exit = 1 << 2,
  HeadingUp = 1 << 3,
}
