import React from 'react';
import { clearAsyncStorage, setAsyncStorage } from 'src/network/AsyncStorage';
import auth from '@react-native-firebase/auth'
const initialState = {
    pickers: [],
}

export const CottonContext = React.createContext();

const CottonReducer = (prevState, action) => {
    switch (action.type) {
        case 'PICKER':
            return {
                ...prevState,
                pickers: action.pickers,
            };
        case 'RESET':
            return {
                pickers: []
            };
    }
}

export const CottonProvider = (props) => {

    const [state, dispatch] = React.useReducer(CottonReducer, initialState);

    const value = React.useMemo(
        () => ({
            ...state,
            setPicker: async (value) => {
                await setAsyncStorage('pickers', JSON.stringify(value))
                dispatch({ type: 'PICKER', pickers: value });
            },
            resetPicker: async () => {
                if (auth()?.currentUser?.uid) {
                    auth().signOut()
                        .then(async () => {
                            dispatch({ type: 'RESET' });
                            await clearAsyncStorage('pickers')
                            // replace("Login")
                        });
                }
            },
        }),
        [state],
    );

    return (
        <CottonContext.Provider value={{ ...value }}>
            {props.children}
        </CottonContext.Provider>
    )
}


export const useCotton = () => {
    const context = React.useContext(CottonContext);
    if (context === undefined) {
        throw new Error(`useCotton must be used within a Provider`);
    }
    return context;
};


