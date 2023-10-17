import React from 'react';
import { getHarvestData } from '../network/harvest_service';

const initialState = {
 harvestData: [],
};

export const HarvestContext = React.createContext();

const HarvestReducer = (prevState, action) => {
  switch (action.type) {
    case 'HARVEST':
      return {
        ...prevState,
        harvestData: action.harvestData,
      };
  }
};

export const HarvestProvider = props => {
  const [state, dispatch] = React.useReducer(HarvestReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      getHarvest: async () => {
        dispatch({
          type: 'HARVEST',
          harvestData: await getHarvestData(),
        });
      },
    }),
    [state],
  );

  return (
    <HarvestContext.Provider value={{ ...value ,}}>
      {props.children}
    </HarvestContext.Provider>
  );
};

export const useHarvest = () => {
  const context = React.useContext(HarvestContext);
  if (context === undefined) {
    throw new Error(`useHarvest must be used within a Provider`);
  }
  return context;
};
