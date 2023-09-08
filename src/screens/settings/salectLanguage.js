import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
// import Text from '././text';
// import Icon from '././icon';
import { strings } from 'src/translations/locale';
import { useTheme } from '@react-navigation/native';
import { useLang } from 'src/context/langContext';
import Text from '../../components/text';
import Icon from '../../components/icon';
import Header from '../../components/header';
import BaseView from 'src/container/base';
import { goBack } from '../../navigation/ref';

const langs = [
    { code: 'pb', label: 'punjabi' },
    { code: 'hi', label: 'hindi' },
    { code: 'en', label: 'english' },
];
const SalectLanguage = props => {
    const { style } = props;
    const { lang, setLang } = useLang();
    const { colors } = useTheme();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!lang?.code) setShow(true);
    }, [lang]);
    return (
        <BaseView style={[styles.menu]}>
            <Header
                leftComponent={
                    <Icon
                        name="back"
                        size={28}
                        color={colors.text}
                        onPress={() => goBack()}
                    />
                }
                centerComponent={<Text h2>{strings.lang}</Text>}
                rightComponent={<Text h2> </Text>}
            />
            {langs.map((v, i) => (
                <TouchableOpacity
                    key={i}
                    style={[styles.main]}
                    onPress={() => {
                        setLang(v);
                        goBack();
                    }}>
                    <Text h3 black style={[styles.txt]}>
                        {strings[v?.label]}
                    </Text>
                    {strings.getLanguage() === v.code ? (
                        <Icon name="check" size={25} color={colors.primary} />
                    ) : null}
                </TouchableOpacity>
            ))}
        </BaseView>
    )
}
export default SalectLanguage

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'center',
        padding: 5
    },
    txt: {
        marginVertical: 5,
    },
    menu: {
        padding: 20,

    },
});
