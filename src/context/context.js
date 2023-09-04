import React from 'react';
import {
  clearAsyncStorage,
  setAsyncStorage,
} from '../network/AsyncStorage';
import auth from '@react-native-firebase/auth';

const initialState = {
  givers: [],
  labours: [],
  interest_rate: '',
};

export const BaseContext = React.createContext();

const BaseReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_GIVERS':
      return {
        ...prevState,
        givers: action.givers,
      };
    case 'SET_LABOURS':
      return {
        ...prevState,
        labours: action.labours,
      };
    case 'SET_INTEREST_RATE':
      return {
        ...prevState,
        interest_rate: action.interest_rate,
      };
  }
};

export const StoreProvider = props => {
  const [state, dispatch] = React.useReducer(BaseReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      setGivers: async value => {
        await setAsyncStorage('givers', JSON.stringify(value));
        dispatch({ type: 'SET_GIVERS', givers: value });
      },
      setLabours: async value => {
        await setAsyncStorage('labours', JSON.stringify(value));
        dispatch({ type: 'SET_LABOURS', labours: value });
      },
      setInterstRate: async value => {
        await setAsyncStorage('rate', value);
        dispatch({ type: 'SET_INTEREST_RATE', interest_rate: value });
      },
      resetGivers: async () => {
        if (auth()?.currentUser?.uid) {
          auth()
            .signOut()
            .then(async () => {
              dispatch({ type: 'RESET' });
              await clearAsyncStorage('givers');
              replace('Login');
            });
        }
      },
    }),
    [state],
  );

  return (
    <BaseContext.Provider value={{ ...value }}>
      {props.children}
    </BaseContext.Provider>
  );
};

export const useStore = () => {
  const context = React.useContext(BaseContext);
  if (context === undefined) {
    throw new Error(`useStore must be used within a MakerProvider`);
  }
  return context;
};
