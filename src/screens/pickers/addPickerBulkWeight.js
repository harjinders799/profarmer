import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import Text from '@components/text';
import BaseView from '@container/base';
import { goBack } from '@navigation/ref';
import { strings } from '@translations/locale';
import Header from '@components/header';
import Loader from '@components/loader';
import { ToastError, ToastSuccess } from '@utils/toast';
import { dateFormat } from '@utils/dateformat';
import Icon from '@components/icon';
import { common } from '@utils/style';
import { addPickerWeightBulk, updateGroup } from '@network/picker-service';
import DateTimePicker from '@components/DateTime';
import DropdownPicker from '@components/dropdown';
import { sumBy } from 'lodash';
import { assignedPickers, unassignPickers } from '@utils/helper';
import { hp } from '@utils/fonts';

export default function AddPickerBulkWeight() {
    const { colors } = useTheme();
    const {
        params: { pickers, item: group, groups },
    } = useRoute();

    let pickersData = useCallback(
        group?.id ? assignedPickers(pickers, group) : pickers,
        [pickers, group],
    );

    let unassignedPickersData = useCallback(
        group?.id ? unassignPickers(pickers, groups, group?.id) : pickers,
        [pickers, group, groups],
    );

    const [date, setDate] = useState(new Date());
    const [remark, setRemark] = useState('');
    const [data, setData] = React.useState(
        pickersData.map(obj => ({
            name: obj.name,
            weight: '',
            rate: obj.rate,
            pid: obj.id,
            total_earning: obj.total_earning,
            total_weight: obj.total_weight,
        })),
    );
    const [loading, setLoading] = React.useState(false);
    const [showDate, setShowDate] = useState(false);
    const [uniqueLetters, setUniqueLetters] = useState([]);
    const [activeLetter, setActiveLetter] = useState();
    const scrollViewRef = React.useRef();

    useEffect(() => {
        // Extract unique first letters
        const letters = new Set(
            data.map(item => item.name.charAt(0).toUpperCase()),
        );
        setUniqueLetters(Array.from(letters).sort());
    }, [data]);

    const addWeight = async () => {
        try {
            setLoading(true);
            await addPickerWeightBulk(data, date, pickers, remark);
            if (group?.members.length < data.length) {
                const members = data
                    .map(p => p?.pid) // Map to pid
                    .filter(pid => pid != null && pid !== ''); // Filter out null, undefined, or empty string

                // Pass the filtered members list to updateGroup
                await updateGroup({ id: group?.id, members });
            }
            setLoading(false);
            ToastSuccess(strings.successfully_saved);
            goBack();
        } catch (error) {
            setLoading(false);
            ToastError(error?.message);
        }
    };

    const addMoreWeight = i => {
        setData(prevs => {
            let data = [...prevs];
            if (
                data[i].weight.length &&
                data[i].weight.charAt(data[i].weight.length - 1) !== '+'
            )
                data[i].weight += '+';
            return data;
        });
    };

    const scrollToLetter = letter => {
        // Find the index of the first item that starts with the letter
        const index = data.findIndex(
            item => item.name.charAt(0).toUpperCase() === letter,
        );
        if (index !== -1 && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: index * 60, animated: true }); // Adjust the multiplier based on item height
        }
        setActiveLetter(letter);
        setTimeout(() => {
            setActiveLetter();
        }, 2000);
    };

    return (
        <BaseView>
            <Loader visible={loading} />
            <Header back label={strings.pickers_weight} />
            <View style={common.row_top_start}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.form}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 10 }}
                    automaticallyAdjustKeyboardInsets
                    keyboardShouldPersistTaps="always">
                    <View style={common.row_btw}>
                        <Pressable
                            onPress={() => {
                                setShowDate(true);
                                Keyboard.dismiss();
                            }}
                            style={{ width: '30%' }}>
                            <Input
                                editable={false}
                                placeholder={strings.date}
                                value={dateFormat(date)}
                                onPress={() => {
                                    setShowDate(true);
                                    Keyboard.dismiss();
                                }}
                            />
                        </Pressable>
                        <Input
                            value={remark}
                            setValue={setRemark}
                            multiline
                            placeholder={strings.remark}
                            style={{ width: '68%' }}
                        />
                    </View>
                    {data.map((picker, i) => {
                        let isActiveScroll =
                            picker.name.charAt(0).toUpperCase() === activeLetter;
                        return (
                            <View
                                key={picker?.name}
                                style={[
                                    common.row_btw,
                                    {
                                        backgroundColor: isActiveScroll
                                            ? colors.disable
                                            : colors.background,
                                        transform: [
                                            {
                                                scaleY: isActiveScroll ? 0.95 : 1,
                                            },
                                        ],
                                        borderRadius: 10,
                                    },
                                ]}>
                                <DropdownPicker
                                    value={picker?.name}
                                    data={unassignedPickersData.filter(
                                        p =>
                                            !data.some(d => d.name === p.name) ||
                                            p.name == picker?.name,
                                    )}
                                    // disable={data.length == pickers.length && picker?.name}
                                    labelField="name"
                                    valueField="name"
                                    style={{ width: '42%' }}
                                    dropdownStyle={{
                                        minHeight: 45,
                                        marginTop: 0,
                                        overflow: 'hidden',
                                        borderColor: picker?.weight ? colors.success : colors.error,
                                        backgroundColor: picker?.weight
                                            ? colors.success + 20
                                            : colors.error + 20,
                                    }}
                                    onChange={value => {
                                        setData(prevs => {
                                            let data = [...prevs];
                                            data[i].name = value.name;
                                            data[i].rate = value.rate;
                                            data[i].total_earning = value.total_earning;
                                            data[i].total_weight = value.total_weight;
                                            data[i].weight = '';
                                            data[i].pid = value.id;
                                            return data;
                                        });
                                    }}
                                />
                                <Input
                                    // label={strings.weight}
                                    placeholder={strings.weight}
                                    value={picker?.weight}
                                    maxLength={30}
                                    multiline
                                    setValue={value =>
                                        setData(prevs => {
                                            let data = [...prevs];

                                            // Remove any non-numeric characters except for '+'
                                            let newValue = value.replace(/[^0-9+]/g, '');

                                            // Prevent starting with '+' and multiple consecutive '+'
                                            if (newValue.startsWith('+')) {
                                                newValue = newValue.substring(1); // Remove leading '+'
                                            }

                                            // Replace multiple '+' with a single '+' (if needed)
                                            newValue = newValue.replace(/\++/g, '+');

                                            data[i].weight = newValue;
                                            return data;
                                        })
                                    }
                                    style={{ width: '55%' }}
                                    innerStyle={{
                                        borderColor: picker?.weight ? colors.success : colors.error,
                                    }}
                                    inputStyle={{
                                        width: '85%',
                                        height: 45 + picker?.weight.length,
                                    }}
                                    keyboardType="phone-pad"
                                    rightComponent={
                                        <>
                                            <Text style={{ position: 'absolute', bottom: 0, right: 5 }}>
                                                =
                                                {sumBy(picker?.weight.split('+'), v =>
                                                    parseFloat(v ? v : 0),
                                                )}
                                            </Text>
                                            <Pressable
                                                hitSlop={20}
                                                style={{ marginBottom: 15 }}
                                                onPress={() => addMoreWeight(i)}>
                                                <Icon
                                                    name={'plus'}
                                                    color={colors.success}
                                                    size={20}
                                                    onPress={() => addMoreWeight(i)}
                                                />
                                            </Pressable>
                                        </>
                                    }
                                />
                            </View>
                        );
                    })}
                    {data.length < unassignedPickersData.length &&
                        data.every(o => o.name) ? (
                        <Button
                            label={strings.picker}
                            iconLeft={'plus'}
                            small
                            onPress={() =>
                                setData(prevs => {
                                    let data = [...prevs];
                                    if (data.every(o => o.name))
                                        data.push({ name: '', weight: '' });
                                    return data;
                                })
                            }
                            btnStyle={{ alignSelf: 'flex-end' }}
                        />
                    ) : null}
                    <DateTimePicker
                        show={showDate}
                        setShow={setShowDate}
                        date={date}
                        setDate={value => setDate(value)}
                    />
                    <Button label={strings.save} onPress={addWeight} />
                </ScrollView>
                <View
                    style={[styles.letterContainer, { backgroundColor: colors.disable }]}>
                    {uniqueLetters.map(letter => (
                        <Pressable
                            hitSlop={10}
                            key={letter}
                            onPress={() => scrollToLetter(letter)}>
                            <Text style={styles.letter}>{letter}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </BaseView>
    );
}
const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
    addMoney: {
        position: 'relative',
        width: '8%',
        ...common.row_center,
    },
    plus: {
        marginLeft: 2,
    },
    letterContainer: {
        padding: 5,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'space-evenly',
        zIndex: 100,
        maxHeight: hp(80),
        minHeight: hp(50)
    },
    letter: {
        marginVertical: 10,
    },
});
