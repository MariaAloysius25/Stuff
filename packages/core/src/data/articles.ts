import { Article } from "../types/article.type";

const featuredArticles: Article[] = [
  {
    id: "signal",
    title: "The quiet return of the personal computer",
    summary: "Why focused, local-first tools are finding a new audience.",
    content:
      "The most interesting technology shift is not always the loudest one. Across studios, homes, and small teams, people are choosing tools that keep their work close, calm, and understandable. This is the beginning of a longer story about making room for concentration.",
    publishedAt: "2026-08-24",
    imageUrl: "https://picsum.photos/seed/signal/640/360",
    section: "Technology",
  },
  {
    id: "tide",
    title: "A field guide to slower cities",
    summary:
      "What walking, sitting, and looking closely can teach us about place.",
    content:
      "A city reveals itself at walking pace. The overlooked details become visible: the bench that catches afternoon light, the grocer who knows every regular, and the route home that changes with the weather.",
    publishedAt: "2026-08-22",
    imageUrl: "https://picsum.photos/seed/tide/640/360",
    section: "Culture",
  },
  {
    id: "common",
    title: "The new commons is a small room",
    summary:
      "Libraries, studios, and cafes are becoming essential civic infrastructure.",
    content:
      "The places that hold a neighborhood together are often modest. A library table, a community kitchen, or a shared studio can offer something increasingly rare: a reason to be together without needing to buy anything.",
    publishedAt: "2026-08-19",
    imageUrl: "https://picsum.photos/seed/common/640/360",
    section: "Ideas",
  },
  {
    id: "orbit",
    title: "Designing for the attention we actually have",
    summary: "A practical case for humane defaults in an always-on world.",
    content:
      "Good products respect the shape of a day. They make the next useful action obvious, reduce unnecessary interruption, and let people leave without losing their place. Humane design starts with accepting that attention is finite.",
    publishedAt: "2026-08-17",
    imageUrl: "https://picsum.photos/seed/orbit/640/360",
    section: "Design",
  },
  {
    id: "harbor",
    title: "The cooks preserving a disappearing coastline",
    summary: "Recipes can be maps, memories, and a form of climate record.",
    content:
      "Along the coast, recipes carry more than flavor. They remember the fish once found in a particular cove, the herbs that grew behind a house, and the seasons that are becoming harder to predict.",
    publishedAt: "2026-08-14",
    imageUrl: "https://picsum.photos/seed/harbor/640/360",
    section: "Food",
  },
  {
    id: "after",
    title: "What happens after the big launch",
    summary: "The unglamorous operating habits behind products that endure.",
    content:
      "Enduring products are shaped after the announcement. Teams watch what people actually do, repair the small frictions, and build habits that make quality repeatable long after the spotlight has moved on.",
    publishedAt: "2026-08-11",
    imageUrl: "https://picsum.photos/seed/after/640/360",
    section: "Work",
  },
];

export const articles: Article[] = [
  ...featuredArticles,
  ...Array.from({ length: 24 }, (_, index) => {
    const number = index + 7;
    return {
      id: `story-${number}`,
      title: `A closer look at the everyday future, part ${number}`,
      summary:
        "A thoughtful dispatch on the choices, habits, and places shaping life around us.",
      content:
        "Everyday life is shaped by small decisions that rarely make headlines. This dispatch follows the people and practices turning those decisions into a more considered future.",
      publishedAt: `2026-07-${String(30 - index).padStart(2, "0")}`,
      imageUrl: `https://picsum.photos/seed/story-${number}/640/360`,
      section: ["Ideas", "Culture", "Design", "Work"][index % 4],
    };
  }),
];
