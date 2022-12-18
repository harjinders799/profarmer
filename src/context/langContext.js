import React from 'react';
import {getAsyncStorage, setAsyncStorage} from 'src/network/AsyncStorage';
import {strings} from 'src/translations/locale';
import useLocalStorage from '../utils/useLocalStore';

const initialState = {
  lang: undefined,
};

export const LangContext = React.createContext();

const LangReducer = (prevState, action) => {
  switch (action.type) {
    case 'LANG':
      return {
        ...prevState,
        lang: action.lang,
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
        dispatch({type: 'LANG', lang: value});
      },
      getLang: async () => {
        let lang = JSON.parse(await getAsyncStorage('lang'));
        if (lang?.code) strings.setLanguage(lang.code);
        dispatch({type: 'LANG', lang: lang});
      },
    }),
    [state],
  );

  return (
    <LangContext.Provider value={{...value}}>
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
