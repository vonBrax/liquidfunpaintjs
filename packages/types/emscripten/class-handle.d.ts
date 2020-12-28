declare interface ClassHandle<T> {
  clone(): T;
  delete(): void;
  deleteLater(): ClassHandle<T>;
  isAliasOf(other: ClassHandle<T>): boolean;
  isDeleted(): boolean;
}
