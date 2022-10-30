import * as React from 'react'
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'
import { findIndex, flatten } from 'lodash'
import { useTheme } from '@react-navigation/native'
import { useAuth } from 'src/context/context'
import Text from 'src/components/text'
import Icon from 'src/components/icon'
import Modal from 'src/components/Modal'
import Input from 'src/components/input'
import Button from 'src/components/button'
import Header from 'src/components/header'
import { HEIGHT } from 'src/utils/constant'
import { strings } from 'src/translations/locale'
import { commonStyle } from 'src/utils/style'
import { useStore } from 'src/context/context'
import { red } from 'src/utils/color'

export default function DataPicker(props) {
    const {
        data,
        placeholder = "Select here...",
        displayValue,
        selectedItem,
        setSelectedItem,
        intialVisible
    } = props;
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = React.useState(intialVisible ?? false);
    const [searchKey, setSearchKey] = React.useState(selectedItem)

    React.useEffect(() => {
        setSearchKey(selectedItem)
    }, [selectedItem])

    return (
        <View style={styles.screen}>
            <Input
                placeholder={placeholder}
                autoCapitalize='words'
                onFocus={() => setModalVisible(true)}
                onBlur={() => { setModalVisible(false); setSelectedItem(searchKey) }}
                value={searchKey ?? selectedItem}
                setValue={v => {
                    setSearchKey(v)
                    // let name = v.trim();
                    // if (Array.isArray(givers) && givers.length) {
                    //     let exist = givers.findIndex(o => o.toUpperCase() === name.toUpperCase())
                    //     if (exist == -1) {
                    //         setGivers([...givers, name])
                    //     }
                    // } else {
                    //     setGivers([name])
                    // }
                    // setSelectedItem(v)
                }}
                style={{ marginBottom: 10 }}
            />
            {modalVisible && data.length != 1 ?
                <View style={[styles.modal, { backgroundColor: colors.border }]}>
                    <Text h3 style={commonStyle.p_v_10}>{placeholder}</Text>
                    <FlatList
                        data={data}
                        keyboardShouldPersistTaps='always'
                        keyExtractor={(item) => Math.random().toString(6).substr(2)}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<Text>No Record Found</Text>}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                style={styles.list}
                                onPress={() => { setSelectedItem(item); setSearchKey(item); setModalVisible(false); }}
                            >
                                <Text h3>{typeof (item) === 'object' ? item[displayValue] : item}</Text>
                                {selectedItem == item && searchKey == item
                                    ?
                                    <Icon type="MaterialIcons" name="check" size={25} color={colors.primary} />
                                    :
                                    null
                                    // <Icon
                                    //     type="MaterialIcons"
                                    //     name="delete"
                                    //     size={25}
                                    //     color={red}
                                    //     onPress={() => alert('s')}
                                    // />
                                }
                            </TouchableOpacity>
                        }
                        ItemSeparatorComponent={() => (<View style={{ borderBottomWidth: StyleSheet.hairlineWidth }} />)}
                    />
                </View>
                : null
            }
        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        height: 50,
        marginBottom: 10
    },
    item: {
        borderWidth: 1,
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 13,
        width: '100%'
    },
    modal: {
        paddingHorizontal: 20,
        height: HEIGHT / 2,
        zIndex: 99,
        elevation: 5,
        borderRadius: 10,
        borderWidth: 1
    },
    btn: {
        width: '30%',
        height: 30,
        alignSelf: 'center'

    },
    list: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,

    },
});
