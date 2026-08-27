import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Article, textual, FakeApi, ReadLaterController, SavedArticle, StorageAdapter } from "@read-later/core";
import { ArticleDetail } from "./ArticleDetail";
import { styles } from "./ArticleSection.styles";

const storage: StorageAdapter = {
    async read() { const value = await AsyncStorage.getItem("read-later:saved"); return value ? JSON.parse(value) as SavedArticle[] : []; },
    async write(items) { await AsyncStorage.setItem("read-later:saved", JSON.stringify(items)); }
};
const api = new FakeApi(storage);
const readLater = new ReadLaterController(api);


const ArticleSection = () => {
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

    const searched = items.filter((item) => `${item.title} ${item.section}`.toLowerCase().includes(query.trim().toLowerCase()));
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
        {saved.error && <View style={styles.notice}><Text style={styles.error}>{saved.error}.</Text><Pressable onPress={() => readLater.clearError()}><Text style={styles.dismiss}>{textual.dismiss}</Text></Pressable></View>}
        <View style={styles.intro}>
            <Text style={styles.eyebrow}>{showSaved ? textual.savedEyebrow : textual.feedEyebrow}</Text>
            <Text style={styles.heading}>{showSaved ? textual.savedHeading : textual.feedHeading}</Text>
        </View>
        <TextInput accessibilityLabel={textual.searchLabel} style={styles.search} value={query} placeholder={textual.searchPlaceholder} onChangeText={(value) => { setQuery(value); setPage(1); }} />
        <FlatList data={visible} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{textual.emptySaved}</Text>} renderItem={({ item }) => { const isSaved = saved.saved.some((entry) => entry.articleId === item.id); const pending = saved.pending.includes(item.id); const note = notes[item.id] ?? saved.saved.find((entry) => entry.articleId === item.id)?.note ?? ""; const savedNote = saved.saved.find((entry) => entry.articleId === item.id)?.note; const save = async () => { if (await readLater.toggle(item.id, note)) setNotes({ ...notes, [item.id]: "" }); }; return <Pressable accessibilityRole="button" accessibilityLabel={`${textual.readArticle}: ${item.title}`} onPress={() => setSelectedArticle(item)} style={styles.card}><Text style={styles.section}>{item.section}  ·  {item.publishedAt}</Text><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.summary}>{item.summary}</Text><Text style={styles.noteLabel}>{textual.noteLabel}</Text><TextInput accessibilityLabel={`${textual.noteLabel}: ${item.title}`} maxLength={20} style={styles.note} value={note} placeholder={textual.notePlaceholder} onChangeText={(value) => setNotes({ ...notes, [item.id]: value })} onPressIn={(event) => event.stopPropagation()} /><Pressable accessibilityRole="button" accessibilityLabel={isSaved ? textual.saved : textual.saveForLater} disabled={pending} style={[styles.button, isSaved && styles.savedButton]} onPress={(event) => { event.stopPropagation(); void save(); }}><Text style={styles.heart}>{"♥"}</Text></Pressable>{savedNote && <Text style={styles.savedNote}>{savedNote}</Text>}</Pressable>; }} ListFooterComponent={visible.length < filtered.length ? <Pressable style={styles.showMore} onPress={() => setPage(page + 1)}><Text style={styles.showMoreText}>{textual.showMore}</Text></Pressable> : null} /></SafeAreaView>;

}

export default ArticleSection;