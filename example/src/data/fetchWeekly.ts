import { ListItem } from "react-native-carplay/lib/interfaces/ListItem";
import { ListSection } from "react-native-carplay/lib/interfaces/ListSection";
import { Part } from "../types/content";

const fetchWeekly = async (path: string) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var graphql = JSON.stringify({
    query: "query SpecificWeeklyEditionQuery($path: String!) {\n  section: canonical(ref: $path) {\n    ...WeeklyEditionFragment\n  }\n}\n\nfragment WeeklyEditionFragment on Content {\n  id\n  type\n  datePublished\n  image {\n    ...ImageCoverFragment\n  }\n  url {\n    canonical\n  }\n  hasPart(size: 100, sort: \"publication.context.position\") {\n    parts {\n      ...ArticleFragment\n    }\n  }\n}\n\nfragment ArticleFragment on Content {\n  articleSection {\n    internal {\n      id\n      title: headline\n    }\n  }\n  audio {\n    main {\n      id\n      duration(format: \"seconds\")\n      source: channel {\n        id\n      }\n      url {\n        canonical\n      }\n    }\n  }\n  byline\n  dateline\n  dateModified\n  datePublished\n  flyTitle: subheadline\n  id\n  image {\n    ...ImageInlineFragment\n    ...ImageMainFragment\n    ...ImagePromoFragment\n  }\n  print {\n    title: headline\n    flyTitle: subheadline\n    rubric: description\n    section {\n      id\n      title: headline\n    }\n  }\n  publication {\n    id\n    tegID\n    title: headline\n    flyTitle: subheadline\n    datePublished\n    regionsAllowed\n    url {\n      canonical\n    }\n  }\n  rubric: description\n  source: channel {\n    id\n  }\n  tegID\n  text(format: \"json\")\n  title: headline\n  type\n  url {\n    canonical\n  }\n}\n\nfragment ImageCoverFragment on Media {\n  cover {\n    headline\n    width\n    height\n    url {\n      canonical\n    }\n    regionsAllowed\n  }\n}\n\nfragment ImageInlineFragment on Media {\n  inline {\n    url {\n      canonical\n    }\n    width\n    height\n  }\n}\n\nfragment ImageMainFragment on Media {\n  main {\n    url {\n      canonical\n    }\n    width\n    height\n  }\n}\n\nfragment ImagePromoFragment on Media {\n  promo {\n    url {\n      canonical\n    }\n    id\n    width\n    height\n  }\n}",
    variables: { path }
  })

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: graphql
  };

  const response = await fetch("https://content.p.aws.economist.com/graphql", requestOptions)

  const data = await response.json()

  const datePublished = data.data.section.datePublished.substring(0, 10);

  const articles: Part[] = data.data.section.hasPart.parts

  const audioArticles = articles.filter((article) => article.audio?.main)

  const items: ListItem[] = audioArticles.map((article) => ({
    text: article.title
  }))

  const sections: ListSection[] = []

  audioArticles.forEach((article) => {
    const articleSection = article.articleSection?.internal?.length && article.articleSection?.internal?.length > 0 && article.articleSection?.internal[0]

    if (articleSection) {
      const sectionTitle = articleSection.title;
      let sectionIndex = sections.findIndex((s) => s.header === sectionTitle)

      if (sectionIndex === -1) {
        sections.push({
          header: sectionTitle,
          items: []
        })

        sectionIndex = sections.length - 1
      }

      sections[sectionIndex].items.push({
        text: article.title
      })
    }
  })

  return { articles: audioArticles, items, sections, datePublished }
}

export default fetchWeekly
