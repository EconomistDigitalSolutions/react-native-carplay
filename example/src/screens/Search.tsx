
import { CarPlay, ListTemplate, SearchTemplate } from 'react-native-carplay';
import { onAudioPress } from '../App';
import { search } from '../data/search';

let query = ''
let searchResults : any[] = [];

export const searchTemplate = new SearchTemplate({
  async onSearch(q: string) {
    query = q
    return ([]);
  },

  async onItemSelect(e) {
  },

  onSearchButtonPressed() {
    search(query).then((results) => {
      searchResults = results
      CarPlay.pushTemplate(new ListTemplate({
        sections: [{items: searchResults.map((result) => ({text: result.canonical.headline}))}],
        title: `Search Results ${query}`,
        onItemSelect: async ({ index }) => {
          const result = searchResults[index];
          const resultDetails = {
            title: result.canonical?.headline,
            url: result.canonical.audio?.main?.url?.canonical,
            id: result.canonical.id
          }
          onAudioPress(resultDetails)
        }
      }))
    })
  },
});

