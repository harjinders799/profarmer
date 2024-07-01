import React from 'react';
import { tabsData } from '../utils/helper';
import { storage } from '@utils/helper';

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
        storage.set('tab', JSON.stringify(value))
        dispatch({ type: 'TAB', tabs: value });
      },
      getTab: async () => {
        const jsonTab = storage.getString('tab')
        const tabs = jsonTab ? JSON.parse(jsonTab) : null
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
