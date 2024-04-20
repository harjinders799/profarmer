import React from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  clearAsyncStorage,
  getAsyncStorage,
  setAsyncStorage,
} from '../network/AsyncStorage';
import { deleteDBConnectionDB } from '../sql';

const initialState = {
  user: undefined,
  pin: undefined,
  userVerified: false,
};

export const AuthContext = React.createContext();

const AuthReducer = (prevState, action) => {
  switch (action.type) {
    case 'USER':
      return {
        ...prevState,
        user: action.user,
      };
    case 'PIN':
      return {
        ...prevState,
        pin: action.pin,
      };
    case 'RESET':
      return {
        ...prevState,
        userVerified: false,
        user: undefined,
        pin: undefined,
      };
    case 'STOP_LOADING':
      return {
        ...prevState,
        loading: false,
      };
    case 'SET_USER_VERIFIED':
      return {
        ...prevState,
        userVerified: true,
      };

    default:
      return {
        ...prevState,
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
          let id = auth().currentUser?.uid;
          if (id) {
            let user = await firestore().collection('users').doc(id).get();
            if (user.exists) {
              dispatch({ type: 'USER', user: user.data() });
            } else {
              // console.log(auth().currentUser);
              let data = {
                name: auth().currentUser?.displayName,
                phone: auth().currentUser?.phoneNumber,
                email: auth().currentUser?.email,
                id: auth().currentUser?.uid,
              };
              await firestore().collection('users').doc(id).set(data);
              dispatch({ type: 'USER', user: data });
            }
          }
        } catch (error) {
          console.log(error, '------auth user');
        }
      },
      getPin: async () => {
        let value = JSON.parse(await getAsyncStorage('pin'));
        dispatch({ type: 'PIN', pin: value });
      },
      setPin: async value => {
        await setAsyncStorage('pin', JSON.stringify(value));
        dispatch({ type: 'PIN', pin: value });
      },
      setUserVerified: () => {
        dispatch({ type: 'SET_USER_VERIFIED' });
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
