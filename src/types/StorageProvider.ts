export interface StorageProvider {
  get: (key: string) => string | null | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
}
