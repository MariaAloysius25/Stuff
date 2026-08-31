// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ArticleDetail } from "./ArticleDetail";
import { ArticleSection } from "./ArticleSection";

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    cleanup();
});

describe("web ArticleSection", () => {
    it("filters articles and loads more results", async () => {
        render(<ArticleSection />);

        await waitFor(() => expect(screen.getByText("The quiet return of the personal computer")).toBeTruthy());
        expect(screen.getByRole("img", { name: "The quiet return of the personal computer" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "All stories" }).getAttribute("aria-pressed")).toBe("true");
        fireEvent.change(screen.getByLabelText("Search articles"), {
            target: { value: "technology" },
        });
        expect(screen.getByText("The quiet return of the personal computer")).toBeTruthy();
        expect(screen.queryByText("A field guide to slower cities")).toBeNull();
    });

    it("saves a note and shows it in the saved view", async () => {
        render(<ArticleSection />);

        await waitFor(() => expect(screen.getByText("The quiet return of the personal computer")).toBeTruthy());
        fireEvent.change(document.getElementById("note-signal")!, {
            target: { value: "Read this later" },
        });
        const articleCard = screen.getByText("The quiet return of the personal computer").closest("article")!;
        fireEvent.click(within(articleCard).getByLabelText("Add To Favorites"));

        await waitFor(() => expect(screen.getByLabelText("Favorited")).toBeTruthy());
        fireEvent.click(screen.getByText("Saved"));

        expect(screen.getByText("Read this later")).toBeTruthy();
    });

    it("renders an accessible article detail page", () => {
        render(<ArticleDetail article={{ ...article, imageAlt: "" }} onBack={() => undefined} />);

        expect(screen.getByRole("heading", { level: 1, name: article.title })).toBeTruthy();
        expect(screen.getByRole("img", { name: `Illustration for ${article.title}` })).toBeTruthy();
        expect(screen.getByText(article.publishedAt).tagName).toBe("TIME");
    });
});

const article = {
    id: "signal",
    title: "The quiet return of the personal computer",
    summary: "Why focused, local-first tools are finding a new audience.",
    content: "A short article.",
    publishedAt: "2026-08-24",
    imageUrl: "https://example.com/signal.jpg",
    section: "Technology",
};
