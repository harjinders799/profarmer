import React from 'react';
import { Image, StyleSheet } from 'react-native';
import BaseView from '@container/base';
import { useTheme } from '@react-navigation/native';
import Header from '@components/header';
import Text from '@components/text';
import { strings } from 'src/translations/locale';

export default function AboutUs() {
    const { colors } = useTheme();

    return (
        <BaseView space>
            <Header back label={'Hi Farmer'} />
            <Text style={styles.complimentText}>
                {strings.compliment}
            </Text>
            <Text style={styles.compliment2Text}>
                {strings.compliment2}
            </Text>
            <Image
                source={require('../../assets/upi.png')}
                resizeMode="contain"
                style={styles.image}
            />
        </BaseView>
    );
}

const styles = StyleSheet.create({
    complimentText: {
        marginTop: 10,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    compliment2Text: {
        paddingTop: 20,
        textAlign: 'center',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '35%',
        marginTop: 10,
    },
});
