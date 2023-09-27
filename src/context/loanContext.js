import React from 'react';
import { getLoanData } from '../network/loan-service';

const initialState = {
 loanData: [],
};

export const LoanContext = React.createContext();

const LoanReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAN':
      return {
        ...prevState,
        loanData: action.loanData,
      };
  }
};

export const LoanProvider = props => {
  const [state, dispatch] = React.useReducer(LoanReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      getLoan: async () => {
        dispatch({
          type: 'LOAN',
          loanData: await getLoanData(),
        });
      },
    }),
    [state],
  );

  return (
    <LoanContext.Provider value={{ ...value }}>
      {props.children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = React.useContext(LoanContext);
  if (context === undefined) {
    throw new Error(`useLoan must be used within a Provider`);
  }
  return context;
};
