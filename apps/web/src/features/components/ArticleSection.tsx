import { useState, useRef } from "react";
import { Article, ReadLaterState, useArticleList, strings } from "@read-later/core";
import { ArticleDetail } from "./ArticleDetail";
import "./ArticleSection.css";
import { useReadLater } from "../context/ReadLaterContext";

/*
SaveButton component is responsible for rendering the save button for each article. 
params: articleId - the unique identifier of the article to be saved or removed from the read later list.
note - the note associated with the article to be saved.
onSaved - a callback function that is called when the article is successfully saved or removed from the read later list.
*/
const SaveButton = ({ articleId, note, onSaved, state, controller, inputRef }: { articleId: string; note: string; onSaved: () => void; state: ReadLaterState; controller: { toggle: (articleId: string, note?: string) => Promise<boolean> }; inputRef: React.RefObject<HTMLInputElement | null> }) => {
    const saved = state.saved.some((item) => item.articleId === articleId);
    const pending = state.pending.includes(articleId);
    const handleClick = async () => { if (await controller.toggle(articleId, note)) onSaved(); inputRef.current?.focus(); };
    return <button aria-label={saved ? strings.saved : strings.saveForLater} aria-pressed={saved} className={saved ? "save saved" : "save"} disabled={pending} onClick={() => void handleClick()}><span aria-hidden="true">♥</span></button>;
}

export function ArticleSection(view: { view: "feed" | "saved" }) {
    const { api, controller: readLater } = useReadLater();
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { query, setQuery, page, setPage, state, displayedList, filteredList } = useArticleList(api, readLater, view);

    if (selectedArticle) return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;

    return (<>
        {/* Search */}
        <label className="search-label" htmlFor="article-search">{strings.searchLabel}</label>
        <input id="article-search" type="search" aria-label="Search articles" ref={inputRef} className="search" value={query} placeholder={strings.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} />
        {/* Search results */}
        <section className="feed">{displayedList.map((article) =>
            <article key={article.id}>
                <img src={article.imageUrl} alt={article.imageAlt?.trim() || `Illustration for ${article.title}`} />
                <div className="article-copy">
                    <div className="meta">
                        <span>{article.section}</span>
                        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                    </div>
                    <h3><button className="article-title" aria-label={`${strings.readArticle}: ${article.title}`} onClick={() => setSelectedArticle(article)}>{article.title}</button></h3>
                    <p>{article.summary}</p>
                    <label className="note-label" htmlFor={`note-${article.id}`}>{strings.noteLabel}</label>
                    <input id={`note-${article.id}`} maxLength={20} className="note" value={notes[article.id] ?? state.saved.find((saved) => saved.articleId === article.id)?.note ?? ""} placeholder={strings.notePlaceholder} aria-label={strings.noteLabel} onChange={(event) => setNotes((current) => ({ ...current, [article.id]: event.target.value }))} />
                    <SaveButton controller={readLater} articleId={article.id} note={notes[article.id] ?? ""} state={state} onSaved={() => setNotes((current) => ({ ...current, [article.id]: "" }))} inputRef={inputRef} />
                    {state.saved.find((saved) => saved.articleId === article.id)?.note && <p className="saved-note">{state.saved.find((saved) => saved.articleId === article.id)?.note}</p>}
                </div>
            </article>)}
            {displayedList.length === 0 && <p className="empty">{strings.emptySaved}</p>}
        </section>
        {displayedList.length < filteredList.length && <button className="show-more" onClick={() => setPage(page + 1)}>{strings.showMore}</button>}
    </>);
}