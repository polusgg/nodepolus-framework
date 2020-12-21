export interface Bindable<T> {
  bound(isClientBound: boolean): T;
}
