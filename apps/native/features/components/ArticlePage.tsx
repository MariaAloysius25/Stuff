import ArticleSection from "./ArticleSection";
import { styles } from "./ArticleSection.styles";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { strings, useArticleList } from "@read-later/core";
import { useState } from "react";
import { useReadLater } from "../context/ReadLaterContext";

/* This component is the main page for the native app, displaying the article list and 
allowing users to switch between the feed and saved views. */
export function ArticlePage() {
    const { api, controller: readLater } = useReadLater();
    const [showSaved, setShowSaved] = useState(false);
    const view = showSaved ? "saved" : "feed";
    const { state } = useArticleList(api, readLater, { view });

    return (
        <SafeAreaView style={styles.screen}>
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
            <ArticleSection view={view} />
        </SafeAreaView>
    );
}