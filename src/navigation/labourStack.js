import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Labour from 'src/screens/labour';
import AddLabour from 'src/screens/labour/addLabour';
import AddLabourExpense from '../screens/labour/addLabourExpense';
import LabourDetail from '../screens/labour/labourDetail';
import RegularLabourDetail from '../screens/labour/regularLabourDetail';
import AddLabourLeave from '../screens/labour/addLabourLeave';

const Stack = createNativeStackNavigator();

export default function LabourStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Labour"
        component={Labour}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="AddLabour"
        component={AddLabour}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddLabourExpense"
        component={AddLabourExpense}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddLabourLeave"
        component={AddLabourLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LabourDetail"
        component={LabourDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegularLabourDetail"
        component={RegularLabourDetail}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
}
