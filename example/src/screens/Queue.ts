import { ListTemplate} from 'react-native-carplay'
import queue from "../data/queue"
import { onAudioPress } from './Article'

export const queueTemplate = new ListTemplate({
  id: 'queue',
  title: 'Queue',
  sections: [
    {
      items: [
        ...(queue.getCurrentTrack() ? [{
          text: queue.getCurrentTrack()?.title,
          isPlaying: true
        }] : []),
        ...queue.getQueueItems().filter((item) => {
          return item.title !== queue.getCurrentTrack()?.title
        }).map((item) => ({
        text: item.title,
        isPlaying: queue.getCurrentTrack()?.title === item.title
      }))]
    }
  ],
  onItemSelect: async ({ index }) => {
    const currentAudioTrack = queue.getCurrentTrack();

    const audioTracks = queue.getQueueItems()

    let audioTrack;

    if (!currentAudioTrack) {
      audioTrack = audioTracks[index]
    } else if (index === 0) {
      audioTrack = currentAudioTrack
    } else {
      audioTrack = audioTracks[index - 1]
    }

    onAudioPress(audioTrack)
  },
  tabSystemImg: 'list.triangle'
})
