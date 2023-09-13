import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from 'src/screens/settings';
import AddForm from 'src/screens/dashboard/addForm';
import Detail from 'src/screens/dashboard/detail';
import Tabs from './tab';
import { useCotton } from '../context/cottonContext';
import NetInfo from '@react-native-community/netinfo';
import AddPicker from '../screens/picker/addPicker';
import AddPickerExpense from '../screens/picker/addPickerExpense';
import AddPickerWeight from '../screens/picker/addPickerWeight';
import PickerDetail from '../screens/picker/pickerDetail';
import { getAllItems, updatePickerExpenseId, updatePickerId } from '../sql';
import { PCIKER_TABLE, PICKER_EXPENSE_TABLE } from '../sql/tabels';
import { submitPicker, submitPickerExpense, updatePicker, updatePickerExpense } from '../network/picker-service';
import AddPrice from '../screens/picker/addPrice';
import PickerUpdate from '../screens/picker/pickerUpdate';
import Filter from '../components/filter';

const Stack = createNativeStackNavigator();

export default function Stacks() {
  const { db, pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
    useCotton();
  const [isConnected, setisConnected] = useState(false);

  useEffect(() => {
    console.log('Netinfo api');
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable && db) {
        setTimeout(() => {
          setisConnected(true);
        }, 2000);
      } else {
        setisConnected(false);
      }
    });
    return () => unsubscribe();
  }, [db, pickerExpense, pickerWeight]);

  useEffect(() => {
    console.log(isConnected);
    if (isConnected) fetchData();
  }, [isConnected]);

  const fetchData = async () => {
    try {
      if (Array.isArray(pickerWeight) && pickerWeight.length) {
        let unsyncData = await getAllItems(
          db,
          PCIKER_TABLE,
          `WHERE sync='pending'`,
        );
        console.log(unsyncData.length, '-------wt');
        let promise = unsyncData.map(async (item, index) => {
          delete item.sync;
          let api = item?.fid && item?.fid != '' ? updatePicker : submitPicker
          let res = await api(item);
          console.log(res, '--------pick wt');
          if (res) {
            await updatePickerId(db, {
              ...item,
              fid: res,
            });
          }
        });
        await Promise.all(promise);
        getPickerWeight();
      }
      if (Array.isArray(pickerExpense) && pickerExpense.length) {
        let unsyncData = await getAllItems(
          db,
          PICKER_EXPENSE_TABLE,
          `WHERE sync='pending'`,
        );
        // console.log(unsyncData.length, '-------exp');
        let promise = unsyncData.map(async (item, index) => {
          delete item.sync;
          let api = item?.fid && item?.fid != '' ? updatePickerExpense : submitPickerExpense
          let res = await api(item);
          // console.log(res, '--------pick wt');
          if (res) {
            await updatePickerExpenseId(db, {
              ...item,
              fid: res,
            });
          }
        });
        await Promise.all(promise);
        getPickerExpense();
      }
    } catch (error) {
      console.log(error, '--------');
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
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
      <Stack.Screen
        name="AddPicker"
        component={AddPicker}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPickerExpense"
        component={AddPickerExpense}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPickerWeight"
        component={AddPickerWeight}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickerDetail"
        component={PickerDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickerUpdate"
        component={PickerUpdate}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPrice"
        component={AddPrice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
      name="Filter"
      component={Filter}
      options={{ headerShown: false }}
    />
    </Stack.Navigator>
  );
}
