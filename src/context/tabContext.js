import React from 'react';
import {getAsyncStorage, setAsyncStorage} from 'src/network/AsyncStorage';
import {strings} from 'src/translations/locale';
import PickerStack from '../navigation/pickerStack';
import LabourStack from '../navigation/labourStack';
import CottonStack from '../navigation/cottonStack';
import LoanStack from '../navigation/loanStack';
import SettingStack from '../navigation/settingStack';
import Timeline from '../screens/timeline';

const initialState = {
  tabs: [
    {
      id: 1,
      name: 'Picker',
      title: strings.pickers,
      component: PickerStack,
      icon: 'flower-poppy',
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: 2,
      name: 'Timeline',
      title: strings.timeline,
      component: Timeline,
      icon: 'timeline-text',
      iconType: 'MaterialCommunityIcons',
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
      name: 'SettingStack',
      title: strings.settings,
      component: SettingStack,
      icon: 'setting',
    },
    {
      id: 5,
      name: 'LoanStack',
      title: strings.loan,
      component: LoanStack,
      icon: 'sack-percent',
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: 6,
      name: 'LabourStack',
      title: strings.labour,
      component: LabourStack,
      icon: 'solution1',
    },
    {
      id: 7,
      name: 'LoanStack2',
      title: strings.loan,
      component: LoanStack,
      icon: 'sack-percent',
      iconType: 'MaterialCommunityIcons',
    },
    {
      id: 8,
      name: 'SettingStack3',
      title: strings.settings,
      component: SettingStack,
      icon: 'setting',
    },
  ],
};

export const TabContext = React.createContext();

const TabReducer = (prevState, action) => {
  switch (action.type) {
    case 'TAB':
      return {
        ...prevState,
        tabs: action.tabs,
      };
  }
};

export const TabProvider = props => {
  const [state, dispatch] = React.useReducer(TabReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      setTab: async value => {
        console.log(JSON.stringify(value), value)
        await setAsyncStorage('tab', JSON.stringify(value));
        dispatch({type: 'TAB', tabs: value});
      },
      getTab: async () => {
        let tabs = JSON.parse(await getAsyncStorage('tab'));
        console.log(tabs,'----------------context tab')
        // if (Array.isArray(tabs)) dispatch({type: 'TAB', tabs: tabs});
      },
    }),
    [state],
  );

  return (
    <TabContext.Provider value={{...value}}>
      {props.children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = React.useContext(TabContext);
  if (context === undefined) {
    throw new Error(`useTab must be used within a Provider`);
  }
  return context;
};
