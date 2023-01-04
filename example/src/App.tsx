import React, { useEffect, useState, useRef } from 'react';
import { Text, View } from 'react-native';
import { CarPlay, InformationTemplate, ListTemplate, TabBarTemplate, AlertTemplate, NowPlayingTemplate } from 'react-native-carplay';
import { Part } from './types/content';
import fetchWeekly from './data/fetchWeekly';
import SoundPlayer from 'react-native-sound-player';
import queue from './data/queue';

export type RootStackParamList = {
  TabBar: undefined;
  NowPlaying: { article: Part }
}

const DEC24_REF = "/content/f0e872f2ipoun91v1goki0jb4va2v5ei"
const DEC17_REF = "/content/mkl0ncokb3kju08rpusfeptidohkvmcr"
const DEC10_REF = "/content/c6btp3bpqls69m9ivokt8da56jdi2iti"

const getTabBarTemplates = (articles, sections) => {
  const homeTab = new InformationTemplate({
    title: 'Home',
    items: [],
    actions: [],
    onActionButtonPressed: () => {},
    tabTitle: 'Home',
    tabSystemImg: 'house'
  })

  const weeklyTab = new ListTemplate({
    id: 'weekly',
    sections: sections,
    title: 'Weekly',
    onItemSelect: async ({ index }) => {
      onArticlePress(articles[index])
      // NowPlaying(articles[index])
    },
    tabTitle: 'Weekly',
    tabSystemImg: 'magazine'
  });

  const queueTab = new ListTemplate({
    title: 'Queue',
    sections: [
      {
        items: queue.getQueueItems().map((item) => ({
          text: item.title
        }))
      }
    ],
    tabTitle: 'Queue',
    tabSystemImg: 'list.triangle'
  })

  const searchTab = new InformationTemplate({
    title: 'Search',
    items: [],
    actions: [],
    onActionButtonPressed: () => {},
    tabTitle: 'Search',
    tabSystemImg: 'magnifyingglass'
  })

  return [homeTab, weeklyTab, queueTab, searchTab]
}

const onArticlePress = (article: Part) => {
  const alertTemplate = new AlertTemplate({
    titleVariants: [ article.title],
    actions: [
      {
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
          // if (article.audio?.main?.url?.canonical) {
          //   SoundPlayer.playUrl(article.audio?.main?.url?.canonical)
          // }

          // CarPlay.dismissTemplate();
          break;
        }
        case 'queue': {
          queue.add({
            id: article.tegID,
            title: article.title,
            url: article.audio?.main?.url?.canonical
          })
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
    fetchWeekly(DEC24_REF).then(({ articles, sections }) => {
      const templates = getTabBarTemplates(articles, sections)

      tabBarRef.current?.updateTemplates({
        templates,
        onTemplateSelect: () => {}
      });

      queue.addListener(() => {
        const templates = getTabBarTemplates(articles, sections)

        tabBarRef.current?.updateTemplates({
          templates,
          onTemplateSelect: () => {}
        });
      })
    })

    TabBar(tabBarRef)

    CarPlay.enableNowPlaying();
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
