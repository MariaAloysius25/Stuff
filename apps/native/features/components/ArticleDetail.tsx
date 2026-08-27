import { Article, textual } from "@read-later/core";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel={textual.backToStories} onPress={onBack}><Text style={styles.back}>{"<"} {textual.backToStories}</Text></Pressable>
        <Text style={styles.section}>{article.section}  ·  {article.publishedAt}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.summary}>{article.summary}</Text>
        <View style={styles.body}>{article.content.split("\n").map((paragraph) => <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>)}</View>
    </ScrollView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#f4f0e8" }, content: { padding: 24 }, back: { color: "#bd4e32", fontSize: 15, marginBottom: 28 }, section: { color: "#bd4e32", fontSize: 11, fontWeight: "700", textTransform: "uppercase" }, title: { color: "#17221d", fontSize: 32, fontWeight: "700", marginVertical: 14 }, summary: { color: "#65706a", fontSize: 18, lineHeight: 27 }, body: { marginTop: 18 }, paragraph: { color: "#17221d", fontSize: 17, lineHeight: 28, marginBottom: 16 } });
