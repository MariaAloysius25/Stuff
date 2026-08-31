import { SavedArticle, StorageAdapter } from "../types";

/* MemoryStorage: A simple in-memory storage adapter that implements the StorageAdapter interface. It provides methods to read and write saved articles to an in-memory array. */
export class MemoryStorage implements StorageAdapter {
  private value: SavedArticle[] = [];
  async read() {
    return [...this.value];
  }
  async write(items: SavedArticle[]) {
    this.value = [...items];
  }
}
