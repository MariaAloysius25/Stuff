import { Article, textual } from "@read-later/core";

export function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
    const imageAlt = article.imageAlt?.trim() || `Illustration for ${article.title}`;

    return <main className="detail-page">
        <button className="back" onClick={onBack}>&larr; {textual.backToStories}</button>
        <img className="detail-image" src={article.imageUrl} alt={imageAlt} />
        <div className="detail-meta">{article.section}
            <time dateTime={article.publishedAt}>{article.publishedAt}</time>
        </div>
        <h1>{article.title}</h1>
        <p className="detail-summary">{article.summary}</p>
        <div className="detail-content">{article.content.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </main>;
}
