import React from 'react';
import { getCrops, getInterestAmount } from '../network/interest-service';

const initialState = {
  aadtData: [],
  cropData: [],
};

export const AadtContext = React.createContext();

const AadtReducer = (prevState, action) => {
  switch (action.type) {
    case 'AADT':
      return {
        ...prevState,
        aadtData: action.aadtData,
      };
    case 'CROP':
      return {
        ...prevState,
        cropData: action.cropData,
      };
  }
};

export const AadtProvider = props => {
  const [state, dispatch] = React.useReducer(AadtReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      getAadt: async () => {
        dispatch({
          type: 'AADT',
          aadtData: await getInterestAmount(),
        });
      },
      getCrop: async () => {
        dispatch({
          type: 'CROP',
          cropData: await getCrops(),
        });
      },
    }),
    [state],
  );

  return (
    <AadtContext.Provider value={{ ...value }}>
      {props.children}
    </AadtContext.Provider>
  );
};

export const useAadt = () => {
  const context = React.useContext(AadtContext);
  if (context === undefined) {
    throw new Error(`useAadt must be used within a Provider`);
  }
  return context;
};
