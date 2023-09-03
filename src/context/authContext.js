import React from 'react';
import { Auth, database } from 'src/service/setup';
import { firestore } from '../service/setup';

const initialState = {
    user: undefined,
}

export const AuthContext = React.createContext();

const AuthReducer = (prevState, action) => {
    switch (action.type) {
        case 'USER':
            return {
                ...prevState,
                user: action.user,
            };
        case 'RESET':
            return {
                ...prevState,
                user: undefined,
            }
    }
}

export const AuthProvider = (props) => {
    const [state, dispatch] = React.useReducer(AuthReducer, initialState);

    const value = React.useMemo(
        () => ({
            ...state,
            getUser: async () => {
                try {
                    let id = Auth().currentUser?.uid;
                    let user = await firestore()
                        .collection('users')
                        .doc(id).get();
                    if (user.exists) {
                        dispatch({ type: 'USER', user: user.data() });
                    } else dispatch({ type: 'RESET' });
                } catch (error) {
                    console.log(error, '------auth user')
                }
            },
            reset: async () => {
                dispatch({ type: 'RESET' });
            },
        }),
        [state],
    );

    return (
        <AuthContext.Provider value={{ ...value }}>
            {props.children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within a Provider`);
    }
    return context;
};


