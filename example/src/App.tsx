import React, { useEffect, useState, useRef } from 'react';
import { Text, View } from 'react-native';
import { CarPlay, InformationTemplate, ListTemplate, TabBarTemplate, AlertTemplate, NowPlayingTemplate, GridTemplate } from 'react-native-carplay';
import { Part, BlogType, CollectionType } from './types/content';
import fetchWeekly from './data/fetchWeekly';
import fetchData from './data/fetchData';
import { searchTemplate } from './screens/Search';
import queue, { AudioTrack } from './data/queue';
import fetchPodcasts from './data/fetchPodcasts';
import { GridButton } from 'react-native-carplay/lib/interfaces/GridButton';
import fetchContent from './data/fetchContent';
import { waitForDebugger } from 'inspector';

export type RootStackParamList = {
  TabBar: {}
  NowPlaying: { article: Part }
}

const DEC24_REF = "/content/f0e872f2ipoun91v1goki0jb4va2v5ei"
const DEC17_REF = "/content/mkl0ncokb3kju08rpusfeptidohkvmcr"
const DEC10_REF = "/content/c6btp3bpqls69m9ivokt8da56jdi2iti"
const HOME_TAB_DATA = [
  {
    id: '/content/omi23dr8h15h8c33t2gkb2cju8ap758o',
    title: 'Podcasts',
    image: require('./images/e.png')
  },
  {
    id: '/content/g4qu1flbgau1di0dvenri74a2pdelkko',
    title: 'Morning Briefing',
    image: require('./images/mb.png')
  },
  {
    id: '/content/79244csej12lltat5mgqtckdp41aagcj',
    title: 'Business',
    image: require('./images/business.png')
  },
  {
    id: '/content/i-dont-know-the-id',
    title: 'Finance',
    image: require('./images/f&e.png')
  },
  {
    id: '/content/i-dont-know-the-id',
    title: 'International',
    image: require('./images/int.png')
  },
  {
    id: '/content/i-dont-know-the-id',
    title: 'Culture',
    image: require('./images/culture.png')
  },
  {
    id: '/content/i-dont-know-the-id',
    title: 'Britain',
    image: require('./images/britain.png')
  },
  {
    id: '/content/i-dont-know-the-id',
    title: 'Briefing',
    image: require('./images/briefing.jpeg')
  },
]
const editionRefs = [DEC24_REF, DEC17_REF, DEC10_REF];


const getTabBarTemplates = (weeklyData, podcastData) => {
  const homeTab = new GridTemplate({
    trailingNavigationBarButtons: [],
    buttons: HOME_TAB_DATA.map((item, i) => ({
      id: item.id,
      image: item.image,
      titleVariants: [item.title],
    })),
    title: 'Home',
    tabSystemImg: 'house',
    onButtonPressed(e) {
      const data = HOME_TAB_DATA.find((item) => item.id === e.id)
      onHomeItemPress(data)
    },
  })

  let editionsTab: any = null;

  editionsTab = new GridTemplate({
    title: 'Editions',
    buttons: [weeklyData.editions],
    onButtonPressed: async ({ index }) => {
      onEditionPress(weeklyData.editions[index])
    },
    tabSystemImg: 'magazine'
  })

  const podcastTab = new ListTemplate({
    title: 'Podcasts',
    sections: podcastData.sections,
    onItemSelect: async ({ index }) => {
      onAudioPress(podcastData.podcasts[index])
    },
    tabSystemImg: 'list.triangle'
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
    onItemSelect: async ({ index }) => {
      const article = weeklyData.articles[index]
      const articleDetails = {
        title: article.print?.title || article.title,
        url: article.audio?.main?.url?.canonical,
        id: article.tegID
      }
      onAudioPress(articleDetails)
    },
    tabSystemImg: 'list.triangle'
  })

  const searchTab = new InformationTemplate({
    title: 'Search',
    items: [],
    actions: [{id: 'search', title: 'search'}],
    onActionButtonPressed: () => {
      CarPlay.pushTemplate(searchTemplate)
    },
    tabSystemImg: 'magnifyingglass'
  })

  return [homeTab, weeklyTab, podcastTab, queueTab, searchTab]
}

const onEditionPress = async (edition: GridButton) => {
  const weekly = await fetchWeekly(edition.id);

  new ListTemplate({
    id: 'weekly',
    sections: weekly.sections,
    title: 'Weekly',
    onItemSelect: async ({ index }) => {
      onArticlePress(weekly.articles[index])
    },
    tabSystemImg: 'house'
  })
}

const onHomeItemPress = async (data) => {
  const { items, articles } = await fetchData(data.id)

  const pageTemplate = new ListTemplate({
    sections: [
      {
        items: items.map((item) => ({
          text: item.text,
          isPlaying: queue.getCurrentTrack()?.title === item.text
        }))
      }
    ],
    title: data.title,
    async onItemSelect(e) {
      const clickedItem = items[e.index];
      const article = articles.find((item) => item.title === clickedItem.text)

      if (article) {
        const articleDetails = {
          title: article.print?.title || article.title,
          url: article.audio?.main?.url?.canonical || '',
          id: article.tegID
        }
        onAudioPress(articleDetails)
      };
    },
  })

  CarPlay.pushTemplate(pageTemplate);
}

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

const TabBar = (tabBarRef: React.MutableRefObject<TabBarTemplate | undefined>) => {
  const tabBarTemplate = new TabBarTemplate({
    templates: [],
    onTemplateSelect: () => { }
  });

  tabBarRef.current = tabBarTemplate

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
    Promise.all([fetchContent(DEC24_REF, editionRefs), fetchPodcasts()]).then(([weeklyData, podcastData]) => {
      const templates = getTabBarTemplates(weeklyData, podcastData);

      tabBarRef.current?.updateTemplates({
        templates,
        onTemplateSelect: () => { }
      });

      queue.addListener(() => {
        const currentAudioTrack = queue.getCurrentTrack();

        weeklyData.sections.forEach((section) => {
          section.items.forEach((article) => {
            if (currentAudioTrack?.title === article.text) {
              article.isPlaying = true
            } else {
              article.isPlaying = false
            }
          })
        })

        const templates = getTabBarTemplates(weeklyData, podcastData)

        tabBarRef.current?.updateTemplates({
          templates,
          onTemplateSelect: () => { }
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
