import React, { useState, useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import BaseView from '@container/base';
import { goBack } from '@navigation/ref';
import { strings } from '@translations/locale';
import Header from '@components/header';
import Loader from '@components/loader';
import { ToastError, ToastSuccess } from '@utils/toast';
import { onChangeValue, unassignPickers } from '@utils/helper';
import { createGroup, deleteGroup, updateGroup } from '@network/picker-service';
import DropdownPicker from '@components/dropdown';
import Icon from '@components/icon';

export default function CreatePickerGroup() {
    const { colors } = useTheme();
    const { params } = useRoute();
    const editData = params?.item ?? {};
    const pickers = params?.pickers ?? {};
    const groups = params?.groups ?? {};
    const [data, setData] = React.useState({
        name: editData?.name ?? '',
        members: editData?.members ?? [],
    });
    const [loading, setLoading] = React.useState(false);
    const { name, phone, members } = data;

    const onPress = useCallback(() => {
        if (editData?.id) {
            updateData();
        } else {
            addNew();
        }
    }, [name, phone, members]);

    const updateData = async () => {
        if (!name || name.trim() == '') {
            return ToastError(strings.receiver_name);
        }
        if (members.length == 0) {
            return ToastError(strings.select_picker);
        }
        setLoading(true);
        await updateGroup({ id: editData?.id, ...data, name: name.trim() });
        setLoading(false);
        ToastSuccess(strings.successfully_updated);
        goBack();
    };

    const addNew = useCallback(async () => {
        if (!name || name.trim() == '') {
            return ToastError(strings.name);
        }
        if (members.length == 0) {
            return ToastError(strings.select_picker);
        }
        try {
            setLoading(true);
            await createGroup({ ...data, name: name.trim() });
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    }, [name, phone, members]);

    const onDelete = async () => {
        try {
            setLoading(true);
            await deleteGroup(editData?.id);
            setLoading(false);
            ToastSuccess(strings.successfully_deleted);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    };

    let unassignedPickersData = useCallback(
        unassignPickers(pickers, groups, editData?.id),
        [editData, pickers, groups],
    );

    return (
        <BaseView space>
            <Loader visible={loading} />
            <Header
                back
                label={editData?.name ? strings.update : strings.create_group}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Input
                    label={strings.group_name}
                    autoFocus
                    placeholder={strings.group_name}
                    autoCapitalize="words"
                    value={name}
                    setValue={value =>
                        onChangeValue({ setData, key: 'name', value, isName: true })
                    }
                />
                <DropdownPicker
                    data={unassignedPickersData}
                    search
                    label={strings.select_picker}
                    multiple
                    labelField="name"
                    valueField="id"
                    placeholder={strings.select_picker}
                    value={members}
                    onChange={value => {
                        onChangeValue({ setData, key: 'members', value });
                    }}
                    renderRightIcon={() => <Icon name={'plus'} size={20} color={colors.success} />}
                />
                <Button label={strings.save} onPress={onPress} />
                {editData?.id ? (
                    <Button
                        label={strings.delete}
                        btnStyle={{ backgroundColor: colors.error }}
                        onPress={onDelete}
                    />
                ) : null}
            </ScrollView>
        </BaseView>
    );
}
