import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from '../../components/icon';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { orange, red } from 'src/utils/color';
import { replace } from 'src/navigation/ref';
import { strings } from 'src/translations/locale';
import { ToastError, ToastSuccess } from 'src/utils/toast';
import Loader from 'src/components/loader';
import { dateFormat } from 'src/utils/dateformat';
import { useRoute, useTheme } from '@react-navigation/native';
import { deleteLabour, getLabourExpense } from '../../network/labour-service';
import { gray2, green, white } from '../../utils/color';
import { currencyFormat } from '../../utils/dateformat';
import { goBack } from '../../navigation/ref';
import Header from '../../components/header';
import Button from '../../components/button';

export default function LabourUpdate() {
    const [loading, setLoading] = React.useState(false);
    const { colors } = useTheme();
    const { params } = useRoute();
    const data = params?.data ?? {};
    const { db, getLabour } = useState();

    const delteData = async () => {
        Alert.alert(
            // strings.labour,
            // `${strings.delete_wt} ${(data, rate?.labour)}`,
            `${data.count} ${strings.labour}`,
            `${strings.delete_wt}`,
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        await deleteLabour(data?.id);
                        // if ((data, rate?.fid)) await deleteLabour(data, rate?.fid);
                        // getLabour();
                        setLoading(false);
                        ToastSuccess(strings.labour_deleted, strings.labour);
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
    return (
        <BaseView style={styles.container}>
            <View
                style={[styles.list, { backgroundColor: white }]}>
                <Loader visible={loading} />
                <Header
                    style={{ marginTop: 10 }}
                    leftComponent={
                        <Icon name="back" size={28} onPress={() => goBack()} />
                    }
                    centerComponent={<Text h2>{data.labour}</Text>}
                    rightComponent={<Text h2> </Text>}
                />
                <View style={[styles.row]}>
                    <Text h3 style={{ marginVertical: 10 }}>
                        {dateFormat(data?.date)}
                    </Text>
                    <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                        {' ' + strings.labour}
                        </Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {data?.count}
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
                        <Text h3 style={{ fontWeight: 'bold' }}>
                            {strings.labour_rate}</Text>
                        <Text h3 numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {currencyFormat(data?.rate)}</Text>
                    </View>
                    {!data?.is_regulare ? (
                        <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
                            <Text h3 style={{ fontWeight: 'bold' }}>
                                {strings.total_labour}
                            </Text>
                            <Text h3 style={{ fontWeight: 'bold' }}>
                                {currencyFormat(parseFloat(data?.rate) * parseFloat(data?.count))}
                            </Text>
                        </View>
                    ) : null}
                    <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
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
                        onPress={() => replace('AddLabour', { data })}
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
