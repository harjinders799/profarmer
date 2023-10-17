import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from 'src/screens/auth/login';
import Splash from 'src/screens/auth/splash';
import {themeLight} from 'src/utils/themes';
import Setting from 'src/screens/settings';
// import AdBanner from "src/components/adBanner";
import {useLang} from 'src/context/langContext';
import {navigationRef} from './ref';
import DashBoard from 'src/screens/aadtiya';
import AddForm from 'src/screens/aadtiya/addForm';
import Detail from 'src/screens/aadtiya/detail';
import {Auth} from 'src/service/setup';
import Loader from 'src/components/loader';
import Tabs from './tab';
import {useAuth} from '../context/authContext';

import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {BackHandler} from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();
import LoginMethods from '../screens/auth/loginMethods';
import SignInWithEmail from '../screens/auth/signInWithEmail';
import {useCotton} from '../context/cottonContext';
import Stacks from './stacks';
import LocalAuth from '../screens/auth/localAuth';
import PinSecurity from '../screens/auth/pinSecurity';
import { useTab } from '../context/tabContext';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { getLang, fingerLock, authenticate, setAuthenticate } = useLang();
  const { getUser, userVerified, getPin, reset } = useAuth();
  const { db, getDB } = useCotton();
  const { getTab, tabs } = useTab();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    getTab();
    getLang();
    getTab();
    getUser();
    getPin();
  }, []);

  useEffect(() => {
    if (db)
      async () => {
        await createPickerTable(db);
        await createPickerExpenseTable(db);
        await createCottonPriceTable(db);
      };
  }, [db]);


  function onAuthStateChanged(user) {
    getDB();
    if (user) {
      setUser(user);
      getUser();
      getTab();
    }
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [userVerified]);

  if (initializing || !db || !Array.isArray(tabs)) return <Loader visible={initializing || !db} />;

  return (
    <NavigationContainer theme={themeLight} ref={navigationRef}>
      {user ? (
        __DEV__ || userVerified ? (
          <Stacks />
        ) : (
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="LocalAuth" component={LocalAuth} />
            <Stack.Screen name="PinSecurity" component={PinSecurity} />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="LoginMethods"
            component={LoginMethods}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignInWithEmail"
            component={SignInWithEmail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
      {/* <AdBanner /> */}
    </NavigationContainer>
  );
}
