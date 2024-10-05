import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import BaseView from '@container/base';
import { goBack } from '@navigation/ref';
import { strings } from '@translations/locale';
import Header from '@components/header';
import Loader from '@components/loader';
import { ToastError, ToastSuccess } from '@utils/toast';
import { currencyInput, currentStamp, dateFormat } from '@utils/dateformat';
import { onChangeValue } from '@utils/helper';
import { common } from '@utils/style';
import {
    addPickerWeight,
    deletePickerCottonWeight,
    updatePickerCottonWeight,
} from '@network/picker-service';
import DateTimePicker from '@components/DateTime';
import DeleteModal from '@container/deleteModal';

export default function AddPickerWeight() {
    const { colors } = useTheme();
    const { params } = useRoute();
    const editData = params?.data ?? {};
    const editItem = params?.item ?? {};
    const [data, setData] = React.useState({
        detail: editItem?.detail ?? '',
        weight: editItem?.weight ? editItem.weight.toString() : '',
        rate: editItem?.rate ?? editData?.rate ?? '',
        date: editItem?.date ? new Date(parseInt(editItem?.date)) : new Date(),
    });

    const [loading, setLoading] = React.useState(false);
    const { detail, weight, rate, date } = data;
    const [showDate, setShowDate] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const onPress = useCallback(() => {
        if (editItem?.id) {
            updateData();
        } else {
            addNew();
        }
    }, [detail, weight, rate, date]);

    const updateData = async () => {
        if (rate.trim() == '' || parseInt(rate) <= 0) {
            return ToastError(strings.rate);
        }
        if (weight.trim() == '' || parseInt(weight) <= 0) {
            return ToastError(strings.weight);
        }
        try {
            setLoading(true);
            await updatePickerCottonWeight({
                ...data,
                total_earning: (
                    parseFloat(editData?.total_earning ?? 0) +
                    (parseFloat(weight) * parseFloat(rate) -
                        parseFloat(editItem?.weight) * parseFloat(editItem?.rate))
                ).toFixed(2),
                total_weight: (
                    parseFloat(editData?.total_weight ?? 0) +
                    (parseFloat(weight) - parseFloat(editItem?.weight))
                ).toFixed(2),

                id: editItem?.id,
                date: currentStamp(date),
            }, editItem, editData);
            setLoading(false);
            ToastSuccess(strings.successfully_updated);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    };

    const addNew = useCallback(async () => {
        if (rate.trim() == '' || parseInt(rate) <= 0) {
            return ToastError(strings.rate);
        }
        if (weight.trim() == '' || parseInt(weight) <= 0) {
            return ToastError(strings.weight);
        }
        try {
            setLoading(true);
            await addPickerWeight({
                ...data,
                total_earning: (
                    parseFloat(editData?.total_earning ?? 0) +
                    parseFloat(weight) * parseFloat(rate)
                ).toFixed(2),
                total_weight: (
                    parseFloat(editData?.total_weight ?? 0) + parseFloat(weight)
                ).toFixed(2),
                pid: editData?.id,
                date: currentStamp(date),
            }, editData);
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    }, [detail, weight, rate, date]);

    const onDelete = useCallback(async () => {
        try {
            setLoading(true);
            await deletePickerCottonWeight(editItem, editData);
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message, strings.loan);
        }
    }, [editItem]);

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header back label={editData?.name} />
            <ScrollView
                style={styles.form}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
                automaticallyAdjustKeyboardInsets
                keyboardShouldPersistTaps="always">
                <View style={common.row_btw}>
                    <Input
                        label={strings.weight}
                        placeholder={strings.weight}
                        autoFocus
                        value={weight}
                        maxLength={10}
                        setValue={value =>
                            onChangeValue({ setData, key: 'weight', value, isAmount: true })
                        }
                        style={{ width: '55%' }}
                        keyboardType="numeric"
                    />
                    <Input
                        label={strings.enter_rate}
                        placeholder={strings.enter_rate}
                        value={currencyInput(rate)}
                        maxLength={10}
                        setValue={value =>
                            onChangeValue({
                                setData,
                                key: 'rate',
                                value,
                                isAmount: true,
                            })
                        }
                        style={{ width: '40%' }}
                        keyboardType="numeric"
                    />
                </View>
                <Pressable
                    onPress={() => {
                        setShowDate(true);
                        Keyboard.dismiss();
                    }}>
                    <Input
                        label={strings.date}
                        editable={false}
                        placeholder={strings.date}
                        value={dateFormat(date)}
                        onPress={() => {
                            setShowDate(true);
                            Keyboard.dismiss();
                        }}
                    />
                </Pressable>
                <Input
                    label={strings.remark}
                    placeholder={strings.remark}
                    value={detail}
                    setValue={value =>
                        onChangeValue({ setData, key: 'detail', value, isName: true })
                    }
                />
                <DateTimePicker
                    show={showDate}
                    setShow={setShowDate}
                    date={date}
                    setDate={value => onChangeValue({ setData, key: 'date', value })}
                />
                <Button label={strings.save} onPress={onPress} />
                {editItem?.id ? (
                    <>
                        <Button
                            iconLeft="delete"
                            label={strings.delete}
                            btnStyle={{
                                // width: '40%',
                                backgroundColor: colors.error,
                            }}
                            onPress={() => setOpenModal(true)}
                        />
                        <DeleteModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            data={editData}
                            customDescription={` ${weight} Kg${strings.alert_single_delete}`}
                            onDelete={onDelete}
                        />
                    </>
                ) : null}
            </ScrollView>
        </BaseView>
    );
}
const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
