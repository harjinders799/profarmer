import React from 'react';
import { strings } from 'src/translations/locale';
import { storage } from '@utils/helper';

const initialState = {
  lang: undefined,
  theme: 'dark',
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
    case 'THEME':
      return {
        ...prevState,
        theme: action.theme,
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
        storage.set('lang', JSON.stringify(value))
        dispatch({ type: 'LANG', lang: value });
      },
      setTheme: async value => {
        storage.set('theme', JSON.stringify(value))
        dispatch({ type: 'THEME', theme: value });
      },
      setFingerLock: async value => {
        storage.set('fingerLock', JSON.stringify(value))
        dispatch({ type: 'FINGER', fingerLock: value });
      },
      setAuthenticate: async value => {
        dispatch({ type: 'AUTHENTICATE', authenticate: value });
      },
      getLang: async () => {
        const jsonTheme = storage.getString('theme')
        const jsonLang = storage.getString('lang')
        const theme = jsonTheme ? JSON.parse(jsonTheme) : null
        const lang = jsonLang ? JSON.parse(jsonLang) : null
        const jsonLock = storage.getString('fingerLock')
        const lock = jsonLock ? JSON.parse(jsonLock) : null
        if (lang?.code) strings.setLanguage(lang.code);
        dispatch({ type: 'THEME', theme });
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
