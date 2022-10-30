import * as React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { useAuth } from 'src/context/context'
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import DateTimePick from 'src/components/DateTime';
import moment from 'moment';
import { dateFormat } from 'src/utils/dateformat';
import BaseView from 'src/container/base';
import { WIDTH } from 'src/utils/constant';
import Header from 'src/components/header';
import Profile from 'src/container/profile';
import Icon from 'src/components/icon';

export default function LabourAdd({ setShowLabourForm }) {
    const { user } = useAuth();
    const [data, setData] = React.useState({
        id: "",
        rate: "",
        receiver: "",
        reason: "",
        count: "",
        category: "",
        type: "",
        date: moment.now(),
    });
    const [showDate, setShowDate] = React.useState(false);
    // const [catData, setCatData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const { colors } = useTheme();

    const { id, rate, receiver, reason, count, category, type, date } = data;

    const onChangeValue = (key, value) => {
        setData({
            ...data,
            [key]: value
        })
    }

    const onPress = () => {
    }

    const AddNew = async () => {
        if (rate.trim() == "" || receiver.trim() == "" || type.trim() == "" || count.trim() == "" || parseInt(count) <= 0 || category.trim() == "") {
            alert('Enter valid data!');
        } else {
            setLoading(true);
            let res = await createKhrach(data, user);
            setLoading(false);
            setData({
                id: "",
                rate: "",
                receiver: "",
                reason: "",
                count: "",
                category: "",
                type: "",
                date: moment.now(),
            });
            // }
        }
    };

    const update = async () => {
        setLoading(true);
        // await updateKhrach(data, item?.key, user);
        setLoading(false);
        setData({
            id: "",
            rate: "",
            receiver: "",
            reason: "",
            count: "",
            category: "",
            type: "",
            date: moment.now(),
        });
    }

    return (
        // <BaseView>
        // {/* <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 30, width: '90%' }}> */}
        <View style={styles.form}>
            <Input
                placeholder="Labour Name"
                value={receiver}
                autoCapitalize='words'
                setValue={(value) => onChangeValue('receiver', value)}
            />
            <Input
                placeholder="Number"
                value={count}
                keyboardType="numeric"
                setValue={(value) => onChangeValue('count', value)}
            />
            <Input
                placeholder="Labour Rate (300, 400..."
                value={rate}
                keyboardType="numeric"
                setValue={(value) => onChangeValue('rate', value)}
            />
            <Input
                placeholder="Detail"
                multiline
                autoCapitalize='words'
                value={reason}
                setValue={(value) => onChangeValue('reason', value)}
            />
            <TouchableOpacity style={styles.date} onPress={() => setShowDate(true)}>
                <Text h4 medium >{dateFormat(date)}</Text>
            </TouchableOpacity>

            <DateTimePick
                show={showDate}
                setShow={setShowDate}
                date={date}
                setDate={(data) => onChangeValue("date", data)}
            />
            <Button
                label="Add Labour"
                onPress={onPress}
            />
            <Button
                label="Cancel"
                onPress={setShowLabourForm}
            />
        </View>
        // {/* </ScrollView> */}
        // </BaseView>
    )
}
const styles = StyleSheet.create({
    type: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: 20,
    },
    date: {
        borderBottomWidth: 1,
        height: 50,
        marginBottom: 30,
        justifyContent: 'center',
    },
    form: {
        paddingVertical: 25,
        width: '100%'
    },
});
