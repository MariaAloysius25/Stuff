import React from "react";
import { Article, strings } from "@read-later/core";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
    return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.backToStories} onPress={onBack}><Text style={styles.back}>{"<"} {strings.backToStories}</Text></Pressable>
        <Image source={{ uri: article.imageUrl }} accessibilityLabel={article.imageAlt ?? article.title} style={styles.image} />
        <Text style={styles.section}>{article.section}  ·  {article.publishedAt}</Text>
        <Text accessibilityRole="header" style={styles.title}>{article.title}</Text>
        <Text style={styles.summary}>{article.summary}</Text>
        <View style={styles.body}>{article.content.split("\n").map((paragraph) => <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>)}</View>
    </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#f4f0e8" }, content: { padding: 24 }, back: { color: "#bd4e32", fontSize: 15, marginBottom: 28 }, image: { width: "100%", height: 220, marginBottom: 24 }, section: { color: "#bd4e32", fontSize: 11, fontWeight: "700", textTransform: "uppercase" }, title: { color: "#17221d", fontSize: 32, fontWeight: "700", marginVertical: 14 }, summary: { color: "#65706a", fontSize: 18, lineHeight: 27 }, body: { marginTop: 18 }, paragraph: { color: "#17221d", fontSize: 17, lineHeight: 28, marginBottom: 16 } });
