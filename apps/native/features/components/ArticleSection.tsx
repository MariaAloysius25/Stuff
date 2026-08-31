import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Article, strings, useArticleList } from "@read-later/core";
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
            <Text accessibilityRole="header" style={styles.overline}>{strings.brand}</Text>
            <Text accessibilityRole="header" style={styles.title}>{strings.pageTitle}</Text>
            <View style={styles.tabs}>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: !showSaved }} accessibilityLabel={strings.allStories} onPress={() => setShowSaved(false)}>
                    <Text style={!showSaved ? styles.activeTab : styles.tab}>{strings.allStories}</Text>
                </Pressable>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: showSaved }} accessibilityLabel={strings.savedTab} onPress={() => setShowSaved(true)}>
                    <Text style={showSaved ? styles.activeTab : styles.tab}>{strings.savedTab} ({state.saved.length})</Text>
                </Pressable>
            </View>
        </View>
        {state.error && <View accessibilityRole="alert" style={styles.notice}><Text style={styles.error}>{state.error}.</Text><Pressable accessibilityRole="button" accessibilityLabel={strings.dismiss} onPress={() => readLater.clearError()}><Text style={styles.dismiss}>{strings.dismiss}</Text></Pressable></View>}
        <View style={styles.intro}>
            <Text style={styles.eyebrow}>{showSaved ? strings.savedEyebrow : strings.feedEyebrow}</Text>
            <Text accessibilityRole="header" style={styles.heading}>{showSaved ? strings.savedHeading : strings.feedHeading}</Text>
        </View>
        <TextInput accessibilityRole="search" accessibilityLabel={strings.searchLabel} style={styles.search} value={query} placeholder={strings.searchPlaceholder} onChangeText={(value) => setQuery(value)} />
        <FlatList accessibilityRole="list" data={displayedList} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={
            <Text style={styles.empty}>{strings.emptySaved}</Text>} renderItem={({ item }) => {
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
                    <Pressable accessibilityRole="button" accessibilityLabel={`${strings.readArticle}: ${item.title}`} onPress={() => setSelectedArticle(item)}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                    </Pressable>
                    <Text style={styles.summary}>{item.summary}</Text>
                    <Text style={styles.noteLabel}>{strings.noteLabel}</Text>
                    <TextInput accessibilityLabel={`${strings.noteLabel}: ${item.title}`} maxLength={20} style={styles.note} value={note} placeholder={strings.notePlaceholder} onChangeText={(value) => setNotes((current) => ({ ...current, [item.id]: value }))} />
                    <Pressable accessibilityRole="button" accessibilityLabel={isSaved ? strings.saved : strings.saveForLater} accessibilityState={{ checked: isSaved }} disabled={pending} style={[styles.button, isSaved && styles.savedButton]} onPress={() => void save()}>
                        <Text accessibilityElementsHidden style={styles.heart}>{"♥"}</Text>
                    </Pressable>
                    {savedNote && <Text style={styles.savedNote}>{savedNote}</Text>}
                </View>;
            }}

            ListFooterComponent={displayedList.length < filteredList.length ?
                <Pressable accessibilityRole="button" style={styles.showMore} onPress={() => setPage(page + 1)}>
                    <Text style={styles.showMoreText}>{strings.showMore}</Text></Pressable> : null} />
    </SafeAreaView>;
}

export default ArticleSection;