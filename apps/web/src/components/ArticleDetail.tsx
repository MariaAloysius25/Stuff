import { Article, textual } from "@read-later/core";

export function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
    return <main className="detail-page">
        <button className="back" onClick={onBack}>&larr; {textual.backToStories}</button>
        <img className="detail-image" src={article.imageUrl} alt={article.imageAlt ?? article.title} />
        <div className="detail-meta">{article.section} <span>{article.publishedAt}</span></div>
        <h2>{article.title}</h2>
        <p className="detail-summary">{article.summary}</p>
        <div className="detail-content">{article.content.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </main>;
}
