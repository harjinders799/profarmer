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
import {
  submitPicker,
  submitPickerExpense,
  updatePicker,
  updatePickerExpense,
} from '../network/picker-service';
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
import GroupDetail from '../screens/picker/groupDetail';
import AddLoan from '../screens/loan/addLoan';
import AddCredit from '../screens/loan/addCredit';
import LoanDetail from '../screens/loan/loanDetail';
import LoanUpdate from '../screens/loan/loanUpdate';
import PinSecurity from '../screens/auth/pinSecurity';
import LocalAuth from '../screens/auth/localAuth';
import AddEvent from '../screens/timeline/addEvent';
import TimeDetail from '../screens/timeline/timeDetail';

const Stack = createNativeStackNavigator();

export default function Stacks() {
  const {
    db,
    pickerWeight = [],
    pickerExpense = [],
    getPickerWeight,
    getPickerExpense,
  } = useCotton();
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
            let api =
              item?.fid && item?.fid != '' ? updatePicker : submitPicker;
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
            let api =
              item?.fid && item?.fid != ''
                ? updatePickerExpense
                : submitPickerExpense;
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
      <Stack.Screen name="Main" component={Tabs} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="AddEvent" component={AddEvent} />
      <Stack.Screen name="AddForm" component={AddForm} />
      <Stack.Screen name="CropDetail" component={CropDetail} />
      <Stack.Screen name="AddPicker" component={AddPicker} />
      <Stack.Screen name="AddPickerExpense" component={AddPickerExpense} />
      <Stack.Screen name="AddPickerWeight" component={AddPickerWeight} />
      <Stack.Screen name="PickerDetail" component={PickerDetail} />
      <Stack.Screen name="AddLabour" component={AddLabour} />
      <Stack.Screen name="AddLabourExpense" component={AddLabourExpense} />
      <Stack.Screen name="AddLabourLeave" component={AddLabourLeave} />
      <Stack.Screen name="LabourDetail" component={LabourDetail} />
      <Stack.Screen
        name="RegularLabourDetail"
        component={RegularLabourDetail}
      />
      <Stack.Screen name="PickerUpdate" component={PickerUpdate} />
      <Stack.Screen name="LabourUpdate" component={LabourUpdate} />
      <Stack.Screen name="CropUpdate" component={CropUpdate} />
      <Stack.Screen name="AddCrop" component={AddCrop} />
      <Stack.Screen name="AddPrice" component={AddPrice} />
      <Stack.Screen name="GiverUpdate" component={GiverUpdate} />
      <Stack.Screen name="LoanUpdate" component={LoanUpdate} />
      <Stack.Screen name="AddLoan" component={AddLoan} />
      <Stack.Screen name="AddCredit" component={AddCredit} />
      <Stack.Screen name="LoanDetail" component={LoanDetail} />
      <Stack.Screen name="TimeDetail" component={TimeDetail} />
      <Stack.Screen name="Analysis" component={Analysis} />
      <Stack.Screen name="Group" component={Group} />
      <Stack.Screen name="GroupDetail" component={GroupDetail} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="SalectLanguage" component={SalectLanguage} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}
