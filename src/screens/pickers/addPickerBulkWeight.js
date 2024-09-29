import React, { useState } from 'react';
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
import { dateFormat } from '@utils/dateformat';
import Icon from '@components/icon';
import { common } from '@utils/style';
import { addPickerWeightBulk } from '@network/picker-service';
import DateTimePicker from '@components/DateTime';
import DropdownPicker from '@components/dropdown';
import { sumBy } from 'lodash';

export default function AddPickerBulkWeight() {
    const { colors } = useTheme();
    const { params } = useRoute();
    const pickers = params?.pickers;
    const [date, setDate] = useState(new Date());
    const [data, setData] = React.useState(
        pickers.map(obj => ({
            name: obj.name,
            weight: '',
            rate: obj.rate,
            pid: obj.id,
            total_earning: obj.total_earning,
            total_weight: obj.total_weight,
        })),
    );
    const [loading, setLoading] = React.useState(false);
    const [showDate, setShowDate] = useState(false);

    const addWeight = async () => {
        try {
            setLoading(true);
            await addPickerWeightBulk(data, date, pickers);
            setLoading(false);
            ToastSuccess(strings.weight_added);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message, strings.picker);
        }
    };

    const addMoreWeight = i => {
        setData(prevs => {
            let data = [...prevs];
            if (
                data[i].weight.length &&
                data[i].weight.charAt(data[i].weight.length - 1) !== '+'
            )
                data[i].weight += '+';
            return data;
        });
    };

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header back label={strings.pickers_weight} />
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
                        <Icon
                            name={'close'}
                            size={20}
                            color={colors.error}
                            onPress={() =>
                                setData(prevs => {
                                    let data = [...prevs];
                                    let filtered = data.filter(obj => obj.name != picker.name);
                                    return filtered;
                                })
                            }
                        />
                        <DropdownPicker
                            value={picker?.name}
                            data={pickers.filter(
                                p =>
                                    !data.some(d => d.name === p.name) || p.name == picker?.name,
                            )}
                            // disable={data.length == pickers.length && picker?.name}
                            labelField="name"
                            valueField="name"
                            style={{ width: '40%' }}
                            dropdownStyle={{ minHeight: 45, marginTop: 0 }}
                            onChange={value => {
                                setData(prevs => {
                                    let data = [...prevs];
                                    data[i].name = value.name;
                                    data[i].rate = value.rate;
                                    data[i].total_earning = value.total_earning;
                                    data[i].total_weight = value.total_weight;
                                    data[i].weight = '';
                                    data[i].pid = value.id;
                                    return data;
                                });
                            }}
                        />
                        <Input
                            // label={strings.weight}
                            placeholder={strings.weight}
                            value={picker?.weight}
                            maxLength={30}
                            multiline
                            setValue={value =>
                                setData(prevs => {
                                    let data = [...prevs];
                                    data[i].weight = value.replace(/[^0-9+]/g, '');
                                    return data;
                                })
                            }
                            style={{ width: '50%' }}
                            inputStyle={{ width: '85%', height: 45 + picker?.weight.length }}
                            keyboardType="numeric"
                            rightComponent={
                                <>
                                    <Text style={{ position: 'absolute', bottom: 0, right: 5 }}>
                                        =
                                        {sumBy(picker?.weight.split('+'), v =>
                                            parseFloat(v ? v : 0),
                                        )}
                                    </Text>
                                    <Pressable hitSlop={20} onPress={() => addMoreWeight(i)}>
                                        <Icon
                                            name={'plus'}
                                            color={colors.success}
                                            size={20}
                                            onPress={() => addMoreWeight(i)}
                                        />
                                    </Pressable>
                                </>
                            }
                        />
                    </View>
                ))}
                {data.length < pickers.length && data.every(o => o.name) ? (
                    <Button
                        label={strings.picker}
                        iconLeft={'plus'}
                        small
                        onPress={() =>
                            setData(prevs => {
                                let data = [...prevs];
                                if (data.every(o => o.name)) data.push({ name: '', weight: '' });
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
                <Button label={strings.save} onPress={addWeight} />
            </ScrollView>
        </BaseView>
    );
}
const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
