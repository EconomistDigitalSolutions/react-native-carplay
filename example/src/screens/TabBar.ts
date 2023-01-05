import { TabBarTemplate, CarPlay } from 'react-native-carplay';
import { searchTemplate } from './Search';

export const tabBarTemplate = new TabBarTemplate({
  id: 'tabbar',
  templates: [],
  onTemplateSelect: (t, {selectedTemplateId}) => {
    if (selectedTemplateId === 'search') {
      CarPlay.pushTemplate(searchTemplate)
    }
   }
});
