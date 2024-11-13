import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Crop from '@screens/cropTracker';
import CropAnalysis from '@screens/cropTracker/cropAnalysis';
import CropUpdate from '@screens/cropTracker/cropUpdate';
import AddCrop from '@screens/cropTracker/addCrop';
import AddEvent from '@screens/cropTracker/addEvent';
import CropDetail from '@screens/cropTracker/detail';
import { CropTrackerProvider } from '@context/cropTrackerContext';

const Stack = createNativeStackNavigator();

export default function CropStack() {
  return (
    <CropTrackerProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Crop" component={Crop} />
        <Stack.Screen name="CropAnalysis" component={CropAnalysis} />
        <Stack.Screen name="CropUpdate" component={CropUpdate} />
        <Stack.Screen name="AddCrop" component={AddCrop} />
        <Stack.Screen name="AddEvent" component={AddEvent} />
        <Stack.Screen name="CropDetail" component={CropDetail} />
      </Stack.Navigator>
    </CropTrackerProvider>
  );
}
