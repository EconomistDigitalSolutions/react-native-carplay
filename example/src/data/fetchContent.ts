import fetchEditions from "./fetchEditions";
import fetchWeekly from "./fetchWeekly";

const fetchContent = async (path: string, paths: string[]) => {
  const editions = await fetchEditions(paths)
  console.log({ editions })
  const weekly = await fetchWeekly(path)

  return {articles: weekly.articles, items: weekly.items, sections: weekly.sections, editions}
}

export default fetchContent
