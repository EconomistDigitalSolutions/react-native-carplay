import { ListItem } from "react-native-carplay/lib/interfaces/ListItem";
import { ListSection } from "react-native-carplay/lib/interfaces/ListSection";

export interface podcast {
  id: number;
  cover: string;
  title: string;
  summary: string;
  section: string;
  publishDate: Date;
  url: string;
};

const dummyData = [
  {
    id: 1,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_LDD002.jpg',
    title: 'What 2022 meant for the world',
    summary: 'Some years bring disorder, others a resolution. This one asked questions',
    section: 'Leaders',
    publishDate: new Date('2022-12-20'),
    url: 'https://www.economist.com/media-assets/audio/004%20Leaders%20-%20Politics%20and%20economics-f0f8fd266f5532901697b440b65a57c5.mp3',
  },{
    id: 2,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_BRP002.jpg',
    title: 'The children of Britain’s eastern European immigrants are changing the country',
    summary: 'They are an optimistic, confused bunch',
    section: 'By Invitation',
    publishDate: new Date('2022-12-19'),
    url: 'https://www.economist.com/media-assets/audio/036%20Britain%20-%20Immigrants%20and%20their%20children-28623df8f128dce71a9a329eac350aab.mp3',
  },{
    id: 3,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_EUP002.jpg',
    title: 'A Ukrainian city celebrates despite the cold and the Russians',
    summary: 'Festivities will be underground to avoid incoming shells',
    section: 'Europe',
    publishDate: new Date('2022-12-20'),
    url: 'https://www.economist.com/media-assets/audio/030%20Europe%20-%20Christmas%20in%20Kharkiv-998bc19e87616806014d096925d027e0.mp3',
  },{
    id: 4,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_USD001.jpg',
    title: 'Is forced treatment for the mentally ill ever humane?',
    summary: 'Worsening homelessness prompts new mental-health policies in California and New York',
    section: 'United States',
    publishDate: new Date('2022-12-19'),
    url: 'https://www.economist.com/media-assets/audio/011%20United%20States%20-%20Mental%20health-831cb947dbd2f12c6776957172523529.mp3',
  },{
    id: 5,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_WBP001.jpg',
    title: 'Why the Gulf’s oil powers are betting on clean energy',
    summary: 'Aramco, ADNOC and others are placing multibillion-dollar wagers on the energy transition',
    section: 'Business',
    publishDate: new Date('2022-12-19'),
    url: 'https://www.economist.com/media-assets/audio/059%20Business%20-%20The%20energy%20transition-31fdf54cff91a3f0a6feade2e74ad9bc.mp3',
  },{
    id: 6,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_WBP002.jpg',
    title: 'Airlines are closing in on their pre-covid heights',
    summary: 'But a cold winter could dent longer-term optimism',
    section: 'Business',
    publishDate: new Date('2022-12-20'),
    url: 'https://www.economist.com/media-assets/audio/060%20Business%20-%20Air%20travel-c186a98c06873eed60fd04bcc74812da.mp3',
  },{
    id: 7,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_FNP003.jpg',
    title: '2022’s unlikely economic winners',
    summary: 'Which countries performed best and worst this year?',
    section: 'Finance & economics',
    publishDate: new Date('2022-12-18'),
    url: 'https://www.economist.com/media-assets/audio/065%20Finance%20and%20economics%20-%20Top%20of%20the%20charts-f3763e814fd2998f4c33120aa79b9d7f.mp3',
  },{
    id: 8,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_FNP501.jpg',
    title: 'China’s leaders ponder an economy without lockdowns—or crackdowns',
    summary: 'Will market-friendly slogans turn into market-friendly policies?',
    section: 'Finance & economics',
    publishDate: new Date('2022-12-20'),
    url: 'https://www.economist.com/media-assets/audio/066%20Finance%20and%20economics%20-%20After%20the%20pandemic-c7779cce5ccfd79155ef14644624fc7a.mp3',
  },{
    id: 9,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_LDD003.jpg',
    title: 'Our country of the year for 2022 can only be Ukraine',
    summary: 'For the heroism of its people, and for standing up to a bully',
    section: 'Leaders',
    publishDate: new Date('2022-12-20'),
    url: 'https://www.economist.com/media-assets/audio/005%20Leaders%20-%20Country%20of%20the%20year-8b698195a910509387232aab68e3d6c8.mp3',
  },{
    id: 10,
    cover: 'https://www.economist.com/img/b/1424/801/90/media-assets/image/20221224_STD002.jpg',
    title: 'A better way to process encrypted data',
    summary: 'Fully homomorphic encryption is easy if you do it with light',
    section: 'Science & technology',
    publishDate: new Date('2022-12-20'),
    url: 'https://www.economist.com/media-assets/audio/073%20Science%20and%20technology%20-%20Cryptography-9d17cc5c06c9ac9b5fc38967d897fab2.mp3',
  }
];

const dummyFetch = async () => ({
  json: async (): Promise<podcast[]> => dummyData
});

const fetchPodcasts = async () => {
  const response = await dummyFetch();
  const data = await response.json();

  const podcasts = data;

  const sections: ListSection[] = [];

  podcasts.forEach((podcast) => {
    const sectionTitle = podcast.section;
    let sectionIndex = sections.findIndex((s) => s.header === sectionTitle);

    if (sectionIndex === -1) {
      sections.push({
        header: sectionTitle,
        items: []
      });

      sectionIndex = sections.length - 1;
    }

    sections[sectionIndex].items.push({ text: podcast.title });
  })

return { sections, podcasts };
};

export default fetchPodcasts;