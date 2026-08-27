import { SavedArticle } from "./savedArticle.type";

export interface StorageAdapter {
  read(): Promise<SavedArticle[]>;
  write(items: SavedArticle[]): Promise<void>;
}
