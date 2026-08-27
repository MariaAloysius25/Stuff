import { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article, textual, FakeApi, ReadLaterController, SavedArticle, StorageAdapter } from "@read-later/core";
import { ArticleDetail } from "./ArticleDetail";

const storage: StorageAdapter = {
    async read() { const value = await AsyncStorage.getItem("read-later:saved"); return value ? JSON.parse(value) as SavedArticle[] : []; },
    async write(items) { await AsyncStorage.setItem("read-later:saved", JSON.stringify(items)); }
};
const api = new FakeApi(storage);
const readLater = new ReadLaterController(api);

export default function App() {
    const [items, setItems] = useState<Article[]>([]);
    const [saved, setSaved] = useState(readLater.getState());
    const [showSaved, setShowSaved] = useState(false);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    useEffect(() => {
        void api.getArticles()
            .then((result) => setItems(result.items));
        void readLater.hydrate();
        const unsubscribe = readLater.subscribe(setSaved);
        return () => { unsubscribe(); };
    }, []);
    const searched = items.filter((item) => `${item.title} ${item.summary} ${item.section}`.toLowerCase().includes(query.trim().toLowerCase()));
    const filtered = showSaved ? searched.filter((item) => saved.saved.some((entry) => entry.articleId === item.id)) : searched;
    const visible = filtered.slice(0, page * 6);
    if (selectedArticle) return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
    return <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
            <Text style={styles.overline}>{textual.brand}</Text>
            <Text style={styles.title}>{textual.pageTitle}</Text>
            <View style={styles.tabs}>
                <Pressable onPress={() => setShowSaved(false)}>
                    <Text style={!showSaved ? styles.activeTab : styles.tab}>{textual.allStories}</Text>
                </Pressable>
                <Pressable onPress={() => setShowSaved(true)}>
                    <Text style={showSaved ? styles.activeTab : styles.tab}>{textual.savedTab} ({saved.saved.length})</Text>
                </Pressable>
            </View>
        </View>
        {saved.error && <Text style={styles.error}>{saved.error}</Text>}
        <TextInput accessibilityLabel={textual.searchLabel} style={styles.search} value={query} placeholder={textual.searchPlaceholder} onChangeText={(value) => { setQuery(value); setPage(1); }} />
        <FlatList data={visible} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{textual.emptySaved}</Text>} renderItem={({ item }) => { const isSaved = saved.saved.some((entry) => entry.articleId === item.id); const pending = saved.pending.includes(item.id); const note = notes[item.id] ?? saved.saved.find((entry) => entry.articleId === item.id)?.note ?? ""; const save = async () => { if (await readLater.toggle(item.id, note)) setNotes({ ...notes, [item.id]: "" }); }; return <Pressable accessibilityRole="button" accessibilityLabel={`${textual.readArticle}: ${item.title}`} onPress={() => setSelectedArticle(item)} style={styles.card}><Text style={styles.section}>{item.section}  ·  {item.publishedAt}</Text><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.summary}>{item.summary}</Text><Text style={styles.noteLabel}>{textual.noteLabel}</Text><TextInput accessibilityLabel={`${textual.noteLabel}: ${item.title}`} style={styles.note} value={note} placeholder={textual.notePlaceholder} onChangeText={(value) => setNotes({ ...notes, [item.id]: value })} onPressIn={(event) => event.stopPropagation()} /><Pressable accessibilityRole="button" accessibilityLabel={isSaved ? textual.saved : textual.saveForLater} disabled={pending} style={[styles.button, isSaved && styles.savedButton]} onPress={(event) => { event.stopPropagation(); void save(); }}><Text style={styles.heart}>{"♥"}</Text></Pressable></Pressable>; }} ListFooterComponent={visible.length < filtered.length ? <Pressable style={styles.showMore} onPress={() => setPage(page + 1)}><Text style={styles.showMoreText}>{textual.showMore}</Text></Pressable> : null} /></SafeAreaView>;
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f4f0e8" },
    header: { padding: 24, borderBottomWidth: 1, borderBottomColor: "#c9c4b9" },
    overline: { color: "#bd4e32", fontSize: 11, fontWeight: "700", letterSpacing: 2 },
    title: { color: "#17221d", fontSize: 34, fontWeight: "700", marginTop: 5 },
    tabs: { flexDirection: "row", gap: 20, marginTop: 24 },
    tab: { color: "#65706a", fontSize: 15 },
    activeTab: { color: "#bd4e32", fontWeight: "700", fontSize: 15 },
    list: { padding: 16, gap: 14 },
    card: { backgroundColor: "#fffdf8", borderWidth: 1, borderColor: "#ddd7ca", padding: 18 },
    section: { color: "#bd4e32", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
    cardTitle: { color: "#17221d", fontSize: 23, fontWeight: "700", marginTop: 10 },
    summary: { color: "#65706a", lineHeight: 21, marginVertical: 10 },
    button: { alignSelf: "flex-start", backgroundColor: "#17221d", paddingVertical: 10, paddingHorizontal: 14 },
    savedButton: { backgroundColor: "#bd4e32" },
    buttonText: { color: "#fffdf8", fontWeight: "700" },
    heart: { color: "#fffdf8", fontSize: 22 },
    error: { backgroundColor: "#f3d9c8", color: "#7e2f21", padding: 12 },
    empty: { color: "#65706a", padding: 20 }
    ,search: { marginHorizontal: 16, marginTop: 16, backgroundColor: "#fffdf8", borderWidth: 1, borderColor: "#c9c4b9", padding: 12, color: "#17221d" }
    ,noteLabel: { color: "#65706a", fontSize: 12, marginBottom: 4 }
    ,note: { backgroundColor: "#f4f0e8", borderBottomWidth: 1, borderBottomColor: "#c9c4b9", padding: 8, marginBottom: 12, color: "#17221d" }
    ,showMore: { alignSelf: "center", backgroundColor: "#17221d", paddingVertical: 12, paddingHorizontal: 20, marginVertical: 8 }
    ,showMoreText: { color: "#fffdf8", fontWeight: "700" }
});