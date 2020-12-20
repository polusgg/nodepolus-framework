export interface Bindable<T> {
  bound(clientBound: boolean): T;
}
