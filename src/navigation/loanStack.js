import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loan from '../screens/loan';


const Stack = createNativeStackNavigator();

export default function LoanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Loan"
        component={Loan}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}