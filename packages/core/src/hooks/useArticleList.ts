import { useEffect, useMemo, useState } from "react";
import { Article, ReadLaterState } from "../types";
import { FakeApi } from "../api/fakeapi";
import { ReadLaterController } from "../index";
import { common } from "../data/common";

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

export function useArticleList(
  api: Pick<FakeApi, "getArticles">,
  controller: ReadLaterController,
  view: "feed" | "saved",
): UseArticleListResult {
  const [items, setItems] = useState<Article[]>([]);
  const [state, setState] = useState(controller.getState());
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Load articles and subscribe to state changes
  useEffect(() => {
    void api.getArticles().then((result) => {
      const updatedItems = result.items.map((item) => ({
        ...item,
        imageAlt: item.imageAlt ?? item.title,
      }));
      setItems(updatedItems);
    });

    void controller.hydrate();
    const unsubscribe = controller.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, [api, controller]);

  // Reset page on query change
  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      setPage(1);
    }, 300);

    return () => clearTimeout(debouncedSearch);
  }, [query]);

  // Filter by search query
  const normalizedQuery = query.trim().toLowerCase();
  const searchedList = useMemo(() => {
    if (normalizedQuery === "") return items;

    return items.filter((item) => {
      const haystack =
        `${item.title} ${item.section} ${item.summary}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

  // Filter by view (feed or saved)
  const filteredList =
    view === "feed"
      ? searchedList
      : searchedList.filter((item) =>
          state.saved.some((saved) => saved.articleId === item.id),
        );

  // Paginate the results
  const displayedList = filteredList.slice(0, page * common.defaultPageSize);

  return {
    items,
    query,
    setQuery,
    page,
    setPage,
    state,
    displayedList,
    searchedList,
    filteredList,
  };
}
