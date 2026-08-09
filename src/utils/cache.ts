export class Cache<K, V> {
  private store = new Map<K, V>();

  public set(key: K, value: V): void {
    this.store.set(key, value);
  }

  public get(key: K): V | undefined {
    return this.store.get(key);
  }

  public has(key: K): boolean {
    return this.store.has(key);
  }

  public delete(key: K): boolean {
    return this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public size(): number {
    return this.store.size;
  }
}

type FileMeta = {
  md5: string;
  content: string;
};

export const fileCache = new Cache<string, FileMeta>();
