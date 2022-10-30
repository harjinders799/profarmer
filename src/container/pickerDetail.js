import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Text from 'src/components/text'
import { white } from 'src/utils/color'
import { useNavigation } from '@react-navigation/native'

export default function PickerDetail({
    data,
    totalAmount
}) {
    const { navigate } = useNavigation();

    return (
        <View style={styles.list}>
            <TouchableOpacity onPress={() => navigate('CottonFilter', { data })}>
                <Text numberOfLines={1} h3 style={{ width: '50%' }}>{data?.picker}</Text>
                <View style={styles.row}>
                    <Text numberOfLines={1} h4>{data?.total} Kg</Text>
                    {typeof (totalAmount) === 'number' && totalAmount > 0 ?
                        <Text numberOfLines={1} h4>{totalAmount} Rs</Text>
                        : null
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    list: {
        borderRadius: 10,
        elevation: 3,
        backgroundColor: white,
        padding: 10,
        marginVertical: 10,
        width: '98%',
        alignSelf: 'center'
    },
})