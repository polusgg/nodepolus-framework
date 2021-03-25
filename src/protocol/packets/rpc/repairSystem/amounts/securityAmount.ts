import { RepairAmount } from ".";

export class SecurityAmount extends RepairAmount {
  constructor(
    protected viewingCameras: boolean,
  ) {
    super();
  }

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

  getValue(): number {
    return this.viewingCameras ? 1 : 0;
  }
}
