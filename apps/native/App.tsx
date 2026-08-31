
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReadLaterProvider } from "./features/context/ReadLaterContext";
import { ArticlePage } from "./features/components/ArticlePage";

export default function App() {
    return <SafeAreaProvider>
        <ReadLaterProvider>
            <ArticlePage />
        </ReadLaterProvider>
    </SafeAreaProvider>;
}