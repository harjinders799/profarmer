import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import {
    FlatList,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
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
    let grpPicker = groupBy(pickerWeight, v => v.picker);

    // useFocusEffect(
    //   useCallback(() => {
    //     getPickerWeight();
    //     getPickerExpense();
    //   }, []),
    // );

    const renderItem = item => {
        return (
            <View style={[styles.list, styles.line]}>
                <TouchableOpacity onPress={() => { }}>
                    <View
                        style={styles.row}
                    // entering={LightSpeedInRight}
                    // layout={Layout.easing}
                    >
                        <Text
                            numberOfLines={1}
                            h3
                            style={{
                                width: '60%',
                            }}>
                            {item}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <BaseView style={{ padding: 20 }}>
            <Text h3>{strings.in_progress}</Text>
            <Text h3 style={{ marginVertical: 10 }}>Select Picker</Text>
            <FlatList
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 150 }}
                data={Object.keys(grpPicker)}
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
                iconName="plus"
                iconColor={white}
                label={strings.add_picker}
                btnStyle={{
                    width: `${40 * PixelRatio.getFontScale()}%`,
                    height: 40 * PixelRatio.getFontScale(),
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    zIndex: 999,
                }}
                onPress={() => navigate('AddPicker')}
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
