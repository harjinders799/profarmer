import React from 'react';
import { clearAsyncStorage, setAsyncStorage } from 'src/network/AsyncStorage';
import auth from '@react-native-firebase/auth';
import { createCottonPriceTable, createPickerExpenseTable, createPickerTable, getAllItems, getDBConnectionDB } from '../sql';
import { COTTON_PRICE_TABLE, PCIKER_TABLE, PICKER_EXPENSE_TABLE } from '../sql/tabels';
const initialState = {
  pickers: [],
  cottonPrice: undefined,
  db: undefined,
  pickerWeight: undefined,
  pickerExpense: undefined
};

export const CottonContext = React.createContext();

const CottonReducer = (prevState, action) => {
  switch (action.type) {
    case 'PICKER':
      return {
        ...prevState,
        pickers: action.pickers,
      };
    case 'COTTON_PRICE':
      return {
        ...prevState,
        cottonPrice: action.cottonPrice,
      };
    case 'SET_DB':
      return {
        ...prevState,
        db: action.db,
      };
    case 'PICKER_WEIGHT':
      return {
        ...prevState,
        pickerWeight: action.pickerWeight,
      };
    case 'PICKER_EXPENSE':
      return {
        ...prevState,
        pickerExpense: action.pickerExpense,
      };
    case 'RESET':
      return {
        pickers: [],
      };
  }
};

export const CottonProvider = props => {
  const [state, dispatch] = React.useReducer(CottonReducer, initialState);

  React.useEffect(() => {
    value.getDB();
  }, []);

  React.useEffect(() => {
    if (state.db) {
      (async () => {
        await createCottonPriceTable(state.db);
        await createPickerTable(state.db);
        await createPickerExpenseTable(state.db);
        await value.getCottonPrice();
        await value.getPickerWeight();
        await value.getPickerExpense();
      })();
    }
  }, [state.db]);

  const value = React.useMemo(
    () => ({
      ...state,
      setPicker: async value => {
        await setAsyncStorage('pickers', JSON.stringify(value));
        dispatch({ type: 'PICKER', pickers: value });
      },
      getCottonPrice: async () => {
        dispatch({
          type: 'COTTON_PRICE',
          cottonPrice: await getAllItems(state.db, COTTON_PRICE_TABLE),
        });
      },
      getPickerWeight: async () => {
        dispatch({
          type: 'PICKER_WEIGHT',
          pickerWeight: await getAllItems(state.db, PCIKER_TABLE),
        });
      },
      getPickerExpense: async () => {
        dispatch({
          type: 'PICKER_EXPENSE',
          pickerExpense: await getAllItems(state.db, PICKER_EXPENSE_TABLE),
        });
      },
      getDB: async () => {
        dispatch({ type: 'SET_DB', db: await getDBConnectionDB() });
      },

      resetPicker: async () => {
        auth()
          .signOut()
          .then(async () => {
            dispatch({ type: 'RESET' });
            await clearAsyncStorage();
            // replace("Login")
          });
      },
    }),
    [state],
  );

  return (
    <CottonContext.Provider value={{ ...value }}>
      {props.children}
    </CottonContext.Provider>
  );
};

export const useCotton = () => {
  const context = React.useContext(CottonContext);
  if (context === undefined) {
    throw new Error(`useCotton must be used within a Provider`);
  }
  return context;
};
