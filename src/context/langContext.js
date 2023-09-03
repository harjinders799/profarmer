import React from 'react';
import { getAsyncStorage, setAsyncStorage } from 'src/network/AsyncStorage';
import { strings } from 'src/translations/locale';
import useLocalStorage from '../utils/useLocalStore';

const initialState = {
  lang: undefined,
  fingerLock: true,
  authenticate: false
};

export const LangContext = React.createContext();

const LangReducer = (prevState, action) => {
  switch (action.type) {
    case 'LANG':
      return {
        ...prevState,
        lang: action.lang,
      };
    case 'FINGER':
      return {
        ...prevState,
        fingerLock: action.fingerLock,
      };
    case 'AUTHENTICATE':
      return {
        ...prevState,
        authenticate: action.authenticate,
      };
  }
};

export const LangProvider = props => {
  const [state, dispatch] = React.useReducer(LangReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      setLang: async value => {
        strings.setLanguage(value.code);
        await setAsyncStorage('lang', JSON.stringify(value));
        dispatch({ type: 'LANG', lang: value });
      },
      setFingerLock: async value => {
        await setAsyncStorage('fingerLock', JSON.stringify(value));
        dispatch({ type: 'FINGER', fingerLock: value });
      },
      setAuthenticate: async value => {
        dispatch({ type: 'AUTHENTICATE', authenticate: value });
      },
      getLang: async () => {
        let lang = JSON.parse(await getAsyncStorage('lang'));
        let lock = JSON.parse(await getAsyncStorage('fingerLock'));
        if (lang?.code) strings.setLanguage(lang.code);
        dispatch({ type: 'FINGER', fingerLock: lock });
        dispatch({ type: 'LANG', lang: lang });
      },
    }),
    [state],
  );

  return (
    <LangContext.Provider value={{ ...value }}>
      {props.children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const context = React.useContext(LangContext);
  if (context === undefined) {
    throw new Error(`useLang must be used within a Provider`);
  }
  return context;
};
