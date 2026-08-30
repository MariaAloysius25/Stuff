import { useEffect, useState } from "react";
import { createWebApi, ReadLaterController, textual, Article, ReadLaterState } from "@read-later/core";
import { ArticleDetail } from "./ArticleDetail";
import "./ArticleSection.css";

const api = createWebApi();
const readLater = new ReadLaterController(api);
/*
SaveButton component is responsible for rendering the save button for each article. 
params: articleId - the unique identifier of the article to be saved or removed from the read later list.
note - the note associated with the article to be saved.
onSaved - a callback function that is called when the article is successfully saved or removed from the read later list.
*/
const SaveButton = ({ articleId, note, onSaved, state }: { articleId: string; note: string; onSaved: () => void; state: ReadLaterState }) => {
    const saved = state.saved.some((item) => item.articleId === articleId);
    const pending = state.pending.includes(articleId);
    const handleClick = async () => { if (await readLater.toggle(articleId, note)) onSaved(); };
    return <button aria-label={saved ? textual.saved : textual.saveForLater} aria-pressed={saved} className={saved ? "save saved" : "save"} disabled={pending} onClick={() => void handleClick()}><span aria-hidden="true">♥</span></button>;
}

export function ArticleSection() {
    const [items, setItems] = useState<Article[]>([]);
    const [view, setView] = useState<"feed" | "saved">("feed");
    const [state, setState] = useState(readLater.getState());
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const defaultPageSize = 6; // Number of articles to load per page

    useEffect(() => {
        void api.getArticles()
            .then((result) => {
                const updatedItems = result.items.map((item) => {
                    const imageAlt = item.imageAlt ?? item.title;
                    return { ...item, imageAlt };
                });
                setItems(updatedItems);
            });
        void readLater.hydrate();
        const unsubscribe = readLater.subscribe(setState);
        return () => { unsubscribe(); };
    }, []);

    const normalizedQuery = query.trim().toLowerCase();
    const searched = items.filter((item) => `${item.title} ${item.section}`.toLowerCase().includes(normalizedQuery));
    const filtered = view === "feed" ? searched : searched.filter((item) => state.saved.some((saved) => saved.articleId === item.id));
    const displayedList = filtered.slice(0, page * defaultPageSize);

    if (selectedArticle) return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;

    return (<main>
        <header>
            <div>
                <span className="kicker">{textual.brand}</span>
                <h1>{textual.pageTitle}</h1>
            </div>
            <div className="tabs" aria-label="Article views">
                <button aria-pressed={view === "feed"} className={view === "feed" ? "active" : ""} onClick={() => setView("feed")}>{textual.allStories}</button>
                <button aria-pressed={view === "saved"} className={view === "saved" ? "active" : ""} onClick={() => setView("saved")}>{textual.savedTab} <b aria-hidden="true">{state.saved.length}</b></button>
            </div>
        </header>
        {state.error && <div className="notice" role="status">{state.error}. <button onClick={() => readLater.clearError()}>{textual.dismiss}</button></div>}
        <section className="intro">
            <p className="eyebrow">{view === "feed" ? textual.feedEyebrow : textual.savedEyebrow}</p>
            <h2>{view === "feed" ? textual.feedHeading : textual.savedHeading}</h2>
        </section>
        {/*  Search input for filtering articles  */}
        <label className="search-label" htmlFor="article-search">{textual.searchLabel}</label>
        <input id="article-search" type="search" className="search" value={query} placeholder={textual.searchPlaceholder} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
        {/* Article section */}
        <section className="feed">{displayedList.map((article) =>
            <article key={article.id}>
                <img src={article.imageUrl} alt={article.imageAlt?.trim() || `Illustration for ${article.title}`} />
                <div className="article-copy">
                    <div className="meta">
                        <span>{article.section}</span>
                        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                    </div>
                    <h3><button className="article-title" aria-label={`${textual.readArticle}: ${article.title}`} onClick={() => setSelectedArticle(article)}>{article.title}</button></h3>
                    <p>{article.summary}</p>
                    <label className="note-label" htmlFor={`note-${article.id}`}>{textual.noteLabel}</label>
                    <input id={`note-${article.id}`} maxLength={20} className="note" value={notes[article.id] ?? state.saved.find((saved) => saved.articleId === article.id)?.note ?? ""} placeholder={textual.notePlaceholder} aria-label={textual.noteLabel} onChange={(event) => setNotes((current) => ({ ...current, [article.id]: event.target.value }))} />
                    <SaveButton articleId={article.id} note={notes[article.id] ?? ""} state={state} onSaved={() => setNotes((current) => ({ ...current, [article.id]: "" }))} />
                    {state.saved.find((saved) => saved.articleId === article.id)?.note && <p className="saved-note">{state.saved.find((saved) => saved.articleId === article.id)?.note}</p>}
                </div>
            </article>)}
            {displayedList.length === 0 && <p className="empty">{textual.emptySaved}</p>}
        </section>
        {/* Load more */}
        {displayedList.length < filtered.length && <button className="show-more" onClick={() => setPage(page + 1)}>{textual.showMore}</button>}
    </main>);
}