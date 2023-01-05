import { CarPlay, AlertTemplate} from 'react-native-carplay'
import queue, { AudioTrack } from "../data/queue";

export const onAudioPress = (audioTrack: AudioTrack) => {
  const currentAudioTrack = queue.getCurrentTrack()
  const isPlaying = currentAudioTrack?.title === audioTrack.title

  const alertTemplate = new AlertTemplate({
    titleVariants: [ audioTrack.title],
    actions: [
      isPlaying ? {
        id: 'stop',
        title: 'Stop'
      } : {
        id: 'play',
        title: 'Play'
      },
      {
        id: 'queue',
        title: 'Queue'
      },
      {
        id: 'cancel',
        title: 'Cancel'
      }
    ],
    onActionButtonPressed: ({ id }) => {
      switch (id) {
        case 'play': {
          if (audioTrack.url) {
            queue.play({
              id: audioTrack.id,
              title: audioTrack.title,
              url: audioTrack.url
            })
          }

          CarPlay.dismissTemplate();

          break;
        }
        case 'stop': {
          if (audioTrack.url) {
            queue.stop()
          }

          CarPlay.dismissTemplate();
          break;
        }
        case 'queue': {
          if (audioTrack.url) {
            queue.add({
              id: audioTrack.id,
              title: audioTrack.title,
              url: audioTrack.url
            })
          }

          CarPlay.dismissTemplate();
          break;
        }
        case 'cancel': {
          CarPlay.dismissTemplate();
          break;
        }
        default:
      }
    }
  });

  CarPlay.presentTemplate(alertTemplate);
}
