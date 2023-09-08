import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from 'src/screens/auth/login';
import Splash from 'src/screens/auth/splash';
import { themeLight } from 'src/utils/themes';
import Setting from 'src/screens/settings';
// import AdBanner from "src/components/adBanner";
import { useLang } from 'src/context/langContext';
import { navigationRef } from './ref';
import DashBoard from 'src/screens/dashboard';
import AddForm from 'src/screens/dashboard/addForm';
import Detail from 'src/screens/dashboard/detail';
import { Auth } from 'src/service/setup';
import Loader from 'src/components/loader';
import Tabs from './tab';
import { useAuth } from '../context/authContext';

import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { BackHandler } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();
import LoginMethods from '../screens/auth/loginMethods';
import SignInWithEmail from '../screens/auth/signInWithEmail';
import { useCotton } from '../context/cottonContext';
import Stacks from './stacks';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { getLang, fingerLock, authenticate, setAuthenticate } = useLang();
  const { getUser } = useAuth();
  const { db, getDB } = useCotton();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [fingerLockAvailable, setFingerLockAvailable] = useState(false);

  useEffect(() => {
    getLang();
    getUser();
    (async () => {
      const { available } = await rnBiometrics.isSensorAvailable();
      setFingerLockAvailable(available);
    })();
  }, []);
  useEffect(() => {
    if (db)
      async () => {
        await createPickerTable(db);
        await createPickerExpenseTable(db);
        await createCottonPriceTable(db);
      };
  }, [db]);

  // Handle user state changes
  function onAuthStateChanged(user) {
    getDB();
    if (user) {
      setUser(user);
      getUser();
    }
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing || !db) return <Loader visible={initializing || !db} />;
  // if (fingerLock && user && fingerLockAvailable && !authenticate) {
  //   rnBiometrics
  //     .simplePrompt({ promptMessage: 'Confirm fingerprint' })
  //     .then(resultObject => {
  //       const { success } = resultObject;
  //       if (!success) {
  //         BackHandler.exitApp();
  //       } else {
  //         setAuthenticate(true);
  //       }
  //     })
  //     .catch(() => {
  //       console.log('biometrics failed');
  //     });
  // }
  return (
    <NavigationContainer theme={themeLight} ref={navigationRef}>
      {!user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="LoginMethods"
            component={LoginMethods}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignInWithEmail"
            component={SignInWithEmail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stacks />
      )}
      {/* <AdBanner /> */}
    </NavigationContainer>
  );
}
