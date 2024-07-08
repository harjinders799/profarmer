import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Aadhat from '@screens/aadhat';

const Stack = createNativeStackNavigator();

export default function AAdhatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Aadhat"
        component={Aadhat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
