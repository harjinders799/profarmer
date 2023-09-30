import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useCotton } from '../../context/cottonContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getAllItems, updatePickerExpenseId, updatePickerId } from '../../sql';
import { PCIKER_TABLE, PICKER_EXPENSE_TABLE } from '../../sql/tabels';
import Button from '../../components/button';
import Text from '../../components/text';
import { strings } from '../../translations/locale';
import {
    submitPicker,
    submitPickerExpense,
    updatePicker,
    updatePickerExpense,
} from '../../network/picker-service';
import { orange, white, yellow } from '../../utils/color';
import Icon from '../../components/icon';

const SyncLocal = () => {
    const {
        db,
        getPickerWeight,
        pickerWeight = [],
        pickerExpense = [],
        getPickerExpense,
    } = useCotton();
    const [localEntries, setLocalEntries] = useState(0);
    const isFocused = useIsFocused();
    const [hidePopup, setHidePopup] = useState(false);

    useFocusEffect(
        useCallback(() => {
            // console.log('-------sync------');

            const fetchDataTimeout = setTimeout(() => {
                fetchData();
            }, 20000);

            return () => {
                // Cleanup the effect to prevent multiple calls
                clearTimeout(fetchDataTimeout);
            };
        }, [isFocused && pickerWeight.length]),
    );
    const fetchData = async () => {
        // console.log('----inside call----------');
        try {
            let totWtEntry = 0;
            let unsyncData = await checkLocal(PCIKER_TABLE);
            totWtEntry = unsyncData.length;
            setLocalEntries(totWtEntry);
            // console.log(unsyncData.length, '--inside-----wt');
            if (unsyncData.length) {
                let promise = unsyncData.map(async (item, index) => {
                    delete item.sync;
                    let api = item?.fid && item?.fid != '' ? updatePicker : submitPicker;
                    let res = await api(item);
                    // console.log(res, '----inside----pick wt');
                    if (res) {
                        await updatePickerId(db, {
                            ...item,
                            fid: res,
                        });
                    }
                });
                await Promise.all(promise);
                await getPickerWeight();
                unsyncData = await checkLocal(PCIKER_TABLE);
                totWtEntry = unsyncData.length;
                // console.log('-------toat wt', unsyncData.length)
                setLocalEntries(totWtEntry);
            }
            if (Array.isArray(pickerExpense) && pickerExpense.length) {
                let totExEntry = 0;
                let unsyncExData = await checkLocal(PICKER_EXPENSE_TABLE);
                totExEntry = unsyncExData.length;
                setLocalEntries(totWtEntry + totExEntry);
                // console.log(unsyncExData.length, '---inside----exp');
                if (unsyncExData.length) {
                    let promise = unsyncExData.map(async (item, index) => {
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
                    await getPickerExpense();
                    unsyncExData = await checkLocal(PICKER_EXPENSE_TABLE);
                    totExEntry = unsyncExData.length;
                    // console.log('-------toat ex', unsyncData.length)
                    setLocalEntries(totWtEntry + totExEntry);
                }
            }
            setHidePopup(false);
        } catch (error) {
            console.log(error, '--------');
        }
    };

    const checkLocal = async tabelName => {
        let local = [];
        if (pickerWeight.length) {
            local = await getAllItems(db, tabelName, `WHERE sync='pending'`);
            // setLocalEntries(tot);
            return local;
        }
        return local;
    };

    return (
        <View
            style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItem: 'center',
                marginVertical: 5,
                height: 35,
                display: hidePopup && !localEntries ? 'none' : 'flex',
                // position: 'absolute',
                // zIndex: 9999,
            }}>
            <Text
                style={{
                    fontSize: 12,
                    color: orange,
                    width: '90%',
                    textAlign: 'center',
                }}>
                {localEntries ? strings.offline_warning : ''}
            </Text>
            <TouchableOpacity hitSlop={20} onPress={() => setHidePopup(true)}>
                <Text h6>
                    {localEntries ? localEntries : 'x'}{' '}
                    <Icon name={'clouduploado'} size={20} />
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SyncLocal;

const styles = StyleSheet.create({});
