import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import BaseView from '@container/base';
import Text from '@components/text';
import Header from '@components/header';
import auth from '@react-native-firebase/auth';
import Loader from '@components/loader';
import DropdownPicker from '@components/dropdown';
import Button from '@components/button';
import { ToastError, ToastSuccess } from '@utils/toast';
import { getAllUsers } from '@network/auth-service';
import { strings } from '@translations/locale';
import { common } from '@utils/style';
import { updatePickerAccess } from '@network/picker-service';
import { goBack } from '@navigation/ref';

export default function PickerAccessSetting() {
    const {
        params: { owner },
    } = useRoute();
    const myId = auth().currentUser?.uid;
    const { colors } = useTheme();
    const [userDetails, setUserDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fullAccess, setFullAccess] = useState(owner.full_access || []);
    const [readAccess, setReadAccess] = useState(owner.read_access || []);
    const [saving, setSaving] = useState(false);
    console.log(owner)
    useEffect(() => {
        fetchUserDetails();
    }, [owner]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const users = await getAllUsers();
            setUserDetails(users);
        } catch (error) {
            ToastError(error?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFullAccessChange = value => {
        if (value.includes(myId)) {
            setFullAccess(value);
        } else {
            ToastError(strings.cannot_remove_self);
        }
    };

    const handleReadAccessChange = value => {
        if (value.includes(myId)) {
            ToastError(strings.cannot_add_self);
        } else {
            setReadAccess(value);
        }
    };

    const onSave = async () => {
        try {
            setSaving(true);
            await updatePickerAccess({
                id: owner?.id,
                full_access: fullAccess,
                read_access: readAccess,
            });
            ToastSuccess(strings.successfully_updated)
            setTimeout(goBack, 2000);
        } catch (error) {
            ToastError(error?.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <BaseView>
            <Header back label={owner?.name} />
            {/* <View style={[styles.container, { backgroundColor: colors.secondaryCard }]}>
                <Text semi h4>
                    {strings.full_access}
                </Text>
                <Text center style={{ marginVertical: 10 }}>
                    {strings.full_access_description.replace('{picker}', owner?.name)}
                </Text>
                <DropdownPicker
                    value={fullAccess}
                    data={userDetails.filter(user => !readAccess.includes(user.id))}
                    labelField="name"
                    valueField="id"
                    multiple
                    onChange={handleFullAccessChange}
                    search
                />
                <Loader visible={loading} small />
            </View> */}
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text semi h4>
                    {strings.read_access}
                </Text>
                <Text center style={{ marginVertical: 10 }}>
                    {strings.read_access_description.replace('{picker}', owner?.name)}
                </Text>
                <DropdownPicker
                    value={readAccess}
                    data={userDetails.filter(user => !fullAccess.includes(user.id))}
                    labelField="name"
                    valueField="id"
                    multiple
                    onChange={handleReadAccessChange}
                    search
                />
                <Loader visible={loading} small />
            </View>
            <Button
                loading={saving}
                btnStyle={styles.saveButton}
                label={strings.save}
                onPress={onSave}
            />
        </BaseView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginTop: 20,
        ...common.card,
        ...common.shadow,
    },
    saveButton: {
        width: '80%',
    },
});
