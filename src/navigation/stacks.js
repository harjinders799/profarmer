import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from 'src/screens/settings';
import AddForm from 'src/screens/aadtiya/addForm';
import CropDetail from '../screens/crop/detail';
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
import Analysis from '../screens/picker/analysis';
import Group from '../screens/picker/group';
import CropUpdate from '../screens/crop/cropUpdate';
import AddCrop from '../screens/crop/addCrop';
import AboutUs from '../screens/settings/aboutUs';
import ContactUs from '../screens/settings/contactUs';
import SalectLanguage from '../screens/settings/salectLanguage';
import EditProfile from '../screens/settings/editprofile';
import AddLabourExpense from '../screens/labour/addLabourExpense';
import AddLabourLeave from '../screens/labour/addLabourLeave';
import LabourDetail from '../screens/labour/labourDetail';
import AddLabour from '../screens/labour/addLabour';
import RegularLabourDetail from '../screens/labour/regularLabourDetail';
import LabourUpdate from '../screens/labour/labourUpdate';
import GiverUpdate from '../screens/aadtiya/giverUpdate';

const Stack = createNativeStackNavigator();

export default function Stacks() {
  const { db, pickerWeight = [], pickerExpense = [], getPickerWeight, getPickerExpense } =
    useCotton();
  const [isConnected, setisConnected] = useState(false);

  useEffect(() => {
    // console.log('Netinfo api');
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
  }, [db, pickerExpense.length == 0, pickerWeight.length == 0]);

  useEffect(() => {
    // console.log(isConnected);
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
        // console.log(unsyncData.length, '-------wt');
        if (unsyncData.length) {
          let promise = unsyncData.map(async (item, index) => {
            delete item.sync;
            let api = item?.fid && item?.fid != '' ? updatePicker : submitPicker
            let res = await api(item);
            // console.log(res, '--------pick wt');
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
      }
      if (Array.isArray(pickerExpense) && pickerExpense.length) {
        let unsyncData = await getAllItems(
          db,
          PICKER_EXPENSE_TABLE,
          `WHERE sync='pending'`,
        );
        // console.log(unsyncData.length, '-------exp');
        if (unsyncData.length) {
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
      }
    } catch (error) {
      console.log(error, '--------');
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Main"
        component={Tabs}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
      />
      <Stack.Screen
        name="AddForm"
        component={AddForm}
      />
      <Stack.Screen
        name="CropDetail"
        component={CropDetail}
      />
      <Stack.Screen
        name="AddPicker"
        component={AddPicker}
      />
      <Stack.Screen
        name="AddPickerExpense"
        component={AddPickerExpense}
      />
      <Stack.Screen
        name="AddPickerWeight"
        component={AddPickerWeight}
      />
      <Stack.Screen
        name="PickerDetail"
        component={PickerDetail}
      />
      <Stack.Screen
        name="AddLabour"
        component={AddLabour}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddLabourExpense"
        component={AddLabourExpense}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddLabourLeave"
        component={AddLabourLeave}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LabourDetail"
        component={LabourDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegularLabourDetail"
        component={RegularLabourDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickerUpdate"
        component={PickerUpdate}
      />
      <Stack.Screen
        name="LabourUpdate"
        component={LabourUpdate}
      />
      <Stack.Screen
        name="CropUpdate"
        component={CropUpdate}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="AddCrop"
        component={AddCrop}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPrice"
        component={AddPrice}
      />
      <Stack.Screen
        name="GiverUpdate"
        component={GiverUpdate}
      />
      <Stack.Screen
        name="Analysis"
        component={Analysis}
      />
        <Stack.Screen
        name="Group"
        component={Group}
      />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name='SalectLanguage' component={SalectLanguage} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
    </Stack.Navigator>
  );
}
