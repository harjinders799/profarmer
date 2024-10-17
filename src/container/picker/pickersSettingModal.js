import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '@react-navigation/native';
import Icon from '@components/icon';
import Text from '@components/text';
import { strings } from '@translations/locale';
import { common } from '@utils/style';
import Input from '@components/input';
import Button from '@components/button';
import { currencyInput } from '@utils/dateformat';
import { onChangeValue } from '@utils/helper';
import { ToastError, ToastSuccess } from '@utils/toast';
import { updateAllPickerRate } from '@network/picker-service';

const PickersSettingModal = ({ }) => {
    const { colors } = useTheme();
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        rate: '',
    });

    const handleTogglePopup = useCallback(() => {
        setShowPopup(prev => !prev);
    }, []);

    const onPress = async () => {
        try {
            setLoading(true);
            await updateAllPickerRate(data.rate);
            ToastSuccess(strings.successfully_updated)
            setData({ rate: '' })
            handleTogglePopup()
        } catch (error) {
            ToastError(error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Menu opened={showPopup} onBackdropPress={handleTogglePopup}>
            <MenuTrigger>
                <TouchableOpacity style={styles.trigger} onPress={handleTogglePopup}>
                    <Icon name={'settings'} type="Feather" size={20} />
                </TouchableOpacity>
            </MenuTrigger>
            <MenuOptions
                customStyles={{
                    optionsWrapper: {
                        ...styles.optionsWrapper,
                        backgroundColor: colors.background,
                    },
                    optionsContainer: {
                        backgroundColor: 'transparent',
                        elevation: 0,
                    },
                }}
                optionsContainerStyle={styles.optionsContainer}>
                <View style={styles.box}>
                    <Text h4 semi>
                        {strings.change_rate}
                    </Text>
                    <Text center color={colors.warning} style={styles.text}>
                        {strings.change_rate_waring}
                    </Text>
                    <Input
                        value={currencyInput(data?.rate)}
                        setValue={value =>
                            onChangeValue({ setData, key: 'rate', value, isAmount: true })
                        }
                        placeholder={strings.enter_rate}
                        keyboardType={'numeric'}
                    />
                    <Button
                        label={strings.update}
                        loading={loading}
                        btnStyle={{ height: 40, width: '80%' }}
                        onPress={onPress}
                    />
                </View>
            </MenuOptions>
        </Menu>
    );
};

const styles = StyleSheet.create({
    trigger: {
        zIndex: 99,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    text: {
        marginVertical: 5,
    },
    divider: {
        height: 0.5,
        backgroundColor: 'transparent', // Will be set dynamically
    },
    optionsContainer: {
        width: '95%',
    },
    optionsWrapper: {
        top: 20,
        // right: 20,
        borderRadius: 5,
        overflow: 'hidden',
        minWidth: '35%',
        ...common.shadow,
    },
    box: {
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '3%',
    },
});

export default PickersSettingModal;
