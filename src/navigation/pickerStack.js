import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Picker from '../screens/picker';
import AddPicker from '../screens/picker/addPicker';
import AddPickerExpense from '../screens/picker/addPickerExpense';
import PickerDetail from '../screens/picker/pickerDetail';
// import PickerDetail from '../screens/picker/pickerDetail';


const Stack = createNativeStackNavigator();

export default function PickerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Picker"
        component={Picker}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddPicker"
        component={AddPicker}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddPickerExpense"
        component={AddPickerExpense}
        options={{headerShown: false}}
      />
       <Stack.Screen
      name="PickerDetail"
      component={PickerDetail}
      options={{headerShown: false}}
    />

      </Stack.Navigator>
  );
}