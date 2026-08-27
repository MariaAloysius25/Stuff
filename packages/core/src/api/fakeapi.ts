import { textual } from "../common/textual";
import { SavedArticle, Article, StorageAdapter } from "../types";
import { articles } from "../data/articles";

export class FakeApi {
  private saved: SavedArticle[] = [];
  private initialized = false;
  constructor(
    private readonly storage: StorageAdapter,
    private readonly failureRate = 0.12,
  ) {}
  /*
  getArticles: Returns the list of saved articles from the storage adapter. It simulates a network delay and ensures that the saved articles are loaded from storage before returning them.
   */
  async getArticles(): Promise<{ items: Article[] }> {
    await delay(120);
    return { items: articles };
  }
  /*
  getReadLater: Returns the list of saved articles from the storage adapter. It simulates a network delay and ensures that the saved articles are loaded from storage before returning them.
   */
  async getReadLater(): Promise<{ items: SavedArticle[] }> {
    await delay(180);
    await this.ensureLoaded();
    return { items: [...this.saved] };
  }
  /*
  save: Saves an article to the list of saved articles. It simulates a network delay, ensures that the saved articles are loaded from storage, and checks for duplicate saves. If the article is already saved, it returns a 409 status code. Otherwise, it adds the article to the saved list and writes it to storage, returning a 201 status code.
   */
  async save(articleId: string, note = ""): Promise<201 | 409> {
    await delay(220);
    await this.ensureLoaded();
    this.failSometimes();
    if (this.saved.some((item) => item.articleId === articleId)) return 409;
    this.saved = [
      ...this.saved,
      {
        articleId,
        savedAt: new Date().toISOString(),
        note: note.trim() || undefined,
      },
    ];
    await this.storage.write(this.saved);
    return 201;
  }
  /*
  remove: Removes an article from the list of saved articles. It simulates a network delay and ensures that the saved articles are loaded from storage before removing the article. If the article is not found, it returns a 404 status code. Otherwise, it removes the article from the saved list and writes the updated list to storage, returning a 204 status code.
   */
  async remove(articleId: string): Promise<204 | 404> {
    await delay(220);
    await this.ensureLoaded();
    this.failSometimes();
    if (!this.saved.some((item) => item.articleId === articleId)) return 404;
    this.saved = this.saved.filter((item) => item.articleId !== articleId);
    await this.storage.write(this.saved);
    return 204;
  }
  /*
  ensureLoaded: Ensures that the saved articles are loaded from storage before returning them.
   */
  private async ensureLoaded() {
    if (!this.initialized) {
      this.saved = await this.storage.read();
      this.initialized = true;
    }
  }
  /*
  failSometimes: Simulates network failures by throwing an error based on the failure rate.
   */
  private failSometimes() {
    if (this.failureRate > 0 && Math.random() < this.failureRate)
      throw new Error(textual.networkError);
  }
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
