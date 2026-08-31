import { SavedArticle, StorageAdapter } from "../types";

/* WebStorage: A storage adapter that uses the browser's localStorage to persist saved articles. It implements the StorageAdapter interface and provides methods to read and write saved articles to localStorage. */
export class WebStorage implements StorageAdapter {
  constructor(private readonly key = "read-later:saved") {}
  async read() {
    try {
      // reads from localStorage under the specified key and parses the JSON string into an array of SavedArticle objects
      return JSON.parse(
        localStorage.getItem(this.key) ?? "[]",
      ) as SavedArticle[];
    } catch {
      return [];
    }
  }
  async write(items: SavedArticle[]) {
    // writes to localStorage under the specified key
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
