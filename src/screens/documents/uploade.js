import React, { useState } from 'react'
import Button from '../../components/button'
import { strings } from 'src/translations/locale';
import { PixelRatio, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/icon';
import Text from '../../components/text';
import BaseView from '../../container/base';
import Logo from '../../container/logo';
import { blue, gray10, gray3, lighlightBlue, lightBlue, lightRed, lightYellow, tBluelightRed, white } from '../../utils/color';
import Header from '../../components/header';
import { goBack, navigate } from '../../navigation/ref';
import { useRoute, useTheme } from '@react-navigation/native';
import Input from '../../components/input';
import { currentStamp, dateFormat } from 'src/utils/dateformat';
import DateTimePick from 'src/components/DateTime';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import { submitDocument, updateDocument } from '../../network/document-service';
import moment from 'moment';

export default function Uploade() {
    const { colors } = useTheme()
    const [filterBy, setFilterBy] = useState('wt');
    const editData = params?.data ?? {};
    const { params } = useRoute();
    const [data, setData] = useState({
        name: editData?.name ?? '',
        remark: editData?.remark ?? '',
        reminder_day: editData?.reminder_day ?? '',
        expiry_date: editData?.expiry_date ? new Date(editData?.date) : new Date() ?? '',
        date: editData?.date ? new Date(editData?.date) : new Date(),
    })
    const [showDate, setShowDate] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { name, remark, expiry_date, date, reminder_day } = data;
    const onChangeValue = (key, value) => {

        setData({
            ...data,
            [key]: value,
        });
    };
    const onPress = () => {
        if (editData.id) updateWt();
        else AddNew();
    };
    const updateWt = async () => {
        if (name() == '' || parseInt(name) <= 0) {
            ToastError(strings.document_name, 'ProFarmer');
        } else if (document.trim() == '' || parseInt(document) <= 0) {
            ToastError(strings.document_name, 'ProFarmer');
        } else {
            setLoading(true);
            let res = await updateDocument({
                ...data,
                date: currentStamp(date),
            });
            setLoading(false);
            ToastSuccess('strings.expiry_date', 'ProFarmer');
            goBack();
        }
    };
    const AddNew = async () => {
        let start_date = moment(moment(expiry_date).format('YYYY-MM-DD'));
        let today = moment();
        let days = start_date.diff(today, 'days');
        if (name.trim() == '' || parseInt(name) <= 0) {
            ToastError(strings.document_name, 'ProFarmer');
        }
        else if (days  < reminder_day) {
        console.log(reminder_day,'expiry_date', days)
        ToastError('Expiry date is less than reminder day', 'ProFarmer');
        
        }
         else {
            setLoading(true);
            let res = await submitDocument({
                ...data,
                date: currentStamp(date),
                expiry_date: currentStamp(expiry_date),
            });
            setLoading(false);
            ToastSuccess('strings.expiry_date', 'ProFarmer');
        goBack();
        }
    };
    return (
        <BaseView>
            <Header
                leftComponent={
                    <Icon
                        name="back"
                        size={28}
                        onPress={() => goBack()}
                    />
                }
            />
            <Text h2>{strings.document_details}</Text>
            <View style={styles.form}>
                <Input
                    label={strings.document_name}
                    autoFocus
                    placeholder={strings.document_name}
                    value={name}
                    setValue={value => onChangeValue('name', value)}
                />
                <Input
                    label={strings.remark}
                    placeholder={strings.remark}
                    value={remark}
                    setValue={value => onChangeValue('remark', value)}
                />
                <Text
                    style={{
                        color: gray10,
                        fontSize: 16,
                        paddingTop: 5,
                    }}>
                    {strings.expire_date}
                </Text>
                <TouchableOpacity
                    style={[styles.date, { borderColor: gray3 }]}
                    onPress={() => setShowDate(true)}>
                    <Text h3 medium>
                        {dateFormat(expiry_date)}
                    </Text>
                </TouchableOpacity>
                <DateTimePick
                    show={showDate}
                    setShow={setShowDate}
                    date={expiry_date}
                    setDate={data => onChangeValue('expiry_date', data)}
                />
            </View>
            <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{}}
                showsVerticalScrollIndicator={false}>
                <View>
                    <Text h3 style={{ fontname: "bold", marginTop: 10, alignSelf: "center" }}>{strings.reminder_time}</Text>
                </View>
                <View style={styles.button}>
                    <Button
                        label={'2 ' + strings.day_ago}
                        btnStyle={{
                            width: '50%',
                            height: 35 * PixelRatio.getFontScale(),
                            borderRadius: 15,
                            backgroundColor: reminder_day == 2 ? lightRed : gray3,
                        }}
                        onPress={() => onChangeValue('reminder_day', 2)}
                    />
                    <Button
                        label={'7 ' + strings.day_ago}
                        btnStyle={{
                            width: '50%',
                            height: 35 * PixelRatio.getFontScale(),
                            borderRadius: 15,
                            backgroundColor: reminder_day == 7 ? lightRed : gray3,
                        }}
                        onPress={() => onChangeValue('reminder_day', 7)}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        label={'15 ' + strings.day_ago}
                        btnStyle={{
                            width: '50%',
                            height: 35 * PixelRatio.getFontScale(),
                            borderRadius: 15,
                            backgroundColor: reminder_day == 15 ? lightRed : gray3,
                        }}
                        onPress={() => onChangeValue('reminder_day', 15)}
                    />
                    <Button
                        label={'30 ' + strings.day_ago}
                        btnStyle={{
                            width: '50%',
                            height: 35 * PixelRatio.getFontScale(),
                            borderRadius: 15,
                            backgroundColor: reminder_day == 30 ? lightRed : gray3,
                        }}
                        onPress={() => onChangeValue('reminder_day', 30)}
                    />
                </View>
                <Button label={strings.submit} onPress={AddNew} />
            </ScrollView>
        </BaseView>
    )
};
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        fontSize: 15,
        margin: 10,
        fontname: "bold",
        paddingVertical: 5
    },
    footer: {
        borderRadius: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: 'grey',
        margin: 20,
    },
    form: {
        paddingVertical: 25,
        width: "100%"
    },
    reminder: {
        flexDirection: "row",
        backgroundColor: lightRed,
        height: 50,
        width: "20%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20
    },
    date: {
        borderWidth: 1,
        height: 50,
        width: '100%',
        borderRadius: 10,
        marginVertical: 5,
        marginBottom: 30,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "75%",
        alignSelf: 'center'
    },
});