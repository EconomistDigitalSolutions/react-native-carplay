import { CarPlay, GridTemplate, ListTemplate, InformationTemplate } from 'react-native-carplay'
import { onAudioPress } from './Article';
import fetchData from '../data/fetchData'
import queue from '../data/queue'
import { searchTemplate } from './Search'
import { editionRefs } from './Editions';

const HOME_TAB_DATA = [
  {
    id: '/content/g4qu1flbgau1di0dvenri74a2pdelkko',
    title: 'Morning Briefing',
    image: require('../images/mb.png')
  },
  {
    id: '/content/79244csej12lltat5mgqtckdp41aagcj',
    title: 'Business',
    image: require('../images/business.png')
  },
  {
    id: editionRefs[0].ref,
    title: 'Weekly',
    image: require('../images/e.png')
  },
  {
    id: '/content/omi23dr8h15h8c33t2gkb2cju8ap758o',
    title: 'Podcasts',
    image: require('../images/podcasts.png')
  },
  {
    id: '/content/h4u9v391l483f78oe4pku4pu3jsqgj9k',
    title: 'Finance',
    image: require('../images/f&e.png')
  },
  {
    id: '/content/2ldk64u3gt7tku874lf6kfi40e2nvts6',
    title: 'Britain',
    image: require('../images/britain.png')
  },
  {
    id: '/content/rvj2s19g2lkbek4tevm6sn1va1se84sl',
    title: 'Culture',
    image: require('../images/culture.png')
  },
  {
    id: '/content/rak941tjj66itoj6cbc8e8nb40kuij19',
    title: 'International',
    image: require('../images/int.png')
  },
  {
    id: '/content/ig92fd080i1j2q35gel3sev1e8r72j9r',
    title: 'Briefing',
    image: require('../images/briefing.jpeg')
  },
]

const onHomeItemPress = async (data) => {
  const { items, articles, sections } = await fetchData(data.id)

  const pageTemplate = new ListTemplate({
    sections: sections.length > 1 ? sections : [{
      header: '',
      items
    }],
    title: data.title,
    async onItemSelect(e) {
      const clickedItem = items[e.index];
      const article = articles.find((item) => item.title === clickedItem.text)

      if (article) {
        const articleDetails = {
          title: article.title,
          url: article.audio?.main?.url?.canonical || '',
          id: article.tegID
        }
        onAudioPress(articleDetails)
      };
    },
  })

  CarPlay.pushTemplate(pageTemplate);
}

export const homeTemplate = new GridTemplate({
  id: 'home',
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
