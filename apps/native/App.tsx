
import { SafeAreaProvider } from "react-native-safe-area-context";

import ArticleSection from "./features/components/ArticleSection";

export default function App() {
    return <SafeAreaProvider><ArticleSection /></SafeAreaProvider>;
}