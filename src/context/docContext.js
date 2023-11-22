import React from 'react';
import { getDocumentData } from '../network/document-service';

const initialState = {
 documentData: [],
};

export const DocumentContext = React.createContext();

const DocumentReducer = (prevState, action) => {
  switch (action.type) {
    case 'DOCUMENT':
      return {
        ...prevState,
        documentData: action.documentData,
      };
  }
};

export const DocumentProvider = props => {
  const [state, dispatch] = React.useReducer(DocumentReducer, initialState);

  const value = React.useMemo(
    () => ({
      ...state,
      getDocument: async () => {
        dispatch({
          type: 'DOCUMENT',
          documentData: await getDocumentData(),
        });
      },
    }),
    [state],
  );

  return (
    <DocumentContext.Provider value={{ ...value }}>
      {props.children}
    </DocumentContext.Provider>
  );
};
export const useDocument = () => {
  const context = React.useContext(DocumentContext);
  if (context === undefined) {
    throw new Error(`useDocument must be used within a Provider`);
  }
  return context;
};
