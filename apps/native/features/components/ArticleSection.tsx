import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Article, textual, useArticleList } from "@read-later/core";
import { ArticleDetail } from "./ArticleDetail";
import { styles } from "./ArticleSection.styles";
import { useReadLater } from "../context/ReadLaterContext";

const ArticleSection = () => {
    const { api, controller: readLater } = useReadLater();
    const [showSaved, setShowSaved] = useState(false);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const { query, setQuery, page, setPage, state, displayedList, filteredList } = useArticleList(api, readLater, showSaved ? "saved" : "feed");

    if (selectedArticle) return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;

    return <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.overline}>{textual.brand}</Text>
            <Text accessibilityRole="header" style={styles.title}>{textual.pageTitle}</Text>
            <View style={styles.tabs}>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: !showSaved }} accessibilityLabel={textual.allStories} onPress={() => setShowSaved(false)}>
                    <Text style={!showSaved ? styles.activeTab : styles.tab}>{textual.allStories}</Text>
                </Pressable>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: showSaved }} accessibilityLabel={textual.savedTab} onPress={() => setShowSaved(true)}>
                    <Text style={showSaved ? styles.activeTab : styles.tab}>{textual.savedTab} ({state.saved.length})</Text>
                </Pressable>
            </View>
        </View>
        {state.error && <View accessibilityRole="alert" style={styles.notice}><Text style={styles.error}>{state.error}.</Text><Pressable accessibilityRole="button" accessibilityLabel={textual.dismiss} onPress={() => readLater.clearError()}><Text style={styles.dismiss}>{textual.dismiss}</Text></Pressable></View>}
        <View style={styles.intro}>
            <Text style={styles.eyebrow}>{showSaved ? textual.savedEyebrow : textual.feedEyebrow}</Text>
            <Text accessibilityRole="header" style={styles.heading}>{showSaved ? textual.savedHeading : textual.feedHeading}</Text>
        </View>
        <TextInput accessibilityRole="search" accessibilityLabel={textual.searchLabel} style={styles.search} value={query} placeholder={textual.searchPlaceholder} onChangeText={(value) => setQuery(value)} />
        <FlatList accessibilityRole="list" data={displayedList} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={
            <Text style={styles.empty}>{textual.emptySaved}</Text>} renderItem={({ item }) => {
                const isSaved = state.saved.some((entry) => entry.articleId === item.id);
                const pending = state.pending.includes(item.id);
                const note = notes[item.id] ?? state.saved.find((entry) => entry.articleId === item.id)?.note ?? "";
                const savedNote = state.saved.find((entry) => entry.articleId === item.id)?.note;
                const save = async () => {
                    if (await readLater.toggle(item.id, note))
                        setNotes((current) => ({ ...current, [item.id]: "" }));
                };

                return <View style={styles.card}>
                    <Image source={{ uri: item.imageUrl }} accessibilityLabel={item.imageAlt ?? item.title} style={styles.cardImage} />
                    <Text style={styles.section}>{item.section}  ·  {item.publishedAt}</Text>
                    <Pressable accessibilityRole="button" accessibilityLabel={`${textual.readArticle}: ${item.title}`} onPress={() => setSelectedArticle(item)}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </Pressable>
                    <Text style={styles.summary}>{item.summary}</Text>
                    <Text style={styles.noteLabel}>{textual.noteLabel}</Text>
                    <TextInput accessibilityLabel={`${textual.noteLabel}: ${item.title}`} maxLength={20} style={styles.note} value={note} placeholder={textual.notePlaceholder} onChangeText={(value) => setNotes((current) => ({ ...current, [item.id]: value }))} />
                    <Pressable accessibilityRole="button" accessibilityLabel={isSaved ? textual.saved : textual.saveForLater} accessibilityState={{ checked: isSaved }} disabled={pending} style={[styles.button, isSaved && styles.savedButton]} onPress={() => void save()}>
                        <Text accessibilityElementsHidden style={styles.heart}>{"♥"}</Text>
                    </Pressable>
                    {savedNote && <Text style={styles.savedNote}>{savedNote}</Text>}
                </View>;
            }}

            ListFooterComponent={displayedList.length < filteredList.length ?
                <Pressable accessibilityRole="button" style={styles.showMore} onPress={() => setPage(page + 1)}>
                    <Text style={styles.showMoreText}>{textual.showMore}</Text></Pressable> : null} />
    </SafeAreaView>;
}

export default ArticleSection;