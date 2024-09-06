import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'src/components/icon';
import { orange, gray6, white } from '../utils/colors';
import { isIOS } from '../utils/constants';
import { PixelRatio, View } from 'react-native';
import { useTab } from '../context/tabContext';
import { tabsData } from '../utils/helper';
import More from '../screens/more';
import { strings } from '@translations/locale';
import { useLang } from '@context/langContext';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const { tabs } = useTab();
  const { lang } = useLang();

  let data = [...tabs];

  const getComponentByName = useCallback(name => {
    return tabsData.find(tab => tab?.name == name).component;
  }, [lang, tabs]);
  // let isSettingExist = data.slice(0, 4).find(o => o.name === tabsData[3].name)
  // if (!isSettingExist?.name) data.splice(3, 0, tabsData[3])

  return (
    <Tab.Navigator
      // tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: white,
        tabBarInactiveTintColor: gray6,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        // unmountOnBlur: true,
        tabBarStyle: {
          backgroundColor: orange,
          height: isIOS
            ? 90 * PixelRatio.getFontScale()
            : 50 * PixelRatio.getFontScale(),
        },
        tabBarLabelStyle: {
          fontSize: 18,
        },
      }}>
      {Array.isArray(data) &&
        data.slice(0, 5).map((value, i) => {
          return (
            <Tab.Screen
              key={value.id}
              name={value.name}
              component={getComponentByName(value.name)}
              options={{
                title: strings[value?.title],
                tabBarIcon: ({ color }) => {
                  return (
                    <Icon
                      type={value?.iconType}
                      name={value.icon}
                      color={color}
                      size={22 * PixelRatio.getFontScale()}
                    />
                  );
                },
              }}
            />
          );
        })}
    </Tab.Navigator>
  );
}
