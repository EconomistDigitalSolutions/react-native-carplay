import { ListTemplate } from 'react-native-carplay'
import { onAudioPress } from './Article';

export const getWeeklyTemplate = (articlesRef) => new ListTemplate({
  id: 'weekly',
  sections: [],
  title: 'Weekly',
  onItemSelect: async ({ index }) => {
    const article = articlesRef.current.articles[index]
    const audioTrack = {
      id: article.tegID,
      title: article.title,
      url: article.audio?.main?.url?.canonical
    }
    onAudioPress(audioTrack)
  },
  tabSystemImg: 'magazine'
});
