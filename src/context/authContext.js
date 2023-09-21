import React from 'react';
import { Auth, database } from 'src/service/setup';
import { firestore } from '../service/setup';
import auth from '@react-native-firebase/auth';
import { clearAsyncStorage } from '../network/AsyncStorage';
import { deleteDBConnectionDB } from '../sql';

const initialState = {
    user: undefined,
};

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
            };
    }
};

export const AuthProvider = props => {
    const [state, dispatch] = React.useReducer(AuthReducer, initialState);

    const value = React.useMemo(
        () => ({
            ...state,
            getUser: async () => {
                try {
                    let id = Auth().currentUser?.uid;
                    if (id) {
                        let user = await firestore().collection('users').doc(id).get();
                        if (user.exists) {
                            dispatch({ type: 'USER', user: user.data() });
                        } else {
                            // console.log(Auth().currentUser);
                            let data = {
                                name: Auth().currentUser?.displayName,
                                phone: Auth().currentUser?.phoneNumber,
                                email: Auth().currentUser?.email,
                                id: Auth().currentUser?.uid,
                            };
                            await firestore().collection('users').doc(id).set(data);
                            dispatch({ type: 'USER', user: data });
                        }
                    }
                } catch (error) {
                    console.log(error, '------auth user');
                }
            },
            reset: () => {
                // console.log('reset')
                deleteDBConnectionDB().then(res => {
                    // console.log('reset', res, '-----')
                    auth()
                        .signOut()
                        .then(async () => {
                            dispatch({ type: 'RESET' });
                            // await clearAsyncStorage();
                            // replace("Login")
                        });
                });
            },
        }),
        [state],
    );

    return (
        <AuthContext.Provider value={{ ...value }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within a Provider`);
    }
    return context;
};
