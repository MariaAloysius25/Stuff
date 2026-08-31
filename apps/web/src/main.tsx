import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FallbackComponent } from "@read-later/core";
import { ErrorBoundary } from "react-error-boundary";
import { ReadLaterProvider } from "./features/context/ReadLaterContext";
import { ArticlePage } from "./features/components";


function App() {
    return <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ReadLaterProvider>
            <ArticlePage />
        </ReadLaterProvider>
    </ErrorBoundary>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);