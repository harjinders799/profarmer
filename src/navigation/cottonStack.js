import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashBoard from 'src/screens/aadtiya';
import AddForm from 'src/screens/aadtiya/addForm';
import Detail from 'src/screens/aadtiya/detail';

const Stack = createNativeStackNavigator();

export default function CottonStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cotton"
        component={DashBoard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddForm"
        component={AddForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
