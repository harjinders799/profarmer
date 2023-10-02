import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import Icon from '../../components/icon';
import { green, white } from '../../utils/color';
import { ToastSuccess } from '../../utils/toast';
import { useRoute } from '@react-navigation/native';
import { goBack, navigate, replace } from '../../navigation/ref';
import Text from '../../components/text';
import { currencyFormat, dateFormat } from '../../utils/dateformat';
import Header from '../../components/header';
import Button from '../../components/button';
import { strings } from '../../translations/locale';
import BaseView from 'src/container/base';
import moment from 'moment';
import { deleteCrop } from '../../network/interest-service';
import Loader from '../../components/loader';


export default function CropUpdate() {
    const { params } = useRoute();
    const data = params?.data ?? {};
    const [loading, setLoading] = React.useState(false);

    const delteData = async () => {
        Alert.alert(
            `${data?.amount} Rs`,
            `${strings.delete_wt}`,
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        await deleteCrop(data?.id);
                        setLoading(false);
                        ToastSuccess(strings.amount_deleted, strings.amount);
                        goBack();
                    },
                },
                {
                    text: 'No',
                },
            ],
            { cancelable: true },
        );
    };
    let date = moment(data?.date).format("YYYY-MM-DD");
    let start_date = moment(date);
    let today = moment();
    let days = today.diff(start_date, 'days');
    let interest = (
        ((parseFloat(data?.amount) * (parseFloat(data?.interest_rate) / 100)) /
            30) *
        parseInt(days)
    ).toFixed(2);
    let final_amount = parseFloat(data?.amount) + parseFloat(interest);
    return (
        <BaseView style={styles.container}>
            <View
                style={[styles.list, { display: data?.amount != 0 ? 'flex' : 'none' }]}>
                <Loader visible={loading} />
                <Header
                    style={{ marginTop: 10 }}
                    leftComponent={
                        <Icon name="back" size={28} color={green} onPress={() => goBack()} />
                    }
                    centerComponent={<Text h2 style={{ color: green, fontWeight: "bold", fontStyle: "italic" }}>
                        {data.crop}</Text>}
                    rightComponent={<Text h2> </Text>}
                />
                <View style={[styles.row]}>
                    <Text h3 style={{ marginVertical: 10 }}>
                        {dateFormat(data?.date)}
                    </Text>
                    <View style={[styles.card]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {strings.crop_total}
                        </Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {currencyFormat(data?.amount)}
                        </Text>
                    </View>
                    <View style={[styles.card]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {strings.day}
                        </Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {days}
                        </Text>
                    </View>
                    <View style={[styles.card]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {strings.total_interest}
                        </Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {currencyFormat(interest)}
                        </Text>
                    </View>
                    <View style={[styles.card]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {' '}
                            {strings.total_amount}
                        </Text>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {currencyFormat(final_amount)}
                        </Text>
                    </View>
                    <View style={[styles.card,]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
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
                        onPress={() => replace('AddCrop', { data })}
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
    },
    card: {
        borderWidth: 2,
        borderColor: green + 50,
        backgroundColor: white,
        width: '100%',
        marginVertical: 5,
        padding: 10,
        elevation: 5,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});