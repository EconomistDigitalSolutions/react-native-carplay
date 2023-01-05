import React, { useEffect, useState, useRef } from 'react';
import { Text, View } from 'react-native';
import { CarPlay, ListTemplate, TabBarTemplate, AlertTemplate, NowPlayingTemplate, GridTemplate } from 'react-native-carplay';
import { Part } from './types/content';
import queue from './data/queue';
import fetchContent from './data/fetchContent';

export type RootStackParamList = {
  TabBar: {}
  NowPlaying: { article: Part }
}

const DEC24_REF = "/content/f0e872f2ipoun91v1goki0jb4va2v5ei"
const DEC17_REF = "/content/mkl0ncokb3kju08rpusfeptidohkvmcr"
const DEC10_REF = "/content/c6btp3bpqls69m9ivokt8da56jdi2iti"

const editionRefs = [DEC24_REF, DEC17_REF, DEC10_REF];

const getTabBarTemplates = (editions, articles, sections) => {
  console.log({ sections })
  const homeTab = new ListTemplate({
    id: 'weekly',
    sections: sections,
    title: 'Weekly',
    onItemSelect: async ({ index }) => {
      onArticlePress(articles[index])
    },
    tabSystemImg: 'house'
  })

  const editionsTab = new ListTemplate({
    id: 'editions',
    title: 'Editions',
    // sections: [editions.map((edition) => edition.id)],
    sections: [ { header: "Editions", items: editions.map((edition) => { return { text: edition.date } }) } ],
    onItemSelect: async ({ index }) => {
      console.log('item selected!!!')
      onEditionPress(editions[index])
    },
    tabSystemImg: 'magazine'
  })

  const queueTab = new ListTemplate({
    title: 'Queue',
    sections: [
      {
        items: queue.getQueueItems().map((item) => ({
          text: item.title,
          isPlaying: queue.getCurrentTrack()?.title === item.title
        }))
      }
    ],
    tabSystemImg: 'list.triangle'
  })
  return [homeTab, editionsTab, queueTab]
}

const onEditionPress = async (edition) => {
  const templ = new ListTemplate({
    id: `${edition.date}`,
    sections: edition.sections,
    title: `Weekly - ${edition.date}`,
    onItemSelect: async ({ index }) => {
      onArticlePress(edition.articles[index])
    },
  })

  console.log({ templ })
  console.log('PUSHING!')
  CarPlay.pushTemplate(templ)
}

const onArticlePress = (article: Part) => {
  const articleTitle = article.print?.title || article.title
  const currentAudioTrack = queue.getCurrentTrack()
  const isPlaying = currentAudioTrack?.title === articleTitle

  const alertTemplate = new AlertTemplate({
    titleVariants: [ article.title],
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

      switch(id) {
        case 'play': {
          if (article.audio?.main?.url?.canonical) {
            queue.play({
              id: article.tegID,
              title: article.print?.title || article.title,
              url: article.audio?.main?.url?.canonical
            })
          }
          CarPlay.dismissTemplate();

          // CarPlay.pushTemplate(new NowPlayingTemplate({
          //   albumArtistButton: false,
          //   upNextTitle: 'Next',
          //   upNextButton: false
          // }), true)

          break;
        }
        case 'stop': {
          if (article.audio?.main?.url?.canonical) {
            queue.stop()
          }

          CarPlay.dismissTemplate();
          break;
        }
        case 'queue': {
          if (article.audio?.main?.url?.canonical) {
            queue.add({
              id: article.tegID,
              title: article.print?.title || article.title,
              url: article.audio?.main?.url?.canonical
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

const TabBar = (ref: React.MutableRefObject<TabBarTemplate | undefined>) => {
  const tabBarTemplate = new TabBarTemplate({
    templates: [],
    onTemplateSelect: () => {}
  });

  ref.current = tabBarTemplate

  CarPlay.setRootTemplate(tabBarTemplate);
}

export const App = () => {
  const [carPlayConnected, setCarPlayConnected] = useState(CarPlay.connected);
  const tabBarRef = useRef<TabBarTemplate | undefined>()

  useEffect(() => {
    function onConnect() {
      setCarPlayConnected(true);
    }

    function onDisconnect() {
      setCarPlayConnected(false);
    }

    CarPlay.registerOnConnect(onConnect);
    CarPlay.registerOnDisconnect(onDisconnect);

    return () => {
      CarPlay.unregisterOnConnect(onConnect);
      CarPlay.unregisterOnDisconnect(onDisconnect);
    };
  });

  useEffect(() => {
    fetchContent(DEC24_REF, editionRefs).then(({ articles, sections, editions }) => {
      const templates = getTabBarTemplates(editions, articles, sections)

      tabBarRef.current?.updateTemplates({
        templates,
        onTemplateSelect: () => {}
      });

      queue.addListener(() => {
        console.log({listeners: queue.getListeners()})

        const currentAudioTrack = queue.getCurrentTrack();

        sections.forEach((section) => {
          section.items.forEach((article) => {
            if (currentAudioTrack?.title === article.text) {
              article.isPlaying = true
            } else {
              article.isPlaying = false
            }
          })
        })

        const templates = getTabBarTemplates(editions, articles, sections)

        tabBarRef.current?.updateTemplates({
          templates,
          onTemplateSelect: () => {}
        });
      })
    })

    TabBar(tabBarRef)

    CarPlay.enableNowPlaying(true);
  }, [])

  return carPlayConnected ? (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Car Play in progress</Text>
    </View>
  ) : (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Please connect Car Play and open the test app</Text>
    </View>
  );
};
