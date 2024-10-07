import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from 'src/screens/auth/login';
import { themeDark, themeLight } from 'src/utils/themes';
// import AdBanner from "src/components/adBanner";
import { useLang } from 'src/context/langContext';
import { navigationRef } from './ref';
import auth from '@react-native-firebase/auth';
import Loader from 'src/components/loader';
import { useAuth } from '../context/authContext';
import LoginMethods from '../screens/auth/loginMethods';
import SignInWithEmail from '../screens/auth/signInWithEmail';
import Stacks from './stacks';
import LocalAuth from '../screens/auth/localAuth';
import PinSecurity from '../screens/auth/pinSecurity';
import { useTab } from '../context/tabContext';
import ContactUs from '@screens/settings/contactUs';
import SignUp from '@screens/auth/registerWithEmail';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { getLang, theme } = useLang();
  const { getUser, userVerified, getPin } = useAuth();
  const { getTab, tabs } = useTab();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    getTab();
    getLang();
    getUser();
    getPin();
  }, []);

  function onAuthStateChanged(user) {
    if (user) {
      setUser(user);
      getUser();
      getTab();
    }
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [userVerified]);

  if (initializing || !Array.isArray(tabs))
    return <Loader visible={initializing} />;

  return (
    <NavigationContainer
      theme={theme == 'dark' ? themeDark : themeLight}
      ref={navigationRef}>
      {user ? (
        __DEV__ || userVerified ? (
          <Stacks />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LocalAuth" component={LocalAuth} />
            <Stack.Screen name="PinSecurity" component={PinSecurity} />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="LoginMethods"
            component={LoginMethods}
          />
          <Stack.Screen
            name="SignInWithEmail"
            component={SignInWithEmail}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
          />
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen name="ContactUs" component={ContactUs} />
        </Stack.Navigator>
      )}
      {/* <AdBanner /> */}
    </NavigationContainer>
  );
}
