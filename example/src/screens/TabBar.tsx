import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CarPlay, ListTemplate, TabBarTemplate } from 'react-native-carplay';
import fetchWeekly from '../data/fetchWeekly'
import { ListSection } from 'react-native-carplay/lib/interfaces/ListSection';
import { ListItem } from 'react-native-carplay/lib/interfaces/ListItem';
import { Part } from '../types/content';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

export function TabBar() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'TabBar'>>()
  const { edition } = params || { id: "/content/f0e872f2ipoun91v1goki0jb4va2v5ei" }

  const navigation = useNavigation();
  const [articles, setArticles] = useState<Part[]>([])
  const [items, setItems] = useState<ListItem[]>([])
  const [sections, setSections] = useState<ListSection[]>([])

  useEffect(() => {
    fetchWeekly(edition.id).then((data) => {
      setSections(data.sections)
      setItems(data.items)
      setArticles(data.articles)
    })
  }, [])

  useEffect(() => {
    const template1 = new ListTemplate({
      sections: sections,
      title: 'Weekly',
      onItemSelect: async ({ index }) => {
        navigation.navigate('NowPlaying', { article: articles[index] })
      }
    });

    const tabBarTemplate = new TabBarTemplate({
      templates: [template1],
      onTemplateSelect(e: any) {
        console.log('selected', e);
      },
    });

    CarPlay.setRootTemplate(tabBarTemplate);

    return () => {};
  }, [articles, items, sections]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TabBar</Text>
    </View>
  );
}

TabBar.navigationOptions = {
  headerTitle: 'TabBar Template',
};
