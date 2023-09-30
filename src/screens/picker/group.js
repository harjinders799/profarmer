import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, PixelRatio, StyleSheet, TouchableOpacity, View } from 'react-native';
import { white } from 'src/utils/color';
import _, { every, filter, find, groupBy, some, sortBy, sumBy } from 'lodash';
import { strings } from '../../translations/locale';
import { navigate } from 'src/navigation/ref';
import BaseView from 'src/container/base';

import {
    getAllPickerExpense,
    getPickerExpense,
} from '../../network/picker-service';
import { ToastError } from '../../utils/toast';
import {
    green,
    red,
    yellow,
    black,
    orange,
    navy,
    greenDark,
} from '../../utils/color';
import { currencyFormat, kg } from '../../utils/dateformat';
import Button from '../../components/button';
import { WIDTH } from '../../utils/constant';
import Animated, {
    BounceInDown,
    FadeIn,
    FadeInDown,
    FadeInUp,
    Layout,
    LightSpeedInLeft,
    LightSpeedInRight,
    LightSpeedOutLeft,
} from 'react-native-reanimated';
import Icon from '../../components/icon';
import Loader from '../../components/loader';
import { useCotton } from '../../context/cottonContext';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Header from '../../components/header';


export default function DateWiseList() {
    const [fullData, setFullData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
        useCotton();

    // useFocusEffect(
    //   useCallback(() => {
    //     getPickerWeight();
    //     getPickerExpense();
    //   }, []),
    // );

    useEffect(() => {
        if (Array.isArray(pickerWeight) && pickerWeight.length) getExpense();
        else setFullData([]);
    }, [pickerWeight]);

    const getExpense = async () => {
        setLoading(true);
        let grpPicker = groupBy(pickerWeight, v => v.picker);
        try {
            let result = [];
            await Promise.all(
                Object.keys(grpPicker).map(async v => {
                    let grpExpense = groupBy(pickerExpense, v => v.picker);
                    result.push({
                        picker: v,
                        amount:
                            sumBy(
                                grpPicker[v],
                                o => parseFloat(o.weight) * parseFloat(o?.rate),
                            ) - sumBy(grpExpense[v], o => parseFloat(o.amount)),
                        data: {
                            expense: grpExpense[v],
                            income: grpPicker[v],
                        },
                    });
                }),
            );
            setFullData(result);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            ToastError(error?.message, 'Picker');
        }
    };


    const renderItem = item => {
        let todayWeight = sumBy(filter(pickerWeight, o =>
            (moment().diff(moment(moment(o?.date).format('YYYY-MM-DD')), 'days')) == 0 && o?.picker == item?.picker),
            p => parseFloat(p.weight)) ?? 0
        let todayExpense = sumBy(filter(pickerExpense, o =>
            (moment().diff(moment(moment(o?.date).format('YYYY-MM-DD')), 'days')) == 0 && o?.picker == item?.picker),
            p => parseFloat(p.amount)) ?? 0
        return (
            <BaseView>
             {/* <Header
        style={styles.header}
        leftComponent={
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="back"
              size={28}
              style={{color: white, marginRight: 5}}
              onPress={() => goBack()}
            />
          </View>
        }
        centerComponent={
          <Text h2 numberOfLines={1} style={{width: '50%', color: white}}>
            PickersList
          </Text>
        }
        rightComponent={
            <Text></Text>
        }
        />            */}

        <View style={{backgroundColor:"red",marginTop:30}}>
            <Animated.View style={[styles.list, styles.line]}>
                <TouchableOpacity
                    disabled={loading}
                    onPress={() =>
                        navigate(
                            // item?.is_regulare ? 'RegularPickerDetail' : 'PickerDetail',
                            'PickerDetail',
                            { item },
                        )
                    }>
                    <Animated.View
                        style={styles.row}
                    // entering={LightSpeedInRight}
                    // layout={Layout.easing}
                    >
                        <Text numberOfLines={1} h3 style={{
                            width: '60%',
                        }}>
                            {item?.picker}
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
            </View>
            </BaseView>
        );
    };

    return (
        <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 150 }}
            data={sortBy(fullData, o => o?.picker)}
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
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignSelf: 'center',
        // backgroundColor:"red",
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
    line: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: WIDTH - 40,
    },
});
