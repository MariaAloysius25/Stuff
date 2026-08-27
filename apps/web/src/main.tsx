import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import ArticleSection from "./components/ArticleSection";


function App() {
    return <ArticleSection />;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);