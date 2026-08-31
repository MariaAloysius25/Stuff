import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const article = {
    id: "signal",
    title: "The quiet return of the personal computer",
    summary: "Why focused, local-first tools are finding a new audience.",
    content: "The most interesting technology shift is not always the loudest one.",
    publishedAt: "2026-08-24",
    imageUrl: "https://example.com/signal.jpg",
    section: "Technology",
};

vi.mock("react-native", () => {
    const createPrimitive = (name: string) => ({ children, ...props }: { children?: React.ReactNode }) => React.createElement(name, props, children);
    return {
        FlatList: ({ data, renderItem, ListEmptyComponent, ListFooterComponent, ...props }: { data: typeof article[]; renderItem: (args: { item: typeof article }) => React.ReactNode; ListEmptyComponent?: React.ReactNode; ListFooterComponent?: React.ReactNode }) => React.createElement("FlatList", props, data.length ? data.map((item) => React.createElement(React.Fragment, { key: item.id }, renderItem({ item }))) : ListEmptyComponent, ListFooterComponent),
        Pressable: createPrimitive("Pressable"),
        Image: createPrimitive("Image"),
        Text: createPrimitive("Text"),
        TextInput: createPrimitive("TextInput"),
        ScrollView: createPrimitive("ScrollView"),
        View: createPrimitive("View"),
        StyleSheet: { create: (styles: object) => styles },
    };
});

vi.mock("@react-native-async-storage/async-storage", () => ({
    default: { getItem: vi.fn(async () => null), setItem: vi.fn(async () => undefined) },
}));

vi.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));

vi.mock("@read-later/core", () => {
    const state = { saved: [] as { articleId: string; note: string }[], pending: [] as string[], error: null as string | null };
    return {
        FakeApi: class { async getArticles() { return { items: [article] }; } },
        ReadLaterController: class {
            private listener: () => void = () => { };
            getState() { return state; }
            subscribe(listener: () => void) { this.listener = listener; return () => { }; }
            async hydrate() { this.listener(); }
            async toggle(articleId: string, note: string) { state.saved.push({ articleId, note }); this.listener(); return true; }
            clearError() { state.error = null; this.listener(); }
        },
        strings: {
            brand: "THE DAILY READS", pageTitle: "Read On The Go", allStories: "All stories", savedTab: "Saved",
            saveForLater: "Add To Favorites", saved: "Favorited", dismiss: "Dismiss", feedEyebrow: "A considered reading list",
            savedEyebrow: "Your personal shelf", feedHeading: "Ideas worth keeping close.", savedHeading: "Stories waiting for your attention.",
            emptySaved: "Nothing saved yet.", searchLabel: "Search articles", searchPlaceholder: "Search by title or section",
            showMore: "Show more", noteLabel: "Note", notePlaceholder: "Add a note before saving", readArticle: "Read article",
        },
        common: { defaultPageSize: 6 },
        useArticleList: () => ({
            items: [article],
            query: "",
            setQuery: vi.fn(),
            page: 1,
            setPage: vi.fn(),
            state,
            displayedList: [article],
            searchedList: [article],
            filteredList: [article],
        }),
    };
});

import ArticleSection from "./ArticleSection";
import { ArticleDetail } from "./ArticleDetail";

beforeEach(() => vi.clearAllMocks());

describe("native ArticleSection", () => {
    it("renders the article and exposes its note and save controls", async () => {
        let renderer!: TestRenderer.ReactTestRenderer;
        await act(async () => { renderer = TestRenderer.create(<ArticleSection view="feed" />); });

        expect(renderer.root.findByProps({ children: article.title })).toBeTruthy();
        expect(renderer.root.findByProps({ accessibilityLabel: `Note: ${article.title}` })).toBeTruthy();
        expect(renderer.root.findByProps({ accessibilityLabel: "Add To Favorites" })).toBeTruthy();
        expect(renderer.root.findByProps({ accessibilityLabel: article.title })).toBeTruthy();
    });

    it("renders the detail image with an accessible label", () => {
        let renderer!: TestRenderer.ReactTestRenderer;
        act(() => { renderer = TestRenderer.create(<ArticleDetail article={article} onBack={() => undefined} />); });

        expect(renderer.root.findByProps({ accessibilityLabel: article.title })).toBeTruthy();
    });
});
