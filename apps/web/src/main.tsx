import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ArticleSection } from "./features/components/ArticleSection";
import { FallbackComponent } from "@read-later/core";
import { ErrorBoundary } from "react-error-boundary";
import { ReadLaterProvider } from "./features/context/ReadLaterContext";


function App() {
    return <ErrorBoundary FallbackComponent={FallbackComponent}  >
        <ReadLaterProvider>
            <ArticleSection />
        </ReadLaterProvider>
    </ErrorBoundary>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);