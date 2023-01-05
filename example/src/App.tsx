import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CarPlay } from 'react-native-carplay';
import queue from './data/queue';
import { tabBarTemplate } from './screens/TabBar';
import { editionsTemplate } from './screens/Editions';
import { homeTemplate } from './screens/Home';
import { queueTemplate } from './screens/Queue';
import { searchPlacholderTemplate } from './screens/Search';

export const App = () => {
  const [carPlayConnected, setCarPlayConnected] = useState(CarPlay.connected);

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
    tabBarTemplate.updateTemplates({
      templates: [homeTemplate, editionsTemplate, queueTemplate, searchPlacholderTemplate],
      onTemplateSelect: () => { }
    });

    queue.addListener(() => {
      queueTemplate.updateSections([
        {
          items: [
            ...(queue.getCurrentTrack() ? [{
              text: queue.getCurrentTrack()?.title,
              isPlaying: true
            }] : []),
            ...queue.getQueueItems().filter((item) => {
              return item.title !== queue.getCurrentTrack()?.title
            }).map((item) => ({
            text: item.title,
            isPlaying: queue.getCurrentTrack()?.title === item.title
          }))]
        }
      ])
    })

    CarPlay.setRootTemplate(tabBarTemplate);
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
