import { RepairAmount } from ".";

export class SecurityAmount implements RepairAmount {
  constructor(
    public readonly isViewingCameras: boolean,
  ) {}

  static deserialize(amount: number): SecurityAmount {
    return new SecurityAmount(amount == 1);
  }

  serialize(): number {
    return this.isViewingCameras ? 1 : 0;
  }
}
