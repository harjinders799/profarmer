import { View, StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'src/components/icon'
import Text from 'src/components/text'
import { orange, red } from 'src/utils/color'
import { navigate, replace } from 'src/navigation/ref'
import { strings } from 'src/translations/locale'
import { ToastError, ToastSuccess } from 'src/utils/toast'
import Loader from 'src/components/loader'
import { dateFormat } from 'src/utils/dateformat'
import { useTheme } from '@react-navigation/native'
import moment from 'moment'
import { deleteIneterstAmt } from 'src/network/interest-service'
import { deleteLabour, getLabourExpense } from '../../network/labour-service'
import { green } from '../../utils/color'

export default function LabourDetailAction({ data, totalExpense, totalLabour }) {
    const [loading, setLoading] = React.useState(false);
    const { colors } = useTheme();

    const delteData = async () => {
        Alert.alert(data?.giver, `${strings.delete_wt} ${strings.taken_amount} ${data?.amount}Rs`,
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        setLoading(true);
                        await deleteLabour(data?.id)
                        setLoading(false);
                        ToastSuccess(strings.weight_delete, "Amount")
                        navigate("Labour");
                    }
                },
                {
                    text: 'No'
                },
            ],
            { cancelable: true }
        )
    }
    return (
        <View style={[styles.list, { backgroundColor: colors.background }]}>
            <Loader visible={loading} />
            <View style={styles.row}>
                <Text h3 numberOfLines={1} >{dateFormat(data?.date)}</Text>
                <Text h3 numberOfLines={1} >{data?.count}{" " + strings.labour}</Text>
            </View>
            <View style={styles.row}>
                <Text h3>{strings.labour_rate}</Text>
                <Text h3>{data?.rate} /-</Text>
            </View>
            {!data?.is_regulare ?
                <View style={styles.row}>
                <Text h3>{strings.total_labour}</Text>
                <Text h3>{parseFloat(data?.rate) * parseFloat(data?.count)} /-</Text>
                </View>
                : null
            }
            <Text h4 style={{ textAlign: 'center', paddingTop: 20 }}>{strings.remark}</Text>
            <Text h4>{data?.detail}</Text>
            <View style={styles.icons}>
                <Icon
                    name="edit"
                    size={20}
                    color={orange}
                    style={[styles.icon, { backgroundColor: colors.card }]}
                    onPress={() => navigate("AddLabour", { data: { ...data, edit: true } })}
                />
                {data?.is_regulare ?
                    <Text h3 style={{ color: green, marginTop: 15 }}>{strings.regular}</Text>
                    : null
                }
                {totalExpense != 1 || totalLabour > 1 ?
                    <Icon
                        name="delete"
                        size={20}
                        color={red}
                        style={[styles.icon, { backgroundColor: colors.card }]}
                        onPress={delteData}
                    />
                    : null
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    list: {
        elevation: 3,
        width: '98%',
        padding: 20,
        marginTop: 30,
        borderRadius: 10,
        borderWidth: 1
    },
    row: {
        // width: '70%',
        // marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderStyle: 'dotted'

    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        justifyContent: 'space-between',
        position: 'absolute',
        top: -20,
    },
    icon: {
        elevation: 3,
        padding: 10,
        borderRadius: 20
    },
    picker: {
        width: '55%',
    },
    farm: {
        textAlign: 'left',
    },
    wt: {
        width: '35%',
        textAlign: 'right'
    }
})