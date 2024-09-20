import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pickers from '@screens/pickers';


const Stack = createNativeStackNavigator();

export default function PickerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cotton"
        component={Pickers}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}