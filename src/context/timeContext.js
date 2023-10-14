import React from 'react';
import { getTimelineData } from '../network/time-service';

const initialState = {
 timelineData: [],
};

export const TimelineContext = React.createContext();

const TimelineReducer = (prevState, action) => {
  switch (action.type) {
    case 'TIMELINE':
      return {
        ...prevState,
        timelineData: action.timelineData,
      };
  }
};

export const TimelineProvider = props => {
  const [state, dispatch] = React.useReducer(TimelineReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      getTimeline: async () => {
        dispatch({
          type: 'TIMELINE',
          timelineData: await getTimelineData(),
        });
      },
    }),
    [state],
  );

  return (
    <TimelineContext.Provider value={{ ...value ,}}>
      {props.children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = React.useContext(TimelineContext);
  if (context === undefined) {
    throw new Error(`useTimeline must be used within a Provider`);
  }
  return context;
};
