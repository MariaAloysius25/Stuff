import { SavedArticle } from "./savedArticle.type";

export interface ReadLaterState {
  saved: SavedArticle[];
  pending: string[];
  error: string | null;
}
