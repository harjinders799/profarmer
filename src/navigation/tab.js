import React, { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'src/components/icon';
import { orange, gray6, white } from '../utils/colors';
import { isIOS } from '../utils/constants';
import { PixelRatio, View } from 'react-native';
import { useTab } from '../context/tabContext';
import { hideTabScreens, tabsData } from '../utils/helper';
import More from '../screens/more';
import { strings } from '@translations/locale';
import { useLang } from '@context/langContext';
import { normalize } from '@utils/fonts';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const { tabs } = useTab();
  const { lang } = useLang();

  let data = [...tabs];

  const getComponentByName = useCallback(
    name => {
      return tabsData.find(tab => tab?.name == name).component;
    },
    [lang, tabs],
  );
  // let isSettingExist = data.slice(0, 4).find(o => o.name === tabsData[3].name)
  // if (!isSettingExist?.name) data.splice(3, 0, tabsData[3])

  return (
    <Tab.Navigator
      // tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={({ navigation }) => {
        const state = navigation.getState();

        // Check if the state has nested navigators (like a stack inside a tab)
        const currentStackState = state?.routes?.find(
          route => route.state,
        )?.state; // Access the nested state of the active stack navigator

        // Get the current screen name from the nested stack navigator
        const currentScreenName =
          currentStackState?.routes[currentStackState.index]?.name;

        return {
          tabBarActiveTintColor: white,
          tabBarInactiveTintColor: gray6,
          headerShown: false,
          tabBarAllowFontScaling: false,
          tabBarHideOnKeyboard: true,
          // unmountOnBlur: true,
          tabBarStyle: {
            backgroundColor: orange,
            height: isIOS
              ? 90 * PixelRatio.getFontScale()
              : 50 * PixelRatio.getFontScale(),
            display: hideTabScreens.includes(currentScreenName)
              ? 'none'
              : 'flex',
          },
        };
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
                tabBarLabelStyle: { width: '100%', fontSize: normalize(14), },
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
