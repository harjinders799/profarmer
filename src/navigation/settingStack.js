import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from '../screens/settings';
import AboutUs from '../screens/settings/aboutUs';
import ContactUs from '../screens/settings/contactUs';
import SalectLanguage from '../screens/settings/salectLanguage';
import EditProfile from '../screens/settings/editprofile';
const Stack = createNativeStackNavigator();

export default function SettingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Setting"
        component={Setting}

      />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name='SalectLanguage' component={SalectLanguage} />
      <Stack.Screen name='EditProfile' component={EditProfile} />



    </Stack.Navigator>
  );
}
