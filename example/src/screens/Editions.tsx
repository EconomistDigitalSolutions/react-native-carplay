import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CarPlay, GridTemplate, TabBarTemplate } from 'react-native-carplay';
import fetchEditions from '../data/fetchEditions'
import { GridButton } from 'react-native-carplay/lib/interfaces/GridButton';

const DEC24_REF = "/content/f0e872f2ipoun91v1goki0jb4va2v5ei"
const DEC17_REF = "/content/mkl0ncokb3kju08rpusfeptidohkvmcr"
const DEC10_REF = "/content/c6btp3bpqls69m9ivokt8da56jdi2iti"

const editionRefs = [DEC24_REF, DEC17_REF, DEC10_REF]

export function Editions() {
  const navigation = useNavigation();
  const [editions, setEditions] = useState<GridButton[]>([])

  useEffect(() => {
    fetchEditions(editionRefs).then((data) => {
      setEditions(data)
    })
  }, [])

  useEffect(() => {
    const template1 = new GridTemplate({
      buttons: [],
      title: 'Weekly',
      onButtonPressed: async ({ index }) => {
        navigation.navigate('TabBar', { edition: editions[index] })
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
  }, [editions]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>TabBar</Text>
    </View>
  );
}

Editions.navigationOptions = {
  headerTitle: 'Editions Template',
};
