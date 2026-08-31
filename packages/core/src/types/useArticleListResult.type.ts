import { Article, ReadLaterState } from "../types";

export interface UseArticleListResult {
  items: Article[];
  query: string;
  setQuery: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  state: ReadLaterState;
  displayedList: Article[];
  searchedList: Article[];
  filteredList: Article[];
}
