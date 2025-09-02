class Storage {
  private static instance: Storage;
  private storage: Map<any, any> = new Map();
  private expiryMap: Map<any, number> = new Map();

  constructor() {
    if (Storage.instance) {
      return Storage.instance;
    }

    Storage.instance = this;
  }

  public set(key: any, value: any, ttl: number | null = null): boolean {
    this.storage.set(key, value);

    if (ttl) {
      const expiryTime = Date.now() + ttl;
      this.expiryMap.set(key, expiryTime);

      setTimeout(() => {
        if (this.expiryMap.get(key) === expiryTime) {
          this.delete(key);
        }
      }, ttl);
    }

    return true;
  }

  public get(key: any): any {
    if (this.has(key)) {
      return this.storage.get(key);
    }
    return null;
  }

  public has(key: any): boolean {
    if (!this.storage.has(key)) {
      return false;
    }

    const expiryTime = this.expiryMap.get(key);
    if (expiryTime && Date.now() > expiryTime) {
      this.delete(key);
      return false;
    }

    return true;
  }

  public delete(key: any): boolean {
    this.storage.delete(key);
    this.expiryMap.delete(key);
    return true;
  }

  public clear(): boolean {
    this.storage.clear();
    this.expiryMap.clear();
    return true;
  }

  public keys(): any[] {
    const validKeys: any[] = [];
    for (const key of this.storage.keys()) {
      if (this.has(key)) {
        validKeys.push(key);
      }
    }
    return validKeys;
  }

  public size(): number {
    return this.keys().length;
  }
}

export default new Storage();