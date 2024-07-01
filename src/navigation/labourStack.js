import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Labour from '@screens/labour';

const Stack = createNativeStackNavigator();

export default function LabourStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Labour"
        component={Labour}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
