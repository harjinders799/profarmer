import React from 'react';
import { getAsyncStorage, setAsyncStorage } from 'src/network/AsyncStorage';
import { tabsData } from '../utils/helper';

const initialState = {
  tabs: tabsData,
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
        await setAsyncStorage('tab', JSON.stringify(value));
        dispatch({ type: 'TAB', tabs: value });
      },
      getTab: async () => {
        let tabs = JSON.parse(await getAsyncStorage('tab'));
        if (Array.isArray(tabs)) dispatch({ type: 'TAB', tabs: tabs });
      },
    }),
    [state],
  );

  return (
    <TabContext.Provider value={{ ...value }}>
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
