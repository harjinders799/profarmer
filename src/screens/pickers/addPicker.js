import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
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
import { submitLoan, updateLoanName } from '@network/loan-service';
import { currencyInput } from '@utils/dateformat';
import { onChangeValue } from '@utils/helper';
import { getUserByPhone } from '@network/auth-service';
import auth from '@react-native-firebase/auth';
import Icon from '@components/icon';
import Animated from 'react-native-reanimated';
import { common } from '@utils/style';
import { submitPicker } from '@network/picker-service';

export default function AddPicker() {
    const user = auth().currentUser;
    const { colors } = useTheme();
    const { params } = useRoute();
    const editData = params?.data ?? {};
    const [data, setData] = React.useState({
        name: editData?.name ?? '',
        phone: editData?.phone ?? '',
        rate: editData?.rate ?? '',
    });
    const [loading, setLoading] = React.useState(false);
    const { name, phone, rate } = data;
    const [verifiedUser, setVerifiedUser] = useState({});
    const [checking, setChecking] = useState(false);

    const onPress = useCallback(() => {
        if (editData?.name) {
            updateData();
        } else {
            addNew();
        }
    }, [name, phone, rate]);

    const updateData = async () => {
        if (!name || name.trim() == '') {
            ToastError(strings.receiver_name);
        } else if (rate.trim() == '' || parseInt(rate) <= 0) {
            ToastError(strings.rate);
        } else {
            setLoading(true);
            await updateLoanName(editData?.name, { ...data, name: name.trim() });
            setLoading(false);
            ToastSuccess(strings.successfully_updated);
            goBack();
        }
    };

    const addNew = useCallback(async () => {
        if (!name || name.trim() == '') {
            return ToastError(strings.name);
        }
        if (rate.trim() == '' || parseInt(rate) <= 0) {
            return ToastError(strings.rate);
        }
        try {
            setLoading(true);
            await submitPicker({ ...data, name: name.trim(), receiverId: verifiedUser?.id });
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    }, [name, phone, rate]);

    const checkUser = useCallback(async (value) => {
        try {
            setChecking(true);
            let res = await getUserByPhone(value ?? phone);
            if (user.uid == res?.id) ToastError("You can't add yourself");
            else setVerifiedUser(res);
            setChecking(false);
        } catch (error) {
            setChecking(false);
            console.log(error);
            ToastError(error?.messageHI);
        }
    }, [phone])

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header back label={editData?.name ? strings.update : strings.add_picker} />
            <ScrollView style={styles.form} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="always">
                <Input
                    label={strings.name}
                    autoFocus
                    placeholder={strings.name}
                    value={name}
                    setValue={value =>
                        onChangeValue({ setData, key: 'name', value, isName: true })
                    }
                />
                <Input
                    label={strings.phone}
                    placeholder={strings.phone}
                    value={phone.replace('+91', '')}
                    maxLength={10}
                    setValue={value => {
                        onChangeValue({ setData, key: 'phone', value, isPhone: true });
                        if (value && value.length == 10) checkUser(value)
                        else setVerifiedUser(undefined);
                    }}
                    keyboardType="numeric"
                // onBlur={checkUser}
                />
                {verifiedUser?.id ? (
                    <Animated.View
                        style={[
                            common.row_btw,
                            {
                                // backgroundColor: colors.success,
                                borderRadius: 8,
                                padding: 5,
                                paddingHorizontal: 10,
                            },
                        ]}>
                        <Text color={colors.success}>
                            {`User registered with name -`}
                            <Text bold color={colors.success}>
                                {` ${verifiedUser?.name}`}
                            </Text>
                        </Text>

                        <Icon
                            name={'user-check'}
                            type="Feather"
                            color={colors.background}
                            size={15}
                        />
                    </Animated.View>
                ) : checking ? (
                    <ActivityIndicator color={colors.text} />
                ) : verifiedUser == 'user not found' ? (
                    <Text color={colors.error}>User not using this app yet</Text>
                ) : null}
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
                    keyboardType="numeric"
                />
                <Button label={strings.save} onPress={onPress} />
            </ScrollView>
        </BaseView>
    );
}
const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
});
