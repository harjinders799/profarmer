import React, { useEffect, useState } from 'react'
import Text from 'src/components/text'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { white } from 'src/utils/color'
import _, { every, filter, find, groupBy, some, sumBy } from 'lodash'
import PickerRate from 'src/container/PickerRate'
import PickerDetail from 'src/container/pickerDetail'
import { strings } from 'src/translations/locale'
import { dateFormat } from 'src/utils/dateformat'
import Icon from 'src/components/icon'
import { navigate } from 'src/navigation/ref'
import { getAllLabourExpense, getLabourExpense, getLabourLeave } from '../../network/labour-service'
import { ToastError } from '../../utils/toast'
import { green, red } from '../../utils/color'
import { dayCount } from '../../utils/dateformat'
import Button from '../../components/button'
import { WIDTH } from '../../utils/constant'
import Animated, { BounceInDown, FadeIn, FadeInDown, FadeInUp, Layout, LightSpeedInLeft, LightSpeedInRight, LightSpeedOutLeft } from 'react-native-reanimated'

export default function DateWiseList({ data }) {
    const [fullData, setFullData] = useState([]);

    useEffect(() => {
        if (data.length) getExpense();
    }, [data]);

    const getExpense = async () => {
        let arr = [];
        let grp = groupBy(data, v => v.labour)
        Object.keys(grp).map(v => arr.push({ labour: v, total: sumBy(grp[v], o => parseInt(o.count)), is_regulare: some(grp[v], o => o?.is_regulare), data: grp[v] }))
        setFullData(arr)
        try {
            let result = [];
            await Promise.all(
                Object.keys(grp).map(async v => {
                    let res = await getLabourExpense(v);
                    let expense = [];
                    let grp = groupBy(res, v => v.labour)
                    Object.keys(grp).map(v => expense.push({ labour: v, amount: sumBy(grp[v], o => parseInt(o.amount)) }))
                    let leave = [];
                    // console.log(grp[v])
                    // if (grp[v]?.is_regulare) {
                    let lev = await getLabourLeave(v);
                    let grpLeave = groupBy(lev, v => v.labour)
                    Object.keys(grpLeave).map(v => leave.push({ labour: v, leaves: sumBy(grpLeave[v], o => parseInt(o.count)) }))
                    // console.log(leave)
                    result.push({ ...expense[0], ...leave[0], ...find(arr, o => o.labour == v) })
                    // }
                    // result.push({ ...expense[0], ...leave[0], ...find(arr, o => o.labour == v) })
                })
            )

            setFullData(result)
        } catch (error) {
            ToastError(error?.message, 'Labour')
        }
    }

    const renderItem = (item) => {
        // console.log(item)
        let tot = 0
        if (item.data) {
            item.data.map(v => {
                tot += (item?.is_regulare ? item?.leaves ? dayCount(v?.date) - item?.leaves : dayCount(v?.date) : parseFloat(v?.count)) * parseFloat(v?.rate)
                return tot;
            })
        }
        // console.log(tot)
        return (
            <Animated.View style={[styles.list, styles.line]}>
                <TouchableOpacity onPress={() => navigate(item?.is_regulare ? 'RegularLabourDetail' : 'LabourDetail', { item })}>
                    {item?.is_regulare ? <Text numberOfLines={1} style={{ color: green }} h4>{strings.regular + ' ' + strings.labour}</Text> : null}
                    <View style={styles.row}>
                        <Text numberOfLines={1} h3 style={{ width: '60%' }}>{item?.labour}</Text>
                        <Text h5 >{strings.view}</Text>
                    </View>
                    {!item?.is_regulare && !isNaN(tot - item?.amount) ?
                        <Animated.View style={styles.row} entering={FadeInUp} layout={Layout.springify}>
                            <Text numberOfLines={1} h4>{strings.final}</Text>
                            <Text numberOfLines={1} h3
                                style={{ color: tot - item?.amount > 0 ? green : red }}
                            >{tot - item?.amount} /-</Text>
                        </Animated.View>
                        :
                        null
                    }
                    {
                        item?.is_regulare && !isNaN(tot - item?.amount) ?
                            <>
                                <Animated.View style={styles.row} entering={FadeInUp}
                                    layout={Layout.damping}>
                                    <Text numberOfLines={1} h4>{strings.final}</Text>
                                    <Text numberOfLines={1} h3
                                        style={{ color: tot - item?.amount > 0 ? green : red }}
                                    >{tot - item?.amount} /-</Text>
                                </Animated.View>
                                <Button
                                    label={"Add Leave"}
                                    onPress={() => navigate('AddLabourLeave', { item })}
                                    btnStyle={{ width: '50%', height: 30, marginVertical: 10 }}
                                />
                            </>
                            : null
                    }
                </TouchableOpacity>
            </Animated.View>
        )
    }
    return (
        <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            data={fullData}
            keyExtractor={item => Math.random().toString()}
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', paddingTop: 30 }}>{strings.no_data}</Text>}
            extraData={data}
            showsVerticalScrollIndicator={false}
            // ItemSeparatorComponent={() => <View style={styles.line} />}
            renderItem={({ item }) => renderItem(item)}
        />
    )
}
const styles = StyleSheet.create({
    list: {
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 5
    },
    icon: {
        elevation: 1,
        width: 30,
        height: 30,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 5
    },
    line: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: WIDTH - 40
    }
})