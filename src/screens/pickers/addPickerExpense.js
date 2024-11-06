import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    ActivityIndicator,
    Pressable,
    Keyboard,
} from 'react-native';
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
import { currencyInput, currentStamp, dateFormat } from '@utils/dateformat';
import { onChangeValue } from '@utils/helper';
import { getUserByPhone } from '@network/auth-service';
import auth from '@react-native-firebase/auth';
import {
    addPickerExpense,
    deletePickerExpense,
    updatePickerExpense,
} from '@network/picker-service';
import DateTimePicker from '@components/DateTime';
import DeleteModal from '@container/deleteModal';

export default function AddPickerExpense() {
    const user = auth().currentUser;
    const { colors } = useTheme();
    const { params } = useRoute();
    const editData = params?.data ?? {};
    const editItem = params?.item ?? {};
    const [data, setData] = React.useState({
        detail: editItem?.detail ?? '',
        amount: editItem?.amount ?? '',
        date: editItem?.date ? new Date(parseInt(editItem?.date)) : new Date(),
    });
    const [loading, setLoading] = React.useState(false);
    const { detail, amount, date } = data;
    const [showDate, setShowDate] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const onPress = useCallback(() => {
        if (editItem?.id) {
            updateData();
        } else {
            addNew();
        }
    }, [detail, amount, date]);

    const updateData = useCallback(async () => {
        if (amount.trim() == '' || parseInt(amount) <= 0) {
            return ToastError(strings.amount);
        }
        try {
            setLoading(true);
            await updatePickerExpense({
                ...data,
                total_given: (
                    parseFloat(editData?.total_given ?? 0) +
                    (parseFloat(amount) - parseFloat(editItem?.amount))
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
    }, [detail, amount, date]);

    const addNew = useCallback(async () => {
        if (amount.trim() == '' || parseInt(amount) <= 0) {
            return ToastError(strings.amount);
        }
        try {
            setLoading(true);
            await addPickerExpense({
                ...data,
                total_given: (
                    parseFloat(editData?.total_given ?? 0) + parseFloat(amount)
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
    }, [detail, amount, date]);

    const onDelete = useCallback(async () => {
        try {
            setLoading(true);
            await deletePickerExpense(editItem.id);
            setLoading(false);
            ToastSuccess(strings.successfully_deleted);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    }, [editItem]);

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header back label={editData?.name} />
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="always">
                <Input
                    label={strings.amount}
                    placeholder={strings.amount}
                    autoFocus
                    value={currencyInput(amount)}
                    maxLength={10}
                    setValue={value =>
                        onChangeValue({ setData, key: 'amount', value, isAmount: true })
                    }
                    keyboardType="numeric"
                />
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
                        onChangeValue({ setData, key: 'detail', value })
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
                                backgroundColor: colors.error,
                            }}
                            onPress={() => setOpenModal(true)}
                        />
                        <DeleteModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            data={editData}
                            customDescription={` ${currencyInput(amount)}${strings.alert_single_delete}`}
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
