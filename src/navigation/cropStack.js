import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Crop from '@screens/cropTracker';

const Stack = createNativeStackNavigator();

export default function CropStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Crop"
        component={Crop}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
