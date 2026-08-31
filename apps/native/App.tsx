
import { SafeAreaProvider } from "react-native-safe-area-context";

import ArticleSection from "./features/components/ArticleSection";
import { ReadLaterProvider } from "./features/context/ReadLaterContext";

export default function App() {
    return <SafeAreaProvider>
        <ReadLaterProvider>
            <ArticleSection />
        </ReadLaterProvider>
    </SafeAreaProvider>;
}