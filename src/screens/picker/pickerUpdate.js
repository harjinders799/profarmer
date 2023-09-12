import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import Icon from '../../components/icon'
import { cyan, gray2, gray3, green, greenDark, orange, red, white } from '../../utils/color'
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
import AddPickerExpense from './addPickerExpense';
import Input from 'src/components/input';
import BaseView from 'src/container/base';
import DateTimePick from 'src/components/DateTime';
import auth from '@react-native-firebase/auth';
import { sumBy } from 'lodash';

export default function PickerUpdate() {
    const { params } = useRoute();
    // const data = params?.data ?? {};
    // const { colors } = useTheme();
    const editData = params?.data ?? {};

    const [data, setData] = React.useState({
        id: editData?.id ?? '',
        picker: editData?.picker ?? '',
        uid: auth().currentUser?.uid,
        fid: editData?.fid ?? '',
        detail: editData?.detail ?? '',
        rate: editData?.rate ?? '',
        weight: editData?.weight ?? '',
        date: editData?.date ? new Date(parseInt(editData?.date)) : new Date(),
    });
    const [loading, setLoading] = React.useState(false);
    const [showDate, setShowDate] = React.useState(false);
    const { picker, detail, date, rate, weight } = data;
    const { db, pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
        useCotton();
    let pickerData = pickerWeight.filter(o => data?.picker === o.picker);
    let pickerExpenseData = pickerExpense.filter(o => data?.picker === o.picker);


    useFocusEffect(
        useCallback(() => {
            getPickerWeight();
            getPickerExpense();
        }, []),
    );
    let amount =
        sumBy(pickerData, o => parseFloat(o.weight) * parseFloat(o?.rate)) -
        sumBy(pickerExpenseData, o => parseFloat(o.amount));


    const delteData = async () => {
        Alert.alert(
            strings.weight,
            `${strings.delete_wt} ${data?.weight}Kg`,
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        await deletePickerData(db, data)
                        if (data?.fid) await deletePicker(data?.fid);
                        getPickerWeight();
                        setLoading(false);
                        ToastSuccess(strings.weight_delete, 'Weight');
                        // goBack()
                    },
                },
                {
                    text: 'No',
                }, View
            ],
            { cancelable: true },
        );
    };
    console.log("=++++++++++undifind+++++++=", data)
    return (
        <BaseView style={styles.container}>
            <View style={[styles.list, { display: data?.weight != 0 ? 'flex' : 'none' }]}>
                <Loader visible={loading} />
                <Header
                    style={{ marginTop: 10 }}
                    leftComponent={
                        <Icon
                            name="back"
                            size={28}
                            onPress={() => goBack()}
                        />
                    }
                    centerComponent={<Text h2>{data.picker}</Text>}
                    rightComponent={<Text h2> </Text>}
                />
                <View style={[styles.row]}>
                    <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}> {strings.weight}</Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {data?.weight}kg
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>{strings.enter_rate}</Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {currencyFormat(data?.rate)}
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}> {strings.total_amount}</Text>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {currencyFormat(
                                parseFloat(data.weight) * parseFloat(data.rate)
                            )}
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#e5e5e5' }]}>
                        <TouchableOpacity
                            style={[styles.date, { borderColor: gray3 }]}
                            onPress={() => setShowDate(true)}>
                            <Text h3 medium>
                                {dateFormat(date)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.icons}>
                    <Button
                        iconName="edit"
                        iconColor={white}
                        btnStyle={{
                            width: '40%',
                            position: 'absolute',
                            left: 15,
                            zIndex: 999,

                        }}
                        onPress={() => navigate('AddPickerWeight', { data })}
                    />
                    <Button
                        iconName="delete"
                        iconColor={white}
                        btnStyle={{
                            width: '40%',
                            position: 'absolute',
                            right: 0,
                            zIndex: 999,
                        }}
                        onPress={delteData}
                    />
                </View>
                {data?.detail ?
                    <Text h4>{data?.detail}</Text>
                    : null}

            </View>
        </BaseView>
    )
}

const styles = StyleSheet.create({
    icons: {
        flexDirection: 'row',
        right: "5%",
        marginTop: "10%",
    },
    list: {
        marginVertical: 15,
        width: '98%',
        borderBottomWidth: 0.3,
        borderBottomColor: gray2
    },
    box: {
        backgroundColor: green,
        width: "100%",
        height: "12%",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: "dashed",
        marginTop: 10
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
        flexDirection: "row",
        justifyContent: "space-between"
    },
})