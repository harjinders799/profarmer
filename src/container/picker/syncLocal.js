import { StyleSheet, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useCotton } from '../../context/cottonContext';
import { useFocusEffect } from '@react-navigation/native';
import { getAllItems, updatePickerExpenseId, updatePickerId } from '../../sql';
import { PCIKER_TABLE, PICKER_EXPENSE_TABLE } from '../../sql/tabels';
import Button from '../../components/button';
import Text from '../../components/text';
import { strings } from '../../translations/locale';
import { submitPicker, submitPickerExpense, updatePicker, updatePickerExpense } from '../../network/picker-service';

const SyncLocal = () => {
    const {
        db,
        getPickerWeight,
        pickerWeight = [],
        pickerExpense = [],
        getPickerExpense,
    } = useCotton();
    const [localEntries, setLocalEntries] = useState(0);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [pickerExpense, pickerWeight]),
    );

    const fetchData = async () => {
        try {
            let tot = 0;
            if (Array.isArray(pickerWeight) && pickerWeight.length) {
                let unsyncData = await getAllItems(
                    db,
                    PCIKER_TABLE,
                    `WHERE sync='pending'`,
                );
                tot += unsyncData.length;
                setLocalEntries(tot);
                console.log(unsyncData.length, '--inside-----wt');
                let promise = unsyncData.map(async (item, index) => {
                    delete item.sync;
                    let api = item?.fid && item?.fid != '' ? updatePicker : submitPicker
                    let res = await api(item);
                    console.log(res, '----inside----pick wt');
                    if (res) {
                        await updatePickerId(db, {
                            ...item,
                            fid: res,
                        });
                    }
                });
                await Promise.all(promise);
            }
            if (Array.isArray(pickerExpense) && pickerExpense.length) {
                let unsyncData = await getAllItems(
                    db,
                    PICKER_EXPENSE_TABLE,
                    `WHERE sync='pending'`,
                );
                tot += unsyncData.length;
                setLocalEntries(tot);
                console.log(unsyncData.length, '---inside----exp');
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
            }
        } catch (error) {
            console.log(error, '--------');
        }
    };

    return (
        localEntries ? (
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItem: 'center',
                    marginTop: 20,
                }} >
                <Text h4>You have {localEntries} Local Entries</Text>
                <Button
                    label={strings.add_picker}
                    btnStyle={{
                        width: 'auto',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        height: 'auto',
                        marginVertical: 0,
                    }}
                // onPress={() => navigate('AddPicker')}
                />
            </View >
        ) : null
    )
}

export default SyncLocal

const styles = StyleSheet.create({})