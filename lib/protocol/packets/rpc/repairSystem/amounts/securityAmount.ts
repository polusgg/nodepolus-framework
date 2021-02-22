import { RepairAmount } from ".";

export class SecurityAmount implements RepairAmount {
  constructor(
    // TODO: Make protected with getter/setter
    public isViewingCameras: boolean,
  ) {}

  static deserialize(amount: number): SecurityAmount {
    return new SecurityAmount(amount == 1);
  }

  clone(): SecurityAmount {
    return new SecurityAmount(this.isViewingCameras);
  }

  serialize(): number {
    return this.isViewingCameras ? 1 : 0;
  }
}
