import { RepairAmount } from ".";

export class SecurityAmount implements RepairAmount {
  constructor(
    protected viewingCameras: boolean,
  ) {}

  static deserialize(amount: number): SecurityAmount {
    return new SecurityAmount(amount == 1);
  }

  isViewingCameras(): boolean {
    return this.viewingCameras;
  }

  setViewingCameras(viewingCameras: boolean): this {
    this.viewingCameras = viewingCameras;

    return this;
  }

  clone(): SecurityAmount {
    return new SecurityAmount(this.viewingCameras);
  }

  serialize(): number {
    return this.viewingCameras ? 1 : 0;
  }
}
