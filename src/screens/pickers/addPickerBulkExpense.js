import React, { useCallback, useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import Text from '@components/text';
import BaseView from '@container/base';
import { goBack } from '@navigation/ref';
import { strings } from '@translations/locale';
import Header from '@components/header';
import Loader from '@components/loader';
import { ToastError, ToastSuccess } from '@utils/toast';
import { currencyInput, dateFormat } from '@utils/dateformat';
import Icon from '@components/icon';
import { common } from '@utils/style';
import { addPickerExpenseBulk, addPickerWeightBulk } from '@network/picker-service';
import DateTimePicker from '@components/DateTime';
import DropdownPicker from '@components/dropdown';
import { sumBy } from 'lodash';
import { assignedPickers, unassignPickers } from '@utils/helper';

export default function AddPickerBulkExpense() {
    const { colors } = useTheme();
    const { params: { pickers, item: group, groups } } = useRoute();

    let pickersData = useCallback(
        group?.id ? assignedPickers(pickers, group) : pickers,
        [pickers, group],
    );

    let unassignedPickersData = useCallback(
        group?.id ? unassignPickers(pickers, groups, group?.id) : pickers,
        [pickers, group, groups],
    );

    const [date, setDate] = useState(new Date());
    const [data, setData] = React.useState(
        pickersData.map(obj => ({
            name: obj.name,
            amount: '',
            pid: obj.id,
            total_given: obj.total_given,
        })),
    );
    const [loading, setLoading] = React.useState(false);
    const [showDate, setShowDate] = useState(false);

    const addExpenses = async () => {
        try {
            setLoading(true);
            await addPickerExpenseBulk(data, date, pickers);
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    };

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header back label={strings.picker_expense} />
            <ScrollView
                style={styles.form}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
                automaticallyAdjustKeyboardInsets
                keyboardShouldPersistTaps="always">
                <Pressable
                    onPress={() => {
                        setShowDate(true);
                        Keyboard.dismiss();
                    }}>
                    <Input
                        editable={false}
                        leftComponent={
                            <Text h4 color={colors.border} style={{ marginLeft: 10 }}>
                                Date:{' '}
                            </Text>
                        }
                        placeholder={strings.date}
                        value={dateFormat(date)}
                        onPress={() => {
                            setShowDate(true);
                            Keyboard.dismiss();
                        }}
                    />
                </Pressable>
                {data.map((picker, i) => (
                    <View key={picker?.name} style={common.row_btw}>
                        <DropdownPicker
                            value={picker?.name}
                            data={unassignedPickersData.filter(
                                p =>
                                    !data.some(d => d.name === p.name) || p.name == picker?.name,
                            )}
                            // disable={data.length == pickers.length && picker?.name}
                            labelField="name"
                            valueField="name"
                            style={{ width: '40%' }}
                            dropdownStyle={{
                                minHeight: 45,
                                marginTop: 0,
                                overflow: 'hidden',
                                borderColor: picker?.amount ? colors.success : colors.error,
                                backgroundColor: picker?.amount
                                    ? colors.success + 20
                                    : colors.error + 20,
                            }} onChange={value => {
                                setData(prevs => {
                                    let data = [...prevs];
                                    data[i].name = value.name;
                                    data[i].rate = value.rate;
                                    data[i].total_given = value.total_given;
                                    data[i].amount = '';
                                    data[i].pid = value.id;
                                    return data;
                                });
                            }}
                        />
                        <Input
                            placeholder={strings.amount}
                            value={currencyInput(picker?.amount)}
                            maxLength={30}
                            multiline
                            setValue={value =>
                                setData(prevs => {
                                    let data = [...prevs];
                                    data[i].amount = value.replace(/[^0-9]/g, '');
                                    return data;
                                })
                            }
                            style={{ width: '50%' }}
                            inputStyle={{ width: '85%', }}
                            innerStyle={{
                                borderColor: picker?.amount ? colors.success : colors.error,
                            }}
                            keyboardType="numeric"
                        />
                    </View>
                ))}
                {data.length < unassignedPickersData.length && data.every(o => o.name) ? (
                    <Button
                        label={strings.picker}
                        iconLeft={'plus'}
                        small
                        onPress={() =>
                            setData(prevs => {
                                let data = [...prevs];
                                if (data.every(o => o.name)) data.push({ name: '', amount: '' });
                                return data;
                            })
                        }
                        btnStyle={{ alignSelf: 'flex-end' }}
                    />
                ) : null}
                <DateTimePicker
                    show={showDate}
                    setShow={setShowDate}
                    date={date}
                    setDate={value => setDate(value)}
                />
                <Button label={strings.save} onPress={addExpenses} />
            </ScrollView>
        </BaseView>
    );
}
const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
