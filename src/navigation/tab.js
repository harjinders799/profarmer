import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import Icon from 'src/components/icon';
import DashboardStack from './dashboardStack';
import LabourStack from './labourStack';
import SettingStack from './settingStack';
import CottonStack from './cottonStack';
import AnimatedTabBar from './animateTab';
import {white} from '../utils/color';
import {strings} from '../translations/locale';
import {useLang} from '../context/langContext';
import PickerStack from './pickerStack';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const {colors} = useTheme();
  const {lang} = useLang();

  const bottomTabs = [
    // {
    //     id: 1,
    //     name: 'Home',
    //     title: 'Home',
    //     component: DashboardStack,
    //     icon: "home",
    // },
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
      icon: 'user-secret',
      iconType: 'FontAwesome5',
    },
    {
        id: 4,
        name: 'Picker',
        title: 'Picker',
        component: PickerStack,
        icon: "dashboard",
    },
    {
      id: 5,
      name: 'SettingStack',
      title: strings.settings,
      component: SettingStack,
      icon: 'setting',
    },
  ];
  const bottomTabsEn = [
    // {
    //     id: 1,
    //     name: 'Home',
    //     title: 'Home',
    //     component: DashboardStack,
    //     icon: "home",
    // },
    {
      id: 2,
      name: 'LabourStack',
      title: strings.labour,
      component: LabourStack,
      icon: 'solution1',
    },
    // {
    //     id: 3,
    //     name: 'CottonStack',
    //     title: strings.aadhtiya,
    //     component: CottonStack,
    //     icon: "user-secret",
    //     iconType: 'FontAwesome5'
    // },
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
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.primary + 60,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
      }}>
      {bottomTabs.map(value => {
        return (
          <Tab.Screen
            key={value.id}
            name={value.name}
            component={value.component}
            options={{
              title: value?.title,
              tabBarIcon: () => {
                return (
                  <Icon
                    type={value?.iconType}
                    name={value.icon}
                    color={white}
                    size={30}
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
