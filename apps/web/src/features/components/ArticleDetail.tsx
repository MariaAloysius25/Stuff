import { Article, strings } from "@read-later/core";

// ArticleDetail component is responsible for rendering the details of a selected article.
export function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
    const imageAlt = article.imageAlt?.trim() || `Illustration for ${article.title}`;

    return <div className="detail-page">
        <button className="back" onClick={onBack}>&larr; {strings.backToStories}</button>
        <img className="detail-image" src={article.imageUrl} alt={imageAlt || "Image detail"} />
        <div className="detail-meta">{article.section}
            <time dateTime={article.publishedAt}>{article.publishedAt}</time>
        </div>
        <h1>{article.title}</h1>
        <p className="detail-summary">{article.summary}</p>
        <div className="detail-content">{article.content.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </div>;
}
