import React, { memo, useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import {
    FlatList,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import _, { filter, sumBy } from 'lodash';
import { strings } from '../../translations/locale';
import { navigate } from 'src/navigation/ref';
import BaseView from 'src/container/base';
import { ToastError } from '../../utils/toast';
import {
    green,
    red,
    black,
    greenDark,
    gray3,
    blue,
} from '../../utils/color';
import { currencyFormat, kg } from '../../utils/dateformat';
import Button from '../../components/button';
import Icon from '../../components/icon';
import Loader from '../../components/loader';
import { useCotton } from '../../context/cottonContext';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import moment from 'moment';
import Header from '../../components/header';
import { getPickerFinal, updatePickerGid } from '../../sql';
import { goBack } from '../../navigation/ref';
import Search from '../../components/search';

export default function GroupDetail() {
    const {
        params: { name },
    } = useRoute();
    const { db, pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
        useCotton();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearchActive, setSearchActive] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getPickerWeight();
            getPickerExpense();
            getData();
        }, []),
    );
    const getData = async () => {
        try {
            setLoading(true);
            let data = await getPickerFinal(db);
            setData(
                filter(data, o => (name != 'null' ? o?.gname == name : !o?.gname)),
            );
            setLoading(false);
        } catch (error) {
            setLoading(false);
            ToastError(error?.message, 'Picker');
        }
    };

    const RenderItem = memo(({ item }) => {
        const todayWeight =
            sumBy(
                filter(
                    pickerWeight,
                    o =>
                        moment(o?.date).isSame(moment(), 'day') &&
                        o?.picker === item?.picker,
                ),
                p => parseFloat(p.weight),
            ) ?? 0;

        const todayExpense =
            sumBy(
                filter(
                    pickerExpense,
                    o =>
                        moment(o?.date).isSame(moment(), 'day') &&
                        o?.picker === item?.picker,
                ),
                p => parseFloat(p.amount),
            ) ?? 0;

        return (
            <TouchableOpacity
                style={[styles.list]}
                onPress={() => navigate('PickerDetail', { item })}>
                <View style={styles.row}>
                    <Text numberOfLines={1} h3 style={{ width: '60%' }}>
                        {item?.picker}
                    </Text>
                    <Text
                        numberOfLines={1}
                        h3
                        style={{
                            color:
                                (!isNaN(item?.total_rate_weight - item?.total_given_amount)
                                    ? item?.total_rate_weight - item?.total_given_amount
                                    : 0) >= 0
                                    ? greenDark
                                    : red,
                        }}>
                        {currencyFormat(
                            !isNaN(item?.total_rate_weight - item?.total_given_amount)
                                ? item?.total_rate_weight - item?.total_given_amount
                                : 0,
                        )}{' '}
                    </Text>
                </View>
                <View style={[styles.row, { marginVertical: 0 }]}>
                    <Text
                        style={{
                            fontSize: 15 / PixelRatio.getFontScale(),
                        }}>
                        {strings.today}
                        {'  '}
                        <Text style={{ color: todayWeight ? 'green' : 'red' }}>
                            {todayWeight ? todayWeight : ' - '} Kg{'  '}
                        </Text>
                        <Text style={{ color: todayExpense ? 'green' : 'red' }}>
                            {todayExpense ? `${todayExpense} Rs` : ''}
                        </Text>
                    </Text>
                    <Text
                        numberOfLines={1}
                        // h3
                        style={{
                            fontSize: 15 / PixelRatio.getFontScale(),
                            color:
                                (!isNaN(item?.total_rate_weight - item?.total_given_amount)
                                    ? item?.total_rate_weight - item?.total_given_amount
                                    : 0) >= 0
                                    ? green
                                    : red,
                        }}>
                        {(!isNaN(item?.total_rate_weight - item?.total_given_amount)
                            ? item?.total_rate_weight - item?.total_given_amount
                            : 0) >= 0
                            ? strings.give
                            : strings.receive}{' '}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Button
                        hitSlop={10}
                        label={strings.add_expense}
                        btnStyle={{
                            backgroundColor: blue,
                            width: 'auto',
                            paddingHorizontal: 8,
                            height: 25 * PixelRatio.getFontScale(),
                            borderRadius: 5,
                            marginVertical: 5,
                        }}
                        onPress={() =>
                            navigate('AddPickerExpense', { data: { picker: item?.picker } })
                        }
                    />
                    <Button
                        hitSlop={10}
                        label={strings.add_weight}
                        btnStyle={{
                            width: 'auto',
                            paddingHorizontal: 8,
                            height: 25 * PixelRatio.getFontScale(),
                            borderRadius: 5,
                            marginVertical: 5,
                        }}
                        onPress={() =>
                            navigate('AddPickerWeight', {
                                data: {
                                    picker: item?.picker,
                                    rate: pickerWeight[pickerWeight.length - 1]?.rate,
                                },
                            })
                        }
                    />
                </View>
            </TouchableOpacity>
        );
    });

    return (
        <BaseView style={{ padding: 10 }}>
            <Header
                leftComponent={
                    <Icon name="back" size={28} color={black} onPress={() => goBack()} />
                }
                centerComponent={<Text h2>{name != 'null' ? name : 'Other'}</Text>}
                rightComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* <Icon
                            name="pdffile1"
                            size={22}
                            color={black}
                            style={{ marginRight: 10 }}
                            onPress={() => setSearchActive(true)}
                        /> */}
                        <Icon
                            name="search1"
                            size={25}
                            color={black}
                            onPress={() => setSearchActive(true)}
                        />
                    </View>
                }
            />
            <View style={{ width: '100%' }}>
                <Search
                    isSearchActive={isSearchActive}
                    setSearchActive={setSearchActive}
                    data={data}
                    hidden
                />
            </View>
            <Loader visible={loading} />
            <FlatList
                style={{ width: '100%', display: isSearchActive ? 'none' : 'flex' }}
                contentContainerStyle={{ paddingBottom: 150 }}
                data={data}
                keyExtractor={item => Math.random().toString()}
                extraData={data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <RenderItem item={item} />}
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
