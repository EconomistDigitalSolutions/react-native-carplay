import fetchEditions from "./fetchEditions";
import fetchWeekly from "./fetchWeekly";

const fetchContent = async (weeklyPath: string, editionPaths: string[]) => {
  const editions = await fetchEditions(editionPaths)
  console.log({ editions })
  const weekly = await fetchWeekly(weeklyPath)

  return {articles: weekly.articles, items: weekly.items, sections: weekly.sections, editions}
}

export default fetchContent
