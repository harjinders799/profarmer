import React, { useEffect } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Icon from 'src/components/icon';
import DashboardStack from './dashboardStack';
import LabourStack from './labourStack';
import SettingStack from './settingStack';
import CottonStack from './cottonStack';
import AnimatedTabBar from './animateTab';
import { darkOrange, greenDark, orange, gray5, yellow, green, white, gray6 } from '../utils/color';
import { strings } from '../translations/locale';
import { useLang } from '../context/langContext';
import CropStack from './cropStack';
import PickerStack from './pickerStack';
import { isIOS } from '../utils/constant';
import { PixelRatio } from 'react-native';
import LoanStack from './loanStack';
import Timeline from '../screens/timeline';
import { useTab } from '../context/tabContext';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const { colors } = useTheme();
  const { lang } = useLang();
  const { tabs} = useTab()
  
  console.log('-------tav-------tab-------')
  return (
    <Tab.Navigator
      // tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: white,
        tabBarInactiveTintColor: gray6,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
        tabBarStyle: {
          backgroundColor: orange,
          height: isIOS ? 90 * PixelRatio.getFontScale() : 50 * PixelRatio.getFontScale(),
        },
        tabBarLabelStyle: {
          fontSize: 18
        }
      }}

    >
      {Array.isArray(tabs) && tabs.slice(0, 4).map(value => {
        return (
          <Tab.Screen
            key={value.id}
            name={value.name}
            component={value.component}
            options={{
              title: value?.title,
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
