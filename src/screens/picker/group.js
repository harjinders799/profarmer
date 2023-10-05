import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import {
    FlatList,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import _, { difference, find, groupBy, intersection } from 'lodash';
import { strings } from '../../translations/locale';
import BaseView from 'src/container/base';
import { createGroup, updateGroup } from '../../network/picker-service';
import { ToastError } from '../../utils/toast';
import { green, black, gray3, orange, white } from '../../utils/color';
import Button from '../../components/button';
import Icon from '../../components/icon';
import Loader from '../../components/loader';
import { useCotton } from '../../context/cottonContext';
import Header from '../../components/header';
import Input from '../../components/input';
import { updatePickerGid } from '../../sql';
import auth from '@react-native-firebase/auth';
import { goBack } from '../../navigation/ref';
import { useRoute } from '@react-navigation/native';

export default function Group() {
    const { params } = useRoute();
    const editData = params;
    const [loading, setLoading] = useState(false);
    const { pickerWeight, getPickerWeight, db } = useCotton();
    let grpPicker = groupBy(pickerWeight, v => (v?.gid ? null : v.picker));
    const [name, setName] = useState(editData?.name ?? '');
    const [selectedPicker, setSelectedPicker] = useState(editData?.pickers ?? []);

    const onClick = async item => {
        let arr = [...selectedPicker];
        let exist = selectedPicker.findIndex(o => o === item);
        if (selectedPicker.length > 0) {
            if (exist < 0) {
                arr.push(item);
            } else arr.splice(exist, 1);
        } else arr.push(item);
        if (arr.length == 0) {
            setSelectedPicker([]);
            return;
        }
        setSelectedPicker(arr);
    };

    const onSubmit = async () => {
        try {
            if (!name || name.trim() == '') {
                ToastError('Please Enter Group name');
                return;
            }
            if (selectedPicker.length == 0) {
                ToastError('Please select some picker');
                return;
            }
            setLoading(true);
            let api = editData?.id ? updateGroup : createGroup;
            let res = await api({
                name,
                pickers: selectedPicker,
                id: editData?.id ?? '',
            });
            let promise = selectedPicker.map(
                async o =>
                    await updatePickerGid(db, {
                        uid: auth().currentUser.uid,
                        gid: res,
                        gname: name,
                        picker: o,
                    }),
            );
            if (editData?.id) {
                let promise2 = difference(editData?.pickers, selectedPicker).map(
                    async o =>
                        await updatePickerGid(db, {
                            uid: auth().currentUser.uid,
                            gid: 'null',
                            gname: 'null',
                            picker: o,
                        }),
                );
                await Promise.all(promise2);
            }
            await Promise.all(promise);
            await getPickerWeight();
            setLoading(false);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    };
    const renderItem = item => {
        return item != 'null' ? (
            <TouchableOpacity style={styles.list} onPress={() => onClick(item)}>
                <View style={styles.checkBox}>
                    {selectedPicker.length && selectedPicker.find(o => o == item) ? (
                        <View style={styles.checked} />
                    ) : null}
                </View>
                <Text
                    numberOfLines={1}
                    h3
                    style={{
                        paddingVertical: 5,
                    }}>
                    {item}
                </Text>
            </TouchableOpacity>
        ) : null;
    };

    return (
        <BaseView style={{ padding: 10 }}>
            <Header
                leftComponent={
                    <Icon name="back" size={28} color={black} onPress={() => goBack()} />
                }
                centerComponent={
                    <Text h2>{editData?.id ? editData?.name : strings.create_group}</Text>
                }
                rightComponent={<Text h2> </Text>}
            />
            <Text
                h5
                style={{
                    marginVertical: 10,
                    padding: 10,
                    width: '100%',
                    backgroundColor: orange,
                    color: white,
                    display: editData?.id ? 'none' : 'flex'
                }}>
                Note: {strings.group_warning}
            </Text>

            <Loader visible={loading} />
            <Input
                label={strings.group_name}
                autoFocus={editData?.id ? false : true}
                autoCapitalize="words"
                value={name}
                setValue={setName}
            />
            <Text h3 style={{ marginVertical: 10 }}>
                {strings.select_picker}
            </Text>
            <FlatList
                style={{ width: '100%', position: 'relative' }}
                contentContainerStyle={{ paddingBottom: 150 }}
                data={
                    Array.isArray(editData?.pickers)
                        ? [
                            ...editData?.pickers,
                            ...difference(Object.keys(grpPicker), editData?.pickers),
                        ]
                        : Object.keys(grpPicker)
                }
                keyExtractor={item => Math.random().toString()}
                ListEmptyComponent={() => (
                    <Text style={{ textAlign: 'center', paddingTop: 30 }}>
                        {strings.no_data}
                    </Text>
                )}
                extraData={pickerWeight}
                showsVerticalScrollIndicator={false}
                // ItemSeparatorComponent={() => <View style={styles.line} />}
                renderItem={({ item }) => renderItem(item)}
            />
            <Button
                label={strings.save}
                btnStyle={{
                    height: 40 * PixelRatio.getFontScale(),
                    position: 'absolute',
                    bottom: 20,
                    zIndex: 999,
                }}
                onPress={onSubmit}
            />
        </BaseView>
    );
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: green,
        paddingHorizontal: 15,
        paddingVertical: 15,
        elevation: 15,
    },
    list: {
        marginVertical: 10,
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        // backgroundColor:"red",
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 5,
    },
    icon: {
        elevation: 1,
        width: 30,
        height: 30,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 5,
    },
    checkBox: {
        marginRight: 10,
        width: 25,
        height: 25,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: gray3,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: green,
        width: 18,
        height: 18,
        borderRadius: 10,
    },
});
