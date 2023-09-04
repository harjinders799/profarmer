import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Crop from '../screens/crop';
import AddCrop from '../screens/crop/addCrop';
import Detail from '../screens/crop/detail';

const Stack = createNativeStackNavigator();

export default function CropStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Crop"
        component={Crop}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCrop"
        component={AddCrop}
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
