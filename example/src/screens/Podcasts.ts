import { ListTemplate} from 'react-native-carplay'
import { onAudioPress } from './Article'

export const getPodcastsTemplate = (podcastsRef) => new ListTemplate({
  id: 'podcasts',
  title: 'Podcasts',
  sections: [],
  onItemSelect: async ({ index }) => {
    onAudioPress(podcastsRef.current.podcasts[index])
  },
  tabSystemImg: 'beats.headphones'
})
