import { RepairAmount } from "./repairAmount";

export class SubmergedSecurityAmount extends RepairAmount {
  constructor(protected readonly camera: number, protected readonly broken: boolean) {
    super();
  }

  static deserialize(amount: number): SubmergedSecurityAmount {
    return new SubmergedSecurityAmount(Math.floor(amount / 10), amount % 10 !== 0);
  }

  getValue(): number {
    return (this.camera * 10) + (this.broken ? 1 : 0);
  }

  clone(): SubmergedSecurityAmount {
    return new SubmergedSecurityAmount(this.camera, this.broken);
  }

  getCamera(): number {
    return this.camera;
  }

  isBroken(): boolean {
    return this.broken;
  }
}
