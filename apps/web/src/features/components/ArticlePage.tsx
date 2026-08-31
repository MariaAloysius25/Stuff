import { useArticleList, strings } from "@read-later/core";
import "./ArticleSection.css";
import { ArticleSection } from "./ArticleSection";
import { useReadLater } from "../context/ReadLaterContext";
import { useState } from "react";

/* This component is the main page for the web app, displaying the article list 
and allowing users to switch between the feed and saved views. */
export function ArticlePage() {
    const { api, controller: readLater } = useReadLater();
    const [view, setView] = useState<"feed" | "saved">("feed");
    const { state } = useArticleList(api, readLater, { view });


    return (<main>
        <header>
            <div>
                <span className="kicker">{strings.brand}</span>
                <h1>{strings.pageTitle}</h1>
            </div>
            <div className="tabs" >
                <button aria-pressed={view === "feed"} className={view === "feed" ? "active" : ""} onClick={() => setView("feed")}>{strings.allStories}</button>
                <button aria-pressed={view === "saved"} className={view === "saved" ? "active" : ""} onClick={() => setView("saved")}>{strings.savedTab} <b aria-hidden="true">{state.saved.length}</b></button>
            </div>
        </header>
        {state.error && <div className="notice" role="status">{state.error}. <button onClick={() => readLater.clearError()}>{strings.dismiss}</button></div>}
        <section className="intro">
            <p className="eyebrow">{view === "feed" ? strings.feedEyebrow : strings.savedEyebrow}</p>
            <h2>{view === "feed" ? strings.feedHeading : strings.savedHeading}</h2>
        </section>
        <ArticleSection view={view} />
    </main>
    );
}