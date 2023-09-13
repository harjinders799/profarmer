import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import Icon from '../../components/icon';
import {
    white,
} from '../../utils/color';
import { ToastError, ToastSuccess } from '../../utils/toast';
import { deletePickerData, savePickerData, updatePickerData } from '../../sql';
import { useCotton } from '../../context/cottonContext';
import { deletePicker } from '../../network/picker-service';
import Loader from '../../components/loader';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import { goBack, navigate } from '../../navigation/ref';
import Text from '../../components/text';
import { currencyFormat, currentStamp, dateFormat } from '../../utils/dateformat';
import Header from '../../components/header';
import Button from '../../components/button';
import { strings } from '../../translations/locale';
import BaseView from 'src/container/base';

export default function PickerUpdate() {
    const { params } = useRoute();
    const data = params?.data ?? {};
    const [loading, setLoading] = React.useState(false);
    const { db, getPickerWeight } =
        useCotton();

    const delteData = async () => {
        Alert.alert(
            strings.weight,
            `${strings.delete_wt} ${data?.weight}Kg`,
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        await deletePickerData(db, data);
                        if (data?.fid) await deletePicker(data?.fid);
                        getPickerWeight();
                        setLoading(false);
                        ToastSuccess(strings.weight_delete, 'Weight');
                        goBack()
                    },
                },
                {
                    text: 'No',
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <BaseView style={styles.container}>
            <View
                style={[styles.list, { display: data?.weight != 0 ? 'flex' : 'none' }]}>
                <Loader visible={loading} />
                <Header
                    style={{ marginTop: 10 }}
                    leftComponent={
                        <Icon name="back" size={28} onPress={() => goBack()} />
                    }
                    centerComponent={<Text h2>{data.picker}</Text>}
                    rightComponent={<Text h2> </Text>}
                />
                <View style={[styles.row]}>
                    <Text h3 style={{ marginVertical: 10 }}>
                        {dateFormat(data?.date)}
                    </Text>
                    <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {' '}
                            {strings.weight}
                        </Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {data?.weight}kg
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {strings.enter_rate}
                        </Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {currencyFormat(data?.rate)}
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {' '}
                            {strings.total_amount}
                        </Text>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {currencyFormat(parseFloat(data.weight) * parseFloat(data.rate))}
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#e5e5e5' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {strings.date}
                        </Text>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {dateFormat(data?.date)}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: '#e5e5e5',
                                display: data?.detail ? 'flex' : 'none',
                            },
                        ]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {' '}
                            {strings.remark}
                        </Text>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {data?.detail}
                        </Text>
                    </View>
                </View>
                <View style={styles.icons}>
                    <Button
                        iconName="edit"
                        iconColor={white}
                        btnStyle={{
                            width: '40%',
                        }}
                        onPress={() => navigate('AddPickerWeight', { data })}
                    />
                    <Button
                        iconName="delete"
                        iconColor={white}
                        btnStyle={{
                            width: '40%',
                        }}
                        onPress={delteData}
                    />
                </View>
            </View>
        </BaseView>
    );
}

const styles = StyleSheet.create({
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    list: {
        marginVertical: 15,
        width: '100%',
    },
    row: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 5,
        flexWrap: 'wrap',
        // elevation: 5
    },
    card: {
        elevation: 5,
        backgroundColor: white,
        width: '100%',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
