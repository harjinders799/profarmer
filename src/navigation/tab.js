import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Icon from 'src/components/icon';
import DashboardStack from './dashboardStack';
import LabourStack from './labourStack';
import SettingStack from './settingStack';
import CottonStack from './cottonStack';
import AnimatedTabBar from './animateTab';
import { darkOrange, green, greenDark, skyBlue, white } from '../utils/color';
import { strings } from '../translations/locale';
import { useLang } from '../context/langContext';
import CropStack from './cropStack';
import PickerStack from './pickerStack';
import { isIOS } from '../utils/constant';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const { colors } = useTheme();
  const { lang } = useLang();

  const bottomTabs = [
    {
      id: 1,
      name: 'Picker',
      title: strings.pickers,
      component: PickerStack,
      icon: "flower-poppy",
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: 2,
      name: 'LabourStack',
      title: strings.labour,
      component: LabourStack,
      icon: 'solution1',
    },
    {
      id: 3,
      name: 'CottonStack',
      title: strings.aadhtiya,
      component: CottonStack,
      icon: 'shopping-store',
      iconType: 'Fontisto',
    },
    {
      id: 4,
      name: 'LoanStack',
      title: 'Loan',
      component: CropStack,
      icon: 'sack-percent',
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: 5,
      name: 'SettingStack',
      title: strings.settings,
      component: SettingStack,
      icon: 'setting',
    },
  ];


  return (
    <Tab.Navigator
      // tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: skyBlue,
        tabBarInactiveTintColor: white,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
        tabBarStyle: {
          backgroundColor: darkOrange,
          height: isIOS ? 90 : 50,
        },
        tabBarLabelStyle: {
          fontSize: 18
        }
      }}

    >
      {bottomTabs.map(value => {
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
                    size={22}
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
