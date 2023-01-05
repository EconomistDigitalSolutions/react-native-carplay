import { CarPlay, GridTemplate, ListTemplate } from 'react-native-carplay'
import { onAudioPress } from './Article';
import fetchWeekly from '../data/fetchWeekly';
import moment from 'moment'

const JAN07_REF= "/content/j50lppop61q39rnpaienm2hb8r8h68u7"
const DEC24_REF = "/content/f0e872f2ipoun91v1goki0jb4va2v5ei"
const DEC17_REF = "/content/mkl0ncokb3kju08rpusfeptidohkvmcr"
const DEC10_REF = "/content/c6btp3bpqls69m9ivokt8da56jdi2iti"
const DEC03_REF = "/content/5gkcciopitck0ing7tq6ur4fmh2gr75a"
const NOV26_REF = "/content/b12a1v4b9rjhr486lc6aoak121ltmf4n"
const NOV19_REF = "/content/4degdgvqgnu7ttph0h31fbv8rsbaq96o"

export const editionRefs = [
  {
    ref: JAN07_REF,
    date: "2023-01-07",
    image: require('../images/editions/2023-01-07.jpeg')
  },
  {
    ref: DEC24_REF,
    date: "2022-12-24",
    image: require('../images/editions/2022-12-24.jpeg')
    },
  {
    ref: DEC17_REF,
    date: "2022-12-17",
    image: require('../images/editions/2022-12-17.jpeg')
    },
  {
    ref: DEC10_REF,
    date: "2022-12-10",
    image: require('../images/editions/2022-12-10.jpeg')
  },
  {
    ref: DEC03_REF,
    date: "2022-12-03",
    image: require('../images/editions/2022-12-03.jpeg')
  },
  {
    ref: NOV26_REF,
    date: "2022-11-26",
    image: require('../images/editions/2022-11-26.jpeg')
  },
  {
    ref: NOV19_REF,
    date: "2022-11-19",
    image: require('../images/editions/2022-11-19.jpeg')
  },
];

const onEditionPress = async (id) => {
  const weekly = await fetchWeekly(id);

  const templ = new ListTemplate({
    id: `${weekly.datePublished}`,
    sections: weekly.sections,
    title: `Weekly - ${moment(weekly.datePublished).format('MMM Do YYYY')}`,

    async onItemSelect(e) {
      const clickedItem = weekly.items[e.index];
      const article = weekly.articles.find((item) => item.title === clickedItem.text)

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
  CarPlay.pushTemplate(templ)
}

export const editionsTemplate = new GridTemplate({
  id: 'editions',
  trailingNavigationBarButtons: [],
  buttons: editionRefs.map((item, i) => ({
    id: item.ref,
    image: item.image,
    titleVariants: [moment(item.date).format('MMM Do YYYY')],
  })),
  title: 'Editions',
  tabSystemImg: 'books.vertical',
  onButtonPressed(e) {
    onEditionPress(e.id)
  },
})
